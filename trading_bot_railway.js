const { Connection, Keypair, PublicKey, Transaction } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction } = require('@solana/spl-token');
const express = require('express');
const fs = require('fs');

// Configurazione
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
const TOKEN_MINT = new PublicKey('3Gne3oSC5n23yhQvVbabtWbeaCH9d4mcc9KDCxY3QYxh');
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const ORCA_POOL = new PublicKey('Aa36auc7xCcDDyCR52K89casQw9hTGuJVDmPusUYbcZS');

// Carica i wallet
const walletAData = JSON.parse(fs.readFileSync('config/your_wallet.json', 'utf8'));
const walletBData = JSON.parse(fs.readFileSync('config/wallet_b.json', 'utf8'));

const walletA = Keypair.fromSecretKey(new Uint8Array(walletAData));
const walletB = Keypair.fromSecretKey(new Uint8Array(walletBData));

// Configurazione trading
const MIN_AMOUNT = 0.5 * 1000000; // 0.5 USDT (6 decimali)
const MAX_AMOUNT = 2.0 * 1000000; // 2.0 USDT (6 decimali)
const MIN_INTERVAL = 20000; // 20 secondi
const MAX_INTERVAL = 45000; // 45 secondi
const MIN_PRICE = 0.85; // Prezzo minimo
const MAX_PRICE = 1.15; // Prezzo massimo

let currentStep = 0; // 0=A vende, 1=B compra, 2=B vende, 3=A compra
let isRunning = true;
let botStatus = {
    started: new Date().toISOString(),
    operations: 0,
    lastOperation: null,
    errors: 0
};

// Express server per Railway
const app = express();
const PORT = process.env.PORT || 3000;

// Logging per Railway
function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

function getRandomAmount() {
    return Math.floor(Math.random() * (MAX_AMOUNT - MIN_AMOUNT + 1)) + MIN_AMOUNT;
}

function getRandomInterval() {
    return Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1)) + MIN_INTERVAL;
}

function getRandomPrice() {
    return (Math.random() * (MAX_PRICE - MIN_PRICE) + MIN_PRICE).toFixed(4);
}

function getNextOperation() {
    const steps = [
        { wallet: 'A', operation: 'VENDITA' },
        { wallet: 'B', operation: 'ACQUISTO' },
        { wallet: 'B', operation: 'VENDITA' },
        { wallet: 'A', operation: 'ACQUISTO' }
    ];
    
    const step = steps[currentStep];
    currentStep = (currentStep + 1) % 4; // Loop 0-3
    
    return step;
}

async function executeOrcaSwap(wallet, isSelling, amount) {
    try {
        log(`🔄 Esecuzione swap ${isSelling ? 'VENDITA' : 'ACQUISTO'} su Orca...`);
        
        // Ottieni token accounts
        const usdtAccount = await getAssociatedTokenAddress(TOKEN_MINT, wallet.publicKey);
        const otherWallet = wallet === walletA ? walletB : walletA;
        const otherUsdtAccount = await getAssociatedTokenAddress(TOKEN_MINT, otherWallet.publicKey);
        
        // Crea l'istruzione di transfer (simula swap)
        const transferInstruction = createTransferInstruction(
            usdtAccount,
            otherUsdtAccount,
            wallet.publicKey,
            amount
        );
        
        // Crea e invia la transazione
        const transaction = new Transaction().add(transferInstruction);
        const signature = await connection.sendTransaction(transaction, [wallet]);
        
        log(`✅ Swap completato! Signature: ${signature}`);
        return signature;
        
    } catch (error) {
        log(`❌ Errore swap: ${error.message}`);
        throw error;
    }
}

async function executeTrade() {
    if (!isRunning) return;
    
    try {
        const step = getNextOperation();
        const walletKeypair = step.wallet === 'A' ? walletA : walletB;
        const walletName = step.wallet;
        const operation = step.operation;
        const amount = getRandomAmount();
        const price = getRandomPrice();
        
        log(`\n🔄 Operazione ${walletName}: ${operation}`);
        log(`Wallet: ${walletKeypair.publicKey.toString()}`);
        log(`💰 Trading: ${amount/1000000} USDT @ $${price}`);
        log(`⏱️  Prezzo target: $${price} (range: $${MIN_PRICE}-$${MAX_PRICE})`);

        // Esegui swap reale su Orca (simulato con transfer)
        const isSelling = operation === 'VENDITA';
        const signature = await executeOrcaSwap(walletKeypair, isSelling, amount);

        log(`✅ Operazione ${walletName} (${operation}) completata`);
        log(`🔗 Transaction: https://solscan.io/tx/${signature}`);

        // Aggiorna status
        botStatus.operations++;
        botStatus.lastOperation = {
            timestamp: new Date().toISOString(),
            operation: operation,
            wallet: walletName,
            amount: amount/1000000,
            price: price,
            signature: signature
        };

        // Calcola il prossimo intervallo casuale
        const nextInterval = getRandomInterval();
        log(`⏰ Prossima operazione tra ${nextInterval/1000} secondi`);
        
        // Programma la prossima operazione
        setTimeout(executeTrade, nextInterval);

    } catch (error) {
        log(`❌ Errore operazione: ${error.message}`);
        botStatus.errors++;
        // Riprova tra 30 secondi in caso di errore
        setTimeout(executeTrade, 30000);
    }
}

// Routes per Railway
app.get('/', (req, res) => {
    res.json({
        status: 'Bot attivo',
        message: 'SolanOmbra Trading Bot su Railway',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        bot: botStatus,
        uptime: process.uptime()
    });
});

app.get('/status', (req, res) => {
    res.json(botStatus);
});

// Avvia server
app.listen(PORT, () => {
    log(`🚀 Server avviato su porta ${PORT}`);
});

// Gestione graceful shutdown
process.on('SIGINT', () => {
    log('🛑 Arresto bot in corso...');
    isRunning = false;
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('🛑 Arresto bot in corso...');
    isRunning = false;
    process.exit(0);
});

async function startBot() {
    log('🤖 BOT AVVIATO - RAILWAY');
    log('Token: ' + TOKEN_MINT.toString());
    log('Pool Orca: ' + ORCA_POOL.toString());
    log(`💰 Range operazioni: ${MIN_AMOUNT/1000000}-${MAX_AMOUNT/1000000} USDT`);
    log(`⏱️  Intervallo: ${MIN_INTERVAL/1000}-${MAX_INTERVAL/1000} secondi`);
    log(`💵 Range prezzo: $${MIN_PRICE}-$${MAX_PRICE}`);
    log('☁️  Modalità: Railway (24/7)');

    // Prima operazione
    await executeTrade();
}

// Avvia il bot
startBot().catch((error) => {
    log(`❌ Errore avvio bot: ${error.message}`);
    process.exit(1);
}); 