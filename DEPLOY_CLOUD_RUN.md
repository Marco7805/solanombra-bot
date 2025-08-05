# 🚀 DEPLOYMENT SU GOOGLE CLOUD RUN

## 📋 PROGETTO ATTIVO
- **Progetto:** cobalt-carver-468117-a2
- **URL Console:** https://console.cloud.google.com/run/create?project=cobalt-carver-468117-a2

## 🔧 DEPLOYMENT VIA INTERFACCIA WEB

### 1. Vai su Google Cloud Console
1. Apri: https://console.cloud.google.com/run/create?project=cobalt-carver-468117-a2
2. Assicurati che il progetto sia selezionato: **cobalt-carver-468117-a2**

### 2. Configura Cloud Run
- **Nome servizio:** `solanombra-bot`
- **Regione:** `us-central1` (o `europe-west1`)
- **CPU:** `1`
- **Memoria:** `512 MiB`
- **Concorrenza:** `80`
- **Timeout:** `300`

### 3. Container
- **Container Image URL:** (lasciare vuoto per ora)
- **Porta:** `8080`

### 4. Variabili d'ambiente
Aggiungi:
- `NODE_ENV`: `production`
- `TOKEN_MINT`: `3Gne3oSC5n23yhQvVbabtWbeaCH9d4mcc9KDCxY3QYxh`
- `ORCA_POOL`: `Aa36auc7xCcDDyCR52K89casQw9hTGuJVDmPusUYbcZS`

### 5. Autenticazione
- **Permetti richieste non autenticate:** ✅ SÌ

## 📦 ALTERNATIVA: DEPLOYMENT VIA CLI

Se riesci a installare gcloud CLI:

```bash
# Login
gcloud auth login

# Imposta progetto
gcloud config set project cobalt-carver-468117-a2

# Abilita Cloud Run
gcloud services enable run.googleapis.com

# Build e deploy
gcloud run deploy solanombra-bot \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300
```

## 🔍 MONITORAGGIO

### Logs
- Vai su: https://console.cloud.google.com/run/detail/us-central1/solanombra-bot/logs
- Logs in tempo reale del bot

### Metriche
- Vai su: https://console.cloud.google.com/run/detail/us-central1/solanombra-bot/metrics
- CPU, memoria, richieste

## 💰 COSTI

- **Cloud Run:** ~$5-15/mese (dopo crediti gratuiti)
- **Bot 24/7:** Sempre attivo
- **Costi minimi:** Solo quando il bot è attivo

## 🎯 RISULTATO

Il bot sarà disponibile su:
- **URL:** https://solanombra-bot-xxxxx-uc.a.run.app
- **Status:** 24/7 attivo
- **Logs:** Monitorabili via console
- **Costi:** Ottimizzati (solo quando attivo)

## 🛠️ GESTIONE

### Aggiorna bot
1. Modifica codice
2. Nuovo deploy via console
3. Il bot si aggiorna automaticamente

### Arresta bot
1. Vai su Cloud Run console
2. Clicca su servizio
3. "Delete" per fermare

### Riavvia bot
1. Vai su Cloud Run console
2. "Edit & Deploy New Revision" 