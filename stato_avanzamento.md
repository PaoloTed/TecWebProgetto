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
  - [ ] Configurazione del framework CSS (es. TailwindCSS o setup SCSS base)

- [ ] **Servizi Angular e Core**
  - [ ] `AuthService` per la gestione dello stato di login/logout e salvataggio token
  - [ ] `ApiService` per le chiamate HTTP al backend (Cats e Comments)
  - [ ] `AuthInterceptor` per iniettare il token JWT nelle richieste HTTP
  - [ ] `AuthGuard` per proteggere le pagine (es. impedire creazione gatti se non loggati)

- [ ] **Componenti di Base (Scheletro UI)**
  - [ ] `NavbarComponent` (Gestione menu e link login/logout)
  - [ ] `FooterComponent`
  - [ ] Layout principale responsive (mobile e desktop)

- [ ] **Autenticazione e Profilo**
  - [ ] `LoginComponent` (Form di accesso)
  - [ ] `SignupComponent` (Form di registrazione)
  - [ ] `ProfileComponent` (Visualizzazione dati utente e proprie segnalazioni)

- [ ] **Gestione Gatti e Commenti (Core App)**
  - [ ] `CatListComponent` (Vista a griglia/lista di tutti i gatti segnalati)
  - [ ] `CatDetailComponent` (Dettaglio singolo gatto con la lista dei commenti)
  - [ ] `CatFormComponent` (Form per creare una nuova segnalazione o modificare una esistente)
  - [ ] Integrazione lista commenti e input per l'invio di un nuovo commento

- [ ] **Funzionalità Avanzate**
  - [ ] Visualizzazione dei gatti su mappa interattiva (es. Leaflet/OpenStreetMap) - *Opzionale*
  - [ ] Barra di ricerca e filtri (es. ricerca per zona o colore)

- [ ] **Rifiniture (Polish)**
  - [ ] Gestione chiara degli errori tramite Notifiche/Toasts (es. Login fallito)
  - [ ] Animazioni e transizioni (Loading spinners, transizioni di route)

---

## 🚀 Prossimi Passi (Priorità Alta)
1. **Configurare Angular**: iniziare a configurare i file di base e il routing nel frontend.
2. **Creare i servizi base (`AuthService` e `ApiService`)**: per testare immediatamente la connessione con il backend.
3. **Creare schermate base (`CatList` e `Login`)**: per avere un'interfaccia rudimentale funzionante da cui poi estendere tutto il resto.
