FROM node:20-alpine

WORKDIR /app

# Copia i file delle dipendenze e installale
COPY package*.json ./
RUN npm install

# Copia il resto del codice
COPY . .

# Esponi la porta del backend
EXPOSE 3000

# Avvia l'app (nodemon è nel package.json)
CMD ["npm", "start"]
