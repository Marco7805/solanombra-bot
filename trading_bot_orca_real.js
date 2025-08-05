const { Connection, Keypair, PublicKey, Transaction } = require('@solana/web3.js');
const { WhirlpoolContext, buildWhirlpoolClient, ORCA_WHIRLPOOL_PROGRAM_ID } = require('@orca-so/whirlpools-sdk');
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

async function findOrcaPool() {
    try {
        console.log('🔍 Cercando pool Orca per USDT/USDC...');
        
        // Inizializza Orca client
        const ctx = WhirlpoolContext.from(connection, walletA, ORCA_WHIRLPOOL_PROGRAM_ID);
        const client = buildWhirlpoolClient(ctx);
        
        // Cerca pool con USDT e USDC
        const pools = await client.getAllPools();
        
        for (const pool of pools) {
            const tokenA = pool.getTokenAInfo();
            const tokenB = pool.getTokenBInfo();
            
            if ((tokenA.mint.equals(TOKEN_MINT) && tokenB.mint.equals(USDC_MINT)) ||
                (tokenA.mint.equals(USDC_MINT) && tokenB.mint.equals(TOKEN_MINT))) {
                console.log(`✅ Pool trovato: ${pool.getAddress().toString()}`);
                return pool;
            }
        }
        
        throw new Error('Pool Orca non trovato per USDT/USDC');
        
    } catch (error) {
        console.error('Errore nella ricerca del pool:', error.message);
        return null;
    }
}

async function executeSwap(wallet, isSelling, amount) {
    try {
        console.log(`🔄 Esecuzione swap ${isSelling ? 'VENDITA' : 'ACQUISTO'} su Orca...`);
        
        // Trova il pool
        const pool = await findOrcaPool();
        if (!pool) {
            throw new Error('Pool non disponibile');
        }
        
        // Ottieni token accounts
        const usdtAccount = await getAssociatedTokenAddress(TOKEN_MINT, wallet.publicKey);
        const usdcAccount = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey);
        
        // Calcola slippage (1%)
        const slippageTolerance = 0.01;
        
        // Ottieni quote
        const quote = await pool.getQuote({
            tokenMintA: isSelling ? TOKEN_MINT : USDC_MINT,
            tokenMintB: isSelling ? USDC_MINT : TOKEN_MINT,
            tokenAmount: amount,
            slippageTolerance
        });
        
        if (!quote) {
            throw new Error('Quote non disponibile');
        }
        
        // Esegui lo swap
        const swapTx = await pool.swap({
            tokenOwnerA: wallet.publicKey,
            tokenOwnerB: wallet.publicKey,
            tokenAccountA: isSelling ? usdtAccount : usdcAccount,
            tokenAccountB: isSelling ? usdcAccount : usdtAccount,
            amount: amount,
            otherAmountThreshold: quote.otherAmountThreshold,
            sqrtPriceLimit: quote.sqrtPriceLimit,
            amountSpecifiedIsInput: true,
            aToB: isSelling
        });
        
        console.log(`✅ Swap completato! Signature: ${swapTx.signature}`);
        return swapTx.signature;
        
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

        // Esegui swap reale su Orca
        const isSelling = operation === 'VENDITA';
        const signature = await executeSwap(walletKeypair, isSelling, amount);

        console.log(`✅ Operazione ${walletName} (${operation}) completata`);
        console.log(`🔗 Transaction: https://solscan.io/tx/${signature}`);

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
    console.log('🤖 BOT AVVIATO - OPERAZIONI REALI SU ORCA');
    console.log('Token:', TOKEN_MINT.toString());
    console.log(`💰 Range operazioni: ${MIN_AMOUNT/1000000}-${MAX_AMOUNT/1000000} USDT`);
    console.log(`⏱️  Intervallo: ${MIN_INTERVAL/1000}-${MAX_INTERVAL/1000} secondi`);
    console.log(`💵 Range prezzo: $${MIN_PRICE}-$${MAX_PRICE}`);
    console.log('⚠️  ATTENZIONE: Operazioni reali con SOL!');

    // Prima operazione
    await executeTrade();
}

// Avvia il bot
startBot().catch(console.error); 