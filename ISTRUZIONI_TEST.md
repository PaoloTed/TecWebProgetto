# 🐱 Guida all'Avvio e Test del Progetto "StreetCats"

Questo documento spiega passo passo come avviare le due componenti del progetto (Backend e Frontend) e come testare le funzionalità in fase di sviluppo.

---

## 💻 1. Avviare il Backend (Server e Database)

Il backend gestisce il database SQLite e le API REST. Per farlo funzionare:

1. Apri un terminale in Visual Studio Code (o quello del tuo computer).
2. Spostati nella cartella del backend:
   ```bash
   cd streetcats/streetcats-backend
   ```
3. Installa tutte le librerie necessarie (da fare solo la prima volta):
   ```bash
   npm install
   ```
4. Avvia il server:
   ```bash
   npm start
   ```
   *(Nota: Il server si avvierà sulla porta 3000. Usa `nodemon` quindi si riavvierà automaticamente se modifichi i file. Dovresti vedere un messaggio che conferma la connessione al database).*

---

## 🌐 2. Avviare il Frontend (Interfaccia Utente)

Il frontend è l'applicazione Angular.

1. Apri un **secondo terminale** (lasciando quello del backend sempre acceso a lavorare in background).
2. Spostati nella cartella del frontend:
   ```bash
   cd streetcats/streetcats-frontend
   ```
3. Installa le librerie di Angular:
   ```bash
   npm install
   ```
4. Avvia l'applicazione:
   ```bash
   npm start
   # Oppure, se hai Angular CLI globale installato: ng serve
   ```
   *(L'interfaccia sarà poi accessibile dal tuo browser andando all'indirizzo `http://localhost:4200`)*

---

## 🧪 3. Come Testare le API (Senza usare il frontend)

Mentre sviluppi, puoi testare le "chiamate al server" (creare gatti, leggere commenti, ecc.) usando l'estensione **REST Client** per VSCode.

### Prerequisiti
- Installa l'estensione "REST Client" su Visual Studio Code.
- Il backend (punto 1) **deve** essere avviato.

### Come fare i test:
1. Vai nella cartella `streetcats/streetcats-backend/tests/`.
2. Lì dentro ci sono i file con estensione `.http` (come `cats.http` o `comments.http`). Apri uno di questi file.
3. Sopra ogni blocco di codice (es. sopra a `GET http://localhost...`) vedrai comparire un piccolo bottone cliccabile **`Send Request`**.
4. Cliccalo e sulla destra ti si aprirà la risposta del tuo server!

### ⚠️ Operazioni Protette (che richiedono il Login):
Alcune operazioni, come *Aggiungere o Modificare un gatto*, richiedono l'autenticazione.
1. Fai prima una richiesta di Login o Signup per ricevere indietro un **Token**.
2. Copia l'intero token (una lunga stringa incomprensibile).
3. Vai nel file `cats.http`.
4. Trova la riga `Authorization: Bearer <TOKEN>` e sostituisci `<TOKEN>` con quello che hai copiato.
5. Ora clicca su `Send Request` e il server ti riconoscerà come utente loggato!
