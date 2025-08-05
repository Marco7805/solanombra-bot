#!/bin/bash

echo "=== Deploying USDT Clone Token ==="
echo "Wallet Address: $(solana address)"
echo "Balance: $(solana balance) SOL"

# Check if we have SOL
BALANCE=$(solana balance | awk '{print $1}')
if (( $(echo "$BALANCE < 0.1" | bc -l) )); then
    echo "❌ Insufficient SOL balance. Please send at least 0.1 SOL to $(solana address)"
    echo "Current balance: $BALANCE SOL"
    exit 1
fi

echo "✅ Sufficient SOL balance: $BALANCE SOL"

# Create the token (mint)
echo "Creating token mint..."
TOKEN_MINT=$(spl-token create-token --decimals 6)
echo "Token Mint Address: $TOKEN_MINT"

# Create token account
echo "Creating token account..."
spl-token create-account $TOKEN_MINT

# Mint initial supply (1 billion tokens)
echo "Minting initial supply..."
spl-token mint $TOKEN_MINT 1000000000

# Save token mint address to config
echo "Saving token mint address to config..."
echo "{\"token_mint\": \"$TOKEN_MINT\"}" > config/token_info.json

echo "✅ Token created successfully!"
echo "Token Mint: $TOKEN_MINT"
echo "Initial Supply: 1,000,000,000 USDT"

# Check if metaboss is installed
if ! command -v metaboss &> /dev/null; then
    echo "⚠️  Metaboss not found. Please install it to associate metadata."
    echo "Installation: https://metaplex-foundation.github.io/metaboss/getting-started/installation.html"
    exit 0
fi

# Associate metadata
echo "Associating metadata..."
METADATA_URI="https://gateway.pinata.cloud/ipfs/bafkreib46yosnb2gvxb4pvz3k5mrhhcxwbg2j2swibaqt2od3zoo3pmdlu"
metaboss update metadata --keypair config/your_wallet.json --account $TOKEN_MINT --uri $METADATA_URI

echo "✅ Token deployment completed!"
echo "Token will appear in wallets with name 'Tether USD' and symbol 'USDT'"
echo "Metadata URI: $METADATA_URI" 