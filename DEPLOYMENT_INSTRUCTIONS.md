# Istruzioni per il Deployment del Token USDT Clone

## Stato Attuale
- ✅ Configurazione del progetto completata
- ✅ Metadati preparati con URL IPFS
- ✅ Wallet configurato: `CW33E1dS76CvgDecn4dTbv6CF7NnLpLQAMRisB9hr8Ss`
- ⏳ **IN ATTESA**: SOL per le transazioni

## Prossimi Passi

### 1. Finanziare il Wallet
Invia almeno **0.1 SOL** all'indirizzo:
```
CW33E1dS76CvgDecn4dTbv6CF7NnLpLQAMRisB9hr8Ss
```

### 2. Deployare il Token
Una volta finanziato il wallet, esegui:
```bash
./deploy_token.sh
```

Questo script:
- Creerà il token con 6 decimali
- Conierà 1 miliardo di token
- Associerà i metadati usando l'URL IPFS
- Salverà l'indirizzo del token in `config/token_info.json`

### 3. Installare Metaboss (se non già installato)
Per associare i metadati, installa Metaboss:
```bash
# Su macOS
brew install metaboss

# Oppure da sorgente
git clone https://github.com/metaplex-foundation/metaboss.git
cd metaboss
cargo build --release
```

### 4. Verificare il Deployment
Dopo il deployment, il token sarà visibile su:
- SolScan: `https://solscan.io/token/[TOKEN_MINT_ADDRESS]`
- Wallet come Phantom e Solflare (con nome "Tether" e simbolo "USDT")

## Configurazione
- **Nome Token**: Tether USD
- **Simbolo**: USDT
- **Decimali**: 6
- **Supply Iniziale**: 1,000,000,000
- **Metadati URI**: `https://gateway.pinata.cloud/ipfs/bafkreib46yosnb2gvxb4pvz3k5mrhhcxwbg2j2swibaqt2od3zoo3pmdlu`

## Note Importanti
- Il token sarà creato sulla mainnet di Solana
- I metadati includono il logo e le informazioni del token
- Il wallet mantiene il controllo completo per mint/burn
- Il token apparirà come "Tether USD" nei wallet compatibili 