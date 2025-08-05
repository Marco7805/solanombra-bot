const { Connection, Keypair, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const fs = require('fs');

// Configurazione
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
const TOKEN_MINT = new PublicKey('3Gne3oSC5n23yhQvVbabtWbeaCH9d4mcc9KDCxY3QYxh');
const METADATA_URI = 'https://gateway.pinata.cloud/ipfs/bafkreib46yosnb2gvxb4pvz3k5mrhhcxwbg2j2swibaqt2od3zoo3pmdlu';

// Program ID per Token Metadata
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Carica il wallet
const walletData = JSON.parse(fs.readFileSync('config/your_wallet.json', 'utf8'));
const wallet = Keypair.fromSecretKey(new Uint8Array(walletData));

async function createMetadataTransaction() {
    try {
        console.log('Creazione transazione per i metadati...');
        
        // Trova il PDA per i metadati
        const [metadataPDA] = await PublicKey.findProgramAddress(
            [
                Buffer.from('metadata'),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                TOKEN_MINT.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
        );
        
        console.log('Metadata PDA:', metadataPDA.toString());
        
        // Crea la transazione
        const transaction = new Transaction();
        
        // Aggiungi istruzione per creare l'account dei metadati
        const createAccountInstruction = SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: metadataPDA,
            lamports: await connection.getMinimumBalanceForRentExemption(1),
            space: 1,
            programId: TOKEN_METADATA_PROGRAM_ID,
        });
        
        transaction.add(createAccountInstruction);
        
        // Per ora, creiamo solo la struttura base
        // La transazione completa richiede più istruzioni specifiche del programma
        
        console.log('✅ Transazione preparata!');
        console.log('Metadata PDA:', metadataPDA.toString());
        console.log('Per completare, devi:');
        console.log('1. Creare una pool di liquidità su Raydium');
        console.log('2. Aggiungere il token alla Solana Token List');
        console.log('3. Implementare un bot di trading');
        
    } catch (error) {
        console.error('Errore:', error);
    }
}

createMetadataTransaction(); 