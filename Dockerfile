FROM node:18-alpine

WORKDIR /app

# Copia package.json e installa dipendenze
COPY package*.json ./
RUN npm install --production

# Copia il codice del bot
COPY . .

# Crea directory per i log
RUN mkdir -p /app/logs

# Esponi porta 8080 (richiesto da Cloud Run)
EXPOSE 8080

# Comando di avvio
CMD ["node", "trading_bot_cloud.js"] 