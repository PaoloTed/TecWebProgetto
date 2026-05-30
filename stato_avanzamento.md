# 📊 Stato di Avanzamento del Progetto "StreetCats"

Questa checklist riassume lo stato di completamento del progetto per l'esame di Tecnologie Web, basato sulle fasi definite nel file `implementation_plan.md`.

## ⚙️ Backend (Node.js & Express)
*Il backend gestisce API REST, database e logica di business.*

- [x] **Setup Ambiente**
  - [x] Inizializzazione pacchetto npm
  - [x] Installazione dipendenze (Express, Sequelize, JWT, ecc.)
  - [x] Configurazione base del server `index.js`
  - [x] Setup file `.env` e gitignore

- [x] **Database e Modelli (Sequelize)**
  - [x] Connessione a SQLite configurata
  - [x] Modello `User` creato (con gestione hash password)
  - [x] Modello `Cat` creato (dati gatto e coordinate)
  - [x] Modello `Comment` creato
  - [x] Relazioni tra tabelle configurate correttamente (1:N tra utenti, gatti e commenti)

- [x] **Autenticazione e Sicurezza**
  - [x] Controller di Autenticazione (Login/Signup)
  - [x] Generazione e invio di token JWT
  - [x] Middleware per l'autorizzazione delle route protette (`enforceAuthentication`)

- [x] **CRUD ed Endpoints (API REST)**
  - [x] Controller e route per l'autenticazione (`/auth`, `/signup`)
  - [x] Controller e route per i Gatti (GET, POST, PUT, DELETE)
  - [x] Controller e route per i Commenti

- [x] **Testing Backend**
  - [x] File `.http` (o simili) creati per testare le chiamate API su gatti e commenti

---

## 🎨 Frontend (Angular)
*Il frontend gestisce l'interfaccia utente, le viste e le chiamate alle API.*

- [x] **Setup Ambiente**
  - [x] Generazione del progetto Angular (versione 19.x)
  - [x] Configurazione del framework CSS (es. TailwindCSS o setup SCSS base)

- [x] **Servizi Angular e Core**
  - [x] `AuthService` per la gestione dello stato di login/logout e salvataggio token
  - [x] `ApiService` per le chiamate HTTP al backend (Cats e Comments)
  - [x] `AuthInterceptor` per iniettare il token JWT nelle richieste HTTP
  - [x] `AuthGuard` per proteggere le pagine (es. impedire creazione gatti se non loggati)

- [x] **Componenti di Base (Scheletro UI)**
  - [x] `NavbarComponent` (Gestione menu e link login/logout)
  - [x] `FooterComponent`
  - [x] Layout principale responsive (mobile e desktop)

- [x] **Autenticazione e Profilo**
  - [x] `LoginComponent` (Form di accesso)
  - [x] `SignupComponent` (Form di registrazione con validatore password custom)
  - [x] `ProfileComponent` (Visualizzazione dati utente e proprie segnalazioni)

- [x] **Gestione Gatti e Commenti (Core App)**
  - [x] `CatListComponent` (Vista a griglia/lista di tutti i gatti segnalati)
  - [x] `CatDetailComponent` (Dettaglio singolo gatto con la lista dei commenti)
  - [x] `CatFormComponent` (Form per creare una nuova segnalazione o modificare una esistente)
  - [x] Integrazione lista commenti e input per l'invio di un nuovo commento (con toolbar Markdown)

- [x] **Funzionalità Avanzate**
  - [x] Visualizzazione dei gatti su mappa interattiva (Leaflet/OpenStreetMap) con marker e tooltip → pagina dettaglio
  - [x] Mappa nella pagina dettaglio per visualizzare la posizione del gatto
  - [x] Mappa nel form di inserimento per selezionare la posizione tramite clic
  - [x] Integrazione API esterna per curiosità casuali (Catfact.ninja) nel footer

- [x] **Rifiniture (Polish) & UI/UX**
  - [x] Transizione a UI Flat e Professionale (rimozione gradienti, layout full-width)
  - [x] Rimozione emoticon e sostituzione con icone SVG e logo grafico dedicato
  - [x] Miglioramenti UX (card interamente cliccabili, easter egg audio, UI de-cluttered)
  - [x] Animazioni base e stati di caricamento (Loading spinners)
  - [ ] Gestione chiara degli errori tramite Notifiche/Toasts globali

---

## 🚀 Prossimi Passi (Priorità Alta)
1. **Test E2E con Playwright** (≥ 10 test che usano il browser) — requisito obbligatorio della specifica.
2. [x] **Upload immagini con Multer** — implementato upload reale delle foto nel backend e invio tramite FormData dal frontend.
3. **Toast / notifiche errori** — sostituire gli errori inline con un sistema di notifiche visivo.

