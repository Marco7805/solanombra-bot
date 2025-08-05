const { Connection, Keypair, PublicKey, Transaction } = require('@solana/web3.js');
const { createCreateMetadataAccountV3Instruction } = require('@metaplex-foundation/mpl-token-metadata');
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
        console.log('Metadata URI:', METADATA_URI);
        
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
        
        // Crea l'istruzione per creare i metadati
        const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
            {
                metadata: metadataPDA,
                mint: TOKEN_MINT,
                mintAuthority: wallet.publicKey,
                payer: wallet.publicKey,
                updateAuthority: wallet.publicKey,
            },
            {
                createMetadataAccountArgsV3: {
                    data: {
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
                    },
                    isMutable: true,
                    collectionDetails: null,
                },
            }
        );

        console.log('Istruzione creata. Ora invio la transazione...');
        
        // Invia la transazione
        const transaction = new Transaction().add(createMetadataInstruction);
        const signature = await connection.sendTransaction(transaction, [wallet]);
        
        console.log('✅ Metadati creati con successo!');
        console.log('Signature:', signature);
        console.log('Il token ora dovrebbe apparire come "Tether USD" su wallet e SolScan');
        
    } catch (error) {
        console.error('Errore:', error);
    }
}

createTokenMetadata(); 