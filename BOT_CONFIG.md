# 🤖 Bot Orca Trading - Configurazione

## 📊 **SPECIFICHE BOT**

### **🔄 Sequenza Trading:**
1. **Wallet A ACQUISTA** → B vende
2. **Wallet B VENDE** → A ha comprato
3. **Wallet A VENDE** → B compra
4. **Wallet B ACQUISTA** → A ha venduto
5. **LOOP** → Ricomincia

### **💰 Parametri Trading:**
- **Range importi:** 0.1 - 2.0 USDT
- **Timing casuale:** 20-45 secondi
- **Range prezzo:** $0.85 - $1.15
- **Pool Orca:** `Aa36auc7xCcDDyCR52K89casQw9hTGuJVDmPusUYbcZS`

### **👛 Wallet Configurati:**
- **Wallet A:** `DEbXaxySrj6u3sqikVoLuNo7NVarXau6b5sp1fqURuq`
- **Wallet B:** `9K23hVJmTd4AHNTD3TsPTS98fw5HkkCJvK1RxrKdRLu`
- **Token USDT:** `3Gne3oSC5n23yhQvVbabtWbeaCH9d4mcc9KDCxY3QYxh`

### **🎯 Obiettivi:**
- **Mantenere prezzo** a $1
- **Generare volume** reale su Orca
- **Operazioni bilanciate** A ↔ B
- **Timing casuale** per naturalezza

### **🚀 Endpoints:**
- **Status:** `/status`
- **Health:** `/health`
- **Stop:** `/stop`
- **Start:** `/start`

### **⚠️ Note:**
- **Operazioni reali** su blockchain
- **Fee SOL** per ogni transazione
- **Volume visibile** su SolScan/Orca
- **Prezzo bilanciato** automaticamente 