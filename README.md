# 🤖 SolanOmbra Trading Bot

Bot di trading automatico per token USDT clone su Solana.

## 🚀 Caratteristiche

- **Trading automatico** 24/7
- **Alternanza A/B** wallet per bilanciamento
- **Range prezzo** $0.85-$1.15
- **Volume casuale** 0.5-2.0 USDT
- **Intervalli casuali** 20-45 secondi
- **Operazioni reali** su blockchain Solana

## 📊 Configurazione

- **Token:** 3Gne3oSC5n23yhQvVbabtWbeaCH9d4mcc9KDCxY3QYxh
- **Pool Orca:** Aa36auc7xCcDDyCR52K89casQw9hTGuJVDmPusUYbcZS
- **Wallet A:** tL1MPynRi5ohe5qyKsKCwfqVGwaJzFCtoTeYWEAhYU7
- **Wallet B:** 95saoRkVReTTV9EUKLio4XtBQKuq2uWqHQvBK6DzwUg7

## 🔄 Sequenza Trading

1. **A VENDE** → B compra
2. **B ACQUISTA** → A ha venduto
3. **B VENDE** → A compra
4. **A ACQUISTA** → B ha venduto
5. **LOOP** → Ricomincia

## 🛠️ Tecnologie

- **Node.js 18+**
- **@solana/web3.js**
- **@solana/spl-token**
- **Express.js** (per Railway)

## 📦 Installazione

```bash
npm install
npm start
```

## 🌐 Deploy

### Railway (Raccomandato)
1. Push su GitHub
2. Login Railway
3. Deploy automatico

### Google Cloud
```bash
gcloud run deploy solanombra-bot --source .
```

## 📈 Monitoraggio

- **Status:** `/status`
- **Health:** `/health`
- **Logs:** Railway dashboard

## 🔒 Sicurezza

- Wallet keys in `config/`
- HTTPS automatico
- Auto-restart su errore

## 📄 Licenza

MIT License
