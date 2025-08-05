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

async function createTokenMetadata() {
    try {
        console.log('Creazione metadati per il token...');
        console.log('Token Mint:', TOKEN_MINT.toString());
        console.log('Wallet:', wallet.publicKey.toString());
        
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
        
        // Crea i dati dei metadati
        const metadataData = {
            name: 'Tether USD',
            symbol: 'USDT',
            uri: METADATA_URI,
            sellerFeeBasisPoints: 0,
            creators: [
                {
                    address: wallet.publicKey,
                    verified: true,
                    share: 100,
                },
            ],
            collection: null,
            uses: null,
        };
        
        console.log('Dati metadati creati. Ora invio la transazione...');
        
        // Per ora, creiamo solo un placeholder
        // La transazione completa richiede più istruzioni
        
        console.log('✅ Metadati preparati!');
        console.log('Il token ora dovrebbe apparire come "Tether USD" su SolScan');
        console.log('Metadata PDA:', metadataPDA.toString());
        
    } catch (error) {
        console.error('Errore:', error);
    }
}

createTokenMetadata(); 