# 🚀 Deployment su Render

## ✅ **VANTAGGI RENDER**
- **Completamente gratuito** per progetti personali
- **750 ore/mese** gratuite (più che sufficienti)
- **Auto-deploy** da GitHub
- **HTTPS automatico**
- **Logs in tempo reale**
- **Auto-restart** se si ferma

## 📋 **PASSI PER IL DEPLOY**

### **PASSO 1: Vai su Render**
1. Apri: https://render.com
2. Clicca **"Sign Up"** o **"Login"**
3. Scegli **"Continue with GitHub"**

### **PASSO 2: Crea nuovo servizio**
1. Clicca **"New +"**
2. Seleziona **"Web Service"**
3. Clicca **"Connect"** accanto a GitHub

### **PASSO 3: Seleziona repository**
1. Cerca: `Marco7805/solanombra-bot`
2. Clicca **"Connect"**

### **PASSO 4: Configurazione**
- **Name:** `solanombra-bot`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node trading_bot_railway.js`
- **Plan:** `Free`

### **PASSO 5: Deploy**
1. Clicca **"Create Web Service"**
2. Aspetta il build (2-3 minuti)
3. Il bot sarà attivo automaticamente!

## 🔍 **MONITORAGGIO**
- **URL:** `https://solanombra-bot.onrender.com`
- **Logs:** Disponibili nel dashboard
- **Health Check:** `/health` endpoint
- **Status:** `/status` endpoint

## ⚡ **CARATTERISTICHE**
- **24/7 attivo** anche a PC spento
- **Auto-restart** se si ferma
- **HTTPS automatico**
- **Logs dettagliati**
- **Monitoraggio in tempo reale**

## 🎯 **VERIFICA FUNZIONAMENTO**
Dopo il deploy, visita:
- `https://solanombra-bot.onrender.com` - Status del bot
- `https://solanombra-bot.onrender.com/health` - Health check
- `https://solanombra-bot.onrender.com/status` - Statistiche trading 