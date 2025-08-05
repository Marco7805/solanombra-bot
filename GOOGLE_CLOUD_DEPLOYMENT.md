# 🚀 DEPLOYMENT SU GOOGLE CLOUD

## 📋 PREREQUISITI

1. **Account Google Cloud** (gratuito con $300 crediti)
2. **Google Cloud CLI** installato
3. **Progetto Google Cloud** creato

## 🔧 SETUP INIZIALE

### 1. Installa Google Cloud CLI
```bash
# macOS
brew install google-cloud-sdk

# Verifica installazione
gcloud --version
```

### 2. Login e Configurazione
```bash
# Login
gcloud auth login

# Crea nuovo progetto (o usa esistente)
gcloud projects create solanombra-bot-123

# Imposta progetto
gcloud config set project solanombra-bot-123

# Abilita App Engine
gcloud services enable appengine.googleapis.com
```

## 📦 DEPLOYMENT

### 1. Prepara i file
```bash
cd /Users/dott.gallo/SolanOmbra

# Installa dipendenze
npm install

# Verifica che tutti i file siano presenti
ls -la
```

### 2. Deploy su App Engine
```bash
# Deploy
gcloud app deploy

# Segui le istruzioni:
# - Conferma progetto: Y
# - Conferma region: Y (es. us-central1)
```

### 3. Verifica Deployment
```bash
# Controlla status
gcloud app describe

# Visualizza logs
gcloud app logs tail -s default

# URL del bot
gcloud app browse
```

## 🔍 MONITORAGGIO

### Logs in tempo reale
```bash
gcloud app logs tail -s default
```

### Status del bot
```bash
gcloud app instances list
```

### Metriche
```bash
gcloud app logs read --limit=50
```

## 🛠️ GESTIONE

### Riavvia bot
```bash
gcloud app versions stop v1
gcloud app deploy
```

### Aggiorna codice
```bash
# Modifica file
# Poi deploy
gcloud app deploy
```

### Arresta bot
```bash
gcloud app versions stop v1
```

## 💰 COSTI

- **Gratuito:** $300 crediti/12 mesi
- **App Engine:** ~$5-10/mese dopo crediti
- **Bot 24/7:** Sempre attivo

## 🔒 SICUREZZA

- ✅ **HTTPS** automatico
- ✅ **Firewall** integrato
- ✅ **Backup** automatico
- ✅ **Logs** sicuri

## 📞 SUPPORTO

Se il bot si ferma:
1. Controlla logs: `gcloud app logs tail`
2. Riavvia: `gcloud app deploy`
3. Verifica crediti: Google Cloud Console

## 🎯 RISULTATO

Il bot sarà disponibile su:
- **URL:** https://solanombra-bot-123.appspot.com
- **Status:** 24/7 attivo
- **Logs:** Monitorabili via CLI
- **Costi:** Gratuito per 12 mesi 