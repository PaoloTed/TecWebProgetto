FROM node:20-alpine

WORKDIR /app

# Copia i file delle dipendenze e installale
COPY package*.json ./
RUN npm install

# Copia il resto del codice
COPY . .

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]
