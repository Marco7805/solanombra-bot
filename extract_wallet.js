const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

const privateKeyString = '3bKQNUtuAbS7WiWAiW3njTbVsx8jEwJvPr2zppWdGf6BjCwhp9u4v7U5Xk65Afi5vZ4vLAcuKLfgGkr6qZrkEDvf';

try {
    // Decodifica la chiave base58
    const privateKeyBytes = bs58.decode(privateKeyString);
    
    // Crea il keypair
    const keypair = Keypair.fromSecretKey(privateKeyBytes);
    
    // Ottieni l'indirizzo pubblico
    const publicKey = keypair.publicKey.toString();
    
    console.log('Indirizzo del wallet:', publicKey);
    console.log('Chiave privata (base58):', privateKeyString);
    
    // Salva il keypair nel formato corretto per Solana CLI
    const keypairArray = Array.from(keypair.secretKey);
    console.log('Keypair array:', JSON.stringify(keypairArray));
    
    // Salva in file
    const fs = require('fs');
    fs.writeFileSync('config/your_wallet.json', JSON.stringify(keypairArray));
    console.log('Wallet salvato in config/your_wallet.json');
    
} catch (error) {
    console.error('Errore:', error.message);
} 