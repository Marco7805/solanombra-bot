const { Connection, Keypair, PublicKey, Transaction } = require('@solana/web3.js');
const { Liquidity, LiquidityPoolKeys, LiquidityPoolInfo, LiquidityPoolLayout } = require('@raydium-io/raydium-sdk');
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } = require('@solana/spl-token');
const fs = require('fs');

// Configurazione
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
const TOKEN_MINT = new PublicKey('3Gne3oSC5n23yhQvVbabtWbeaCH9d4mcc9KDCxY3QYxh');
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

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

async function executeSwap(wallet, isSelling, amount) {
    try {
        console.log(`🔄 Esecuzione swap ${isSelling ? 'VENDITA' : 'ACQUISTO'} su Raydium...`);
        
        // Per ora simuliamo lo swap (implementazione completa richiede pool specifico)
        console.log(`💰 Simulazione swap: ${amount/1000000} ${isSelling ? 'USDT→USDC' : 'USDC→USDT'}`);
        
        // TODO: Implementare swap reale con Raydium SDK
        // Richiede configurazione del pool specifico
        
        // Simula transazione
        const mockSignature = 'simulated_' + Date.now();
        console.log(`✅ Swap simulato! Signature: ${mockSignature}`);
        
        return mockSignature;
        
    } catch (error) {
        console.error(`❌ Errore swap:`, error.message);
        throw error;
    }
}

async function executeTrade() {
    try {
        const step = getNextOperation();
        const walletKeypair = step.wallet === 'A' ? walletA : walletB;
        const walletName = step.wallet;
        const operation = step.operation;
        const amount = getRandomAmount();
        const price = getRandomPrice();
        
        console.log(`\n🔄 Operazione ${walletName}: ${operation}`);
        console.log(`Wallet: ${walletKeypair.publicKey.toString()}`);
        console.log(`💰 Trading: ${amount/1000000} USDT @ $${price}`);
        console.log(`⏱️  Prezzo target: $${price} (range: $${MIN_PRICE}-$${MAX_PRICE})`);

        // Esegui swap reale su Raydium
        const isSelling = operation === 'VENDITA';
        const signature = await executeSwap(walletKeypair, isSelling, amount);

        console.log(`✅ Operazione ${walletName} (${operation}) completata`);
        console.log(`🔗 Transaction: ${signature}`);

        // Calcola il prossimo intervallo casuale
        const nextInterval = getRandomInterval();
        console.log(`⏰ Prossima operazione tra ${nextInterval/1000} secondi`);
        
        // Programma la prossima operazione
        setTimeout(executeTrade, nextInterval);

    } catch (error) {
        console.error(`❌ Errore operazione:`, error.message);
        // Riprova tra 30 secondi in caso di errore
        setTimeout(executeTrade, 30000);
    }
}

async function startBot() {
    console.log('🤖 BOT AVVIATO - OPERAZIONI SU RAYDIUM');
    console.log('Token:', TOKEN_MINT.toString());
    console.log(`💰 Range operazioni: ${MIN_AMOUNT/1000000}-${MAX_AMOUNT/1000000} USDT`);
    console.log(`⏱️  Intervallo: ${MIN_INTERVAL/1000}-${MAX_INTERVAL/1000} secondi`);
    console.log(`💵 Range prezzo: $${MIN_PRICE}-$${MAX_PRICE}`);
    console.log('⚠️  ATTENZIONE: Operazioni simulate per ora!');

    // Prima operazione
    await executeTrade();
}

// Avvia il bot
startBot().catch(console.error); 