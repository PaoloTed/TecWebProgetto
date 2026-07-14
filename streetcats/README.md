# StreetCats
Progetto per la gestione e segnalazione di gatti randagi (StreetCats). 
Il progetto è diviso in un backend (Node.js/Express) e un frontend (Angular).

## Prerequisiti
- **Docker e Docker Compose** avvio con docker
- **Node.js** e **npm** avvio manuale

## Avvio tramite Docker 

1. Aprire un terminale nella cartella del progetto (`streetcats`).
2. Eseguire il comando per costruire le immagini e avviare i container:
   ```bash
   docker compose up --build
   ```
3. - Il **Frontend** indirizzo: [http://localhost:4200](http://localhost:4200)
   - Il **Backend** indirizzo: [http://localhost:3000](http://localhost:3000)

Per fermare docker:

- ``` 
- bash docker compose down 
- ```

## Avvio Manuale

### 1. Avvio del Backend
1. Aprire un terminale e navigare nella cartella del backend:
   ```bash
   cd streetcats-backend
   ```
2. Installare le dipendenze:
   ```bash
   npm install
   ```
3. Avviare il server backend:
   ```bash
   npm start
   ```

### 2. Avvio del Frontend

1. ```bash
   cd streetcats-frontend
   ```
2. Installare le dipendenze:
   ```bash
   npm install
   ```
3. Avviare il server di sviluppo Angular:
   ```bash
   npm start
   ```

4. Aprire il browser all'indirizzo: [http://localhost:4200](http://localhost:4200)


Per fermare il backend e il frontend in caso di avvio manuale: 
- premere `Ctrl+C` in entrambi i terminali in cui sono in esecuzione.

