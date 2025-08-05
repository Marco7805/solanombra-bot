const { Connection, Keypair, PublicKey, Transaction } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction } = require('@solana/spl-token');
const express = require('express');
const fs = require('fs');

// Configurazione
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC, 'confirmed');

// Token addresses
const TOKEN_MINT = new PublicKey('3Gne3oSC5n23yhQvVbabtWbeaCH9d4mcc9KDCxY3QYxh'); // USDT clone
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC
const ORCA_POOL = new PublicKey('Aa36auc7xCcDDyCR52K89casQw9hTGuJVDmPusUYbcZS'); // Pool Orca

// Carica wallet
const walletAKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('config/your_wallet.json', 'utf8'))));
const walletBKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('config/wallet_b.json', 'utf8'))));

// Express server per health checks
const app = express();
const PORT = process.env.PORT || 3000;

let isRunning = true;
let currentStep = 0; // 0=A compra, 1=B vende, 2=A vende, 3=B compra

// Statistiche bot
const botStatus = {
    startTime: new Date(),
    totalTrades: 0,
    lastTrade: null,
    currentPrice: 1.00,
    walletABalance: 0,
    walletBBalance: 0
};

function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

function getRandomAmount() {
    // Micro operazioni: 0.1 - 2.0 USDT
    return Math.random() * 1.9 + 0.1;
}

function getRandomInterval() {
    // Timing casuale: 20-45 secondi
    return Math.random() * 25000 + 20000;
}

function getRandomPrice() {
    // Range prezzo: 0.85 - 1.15
    return Math.random() * 0.3 + 0.85;
}

async function getTokenBalance(wallet, tokenMint) {
    try {
        const tokenAccount = await getAssociatedTokenAddress(tokenMint, wallet.publicKey);
        const balance = await connection.getTokenAccountBalance(tokenAccount);
        return parseFloat(balance.value.uiAmount || 0);
    } catch (error) {
        return 0;
    }
}

async function executeOrcaSwap(wallet, operation, amount, tokenMint) {
    try {
        // Simula swap su Orca (per ora usa transfer per generare volume)
        const fromTokenAccount = await getAssociatedTokenAddress(tokenMint, wallet.publicKey);
        const toTokenAccount = await getAssociatedTokenAddress(tokenMint, wallet.publicKey);
        
        // Crea transazione di transfer per simulare volume
        const transaction = new Transaction();
        
        // Aggiungi transfer instruction (simula swap)
        const transferInstruction = createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            wallet.publicKey,
            Math.floor(amount * 1000000) // Converti in lamports (6 decimali)
        );
        
        transaction.add(transferInstruction);
        
        // Invia transazione
        const signature = await connection.sendTransaction(transaction, [wallet]);
        await connection.confirmTransaction(signature);
        
        return signature;
    } catch (error) {
        log(`❌ Errore swap: ${error.message}`);
        return null;
    }
}

async function executeTrade() {
    if (!isRunning) return;
    
    try {
        const step = currentStep % 4;
        let wallet, operation, amount, price;
        
        // Determina operazione basata sul step
        switch (step) {
            case 0: // A compra
                wallet = walletAKeypair;
                operation = 'ACQUISTO';
                amount = getRandomAmount();
                price = getRandomPrice();
                log(`🟢 STEP ${step}: Wallet A ACQUISTA ${amount.toFixed(2)} USDT a $${price.toFixed(2)}`);
                break;
            case 1: // B vende
                wallet = walletBKeypair;
                operation = 'VENDITA';
                amount = getRandomAmount();
                price = getRandomPrice();
                log(`🔴 STEP ${step}: Wallet B VENDE ${amount.toFixed(2)} USDT a $${price.toFixed(2)}`);
                break;
            case 2: // A vende
                wallet = walletAKeypair;
                operation = 'VENDITA';
                amount = getRandomAmount();
                price = getRandomPrice();
                log(`🔴 STEP ${step}: Wallet A VENDE ${amount.toFixed(2)} USDT a $${price.toFixed(2)}`);
                break;
            case 3: // B compra
                wallet = walletBKeypair;
                operation = 'ACQUISTO';
                amount = getRandomAmount();
                price = getRandomPrice();
                log(`🟢 STEP ${step}: Wallet B ACQUISTA ${amount.toFixed(2)} USDT a $${price.toFixed(2)}`);
                break;
        }
        
        // Esegui swap su Orca
        const signature = await executeOrcaSwap(wallet, operation, amount, TOKEN_MINT);
        
        if (signature) {
            botStatus.totalTrades++;
            botStatus.lastTrade = {
                step,
                wallet: step % 2 === 0 ? 'A' : 'B',
                operation,
                amount: amount.toFixed(2),
                price: price.toFixed(2),
                signature,
                timestamp: new Date()
            };
            
            log(`✅ Swap completato: ${signature}`);
            log(`📊 Totale operazioni: ${botStatus.totalTrades}`);
            
            // Aggiorna bilanci
            botStatus.walletABalance = await getTokenBalance(walletAKeypair, TOKEN_MINT);
            botStatus.walletBBalance = await getTokenBalance(walletBKeypair, TOKEN_MINT);
            
            log(`💰 Wallet A: ${botStatus.walletABalance.toFixed(2)} USDT`);
            log(`💰 Wallet B: ${botStatus.walletBBalance.toFixed(2)} USDT`);
        }
        
        currentStep++;
        
        // Prossima operazione con timing casuale
        const nextInterval = getRandomInterval();
        log(`⏰ Prossima operazione tra ${(nextInterval/1000).toFixed(1)} secondi`);
        
        setTimeout(executeTrade, nextInterval);
        
    } catch (error) {
        log(`❌ Errore generale: ${error.message}`);
        setTimeout(executeTrade, 30000); // Retry dopo 30 secondi
    }
}

// Express routes
app.get('/', (req, res) => {
    res.json({ 
        status: 'Bot Orca Trading Attivo',
        pool: ORCA_POOL.toString(),
        token: TOKEN_MINT.toString()
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.get('/status', (req, res) => {
    res.json(botStatus);
});

app.get('/stop', (req, res) => {
    isRunning = false;
    res.json({ status: 'Bot fermato' });
});

app.get('/start', (req, res) => {
    isRunning = true;
    executeTrade();
    res.json({ status: 'Bot avviato' });
});

// Gestione shutdown
process.on('SIGINT', () => {
    log('🛑 Fermando bot...');
    isRunning = false;
    process.exit(0);
});

process.on('SIGTERM', () => {
    log('🛑 Fermando bot...');
    isRunning = false;
    process.exit(0);
});

// Avvia server
app.listen(PORT, () => {
    log(`🚀 Server avviato su porta ${PORT}`);
    log(`📊 Pool Orca: ${ORCA_POOL.toString()}`);
    log(`🪙 Token USDT: ${TOKEN_MINT.toString()}`);
    log(`👛 Wallet A: ${walletAKeypair.publicKey.toString()}`);
    log(`👛 Wallet B: ${walletBKeypair.publicKey.toString()}`);
});

// Avvia bot
async function startBot() {
    log('🤖 Avvio bot Orca Trading...');
    
    // Controlla bilanci iniziali
    botStatus.walletABalance = await getTokenBalance(walletAKeypair, TOKEN_MINT);
    botStatus.walletBBalance = await getTokenBalance(walletBKeypair, TOKEN_MINT);
    
    log(`💰 Wallet A: ${botStatus.walletABalance.toFixed(2)} USDT`);
    log(`💰 Wallet B: ${botStatus.walletBBalance.toFixed(2)} USDT`);
    
    // Avvia trading
    executeTrade();
}

startBot(); 