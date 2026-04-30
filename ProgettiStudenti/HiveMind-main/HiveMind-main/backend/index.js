import express from "express";
import morgan from "morgan"; //popular logging middleware (http://expressjs.com/en/resources/middleware/morgan.html)
import cors from "cors";
import { UtenteRouter } from "./routes/utenteRouter.js";
import SequelizeStore from 'connect-session-sequelize';
import session from 'express-session';
import {database} from './models/connectionDB.js'
import bodyParser from 'body-parser'; // Importa body-parser
import crypto from 'crypto';
import { IdeaRouter } from "./routes/ideaRouter.js";
import { CommentoRouter } from './routes/commentoRouter.js';


const app = express();
const PORT = 5000;

// CORS middleware
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

// Register the morgan logging middleware, use the 'dev' format
app.use(cors({
  origin: 'http://localhost:3000', // L'origine del tuo frontend
  credentials: true // Permetti l'invio dei cookie
}));
app.use(allowCrossDomain);
// Parse incoming requests with a JSON payload
app.use(express.json());

const secretKey = crypto.randomBytes(32).toString('hex');

// Configurazione del negozio delle sessioni con Sequelize
const SequelizeSessionStore = SequelizeStore(session.Store);
const sessionStore = new SequelizeSessionStore({
  db: database,
});

// Middleware per parsare il corpo delle richieste
app.use(bodyParser.json());

// Configurazione delle sessioni
app.use(session({
  secret: secretKey, // Cambia questa stringa con una chiave segreta sicura
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 giorno
    httpOnly: true
  },
}));

// Sincronizzare il negozio delle sessioni
sessionStore.sync();
app.use(UtenteRouter);
app.use(IdeaRouter);
app.use(CommentoRouter);
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
/*
app.use(flash());
app.use(exportFlashMessagesToViews);
app.use(exportAuthenticationStatus);
*/

//catch all, if we get here it's a 404
app.get('*', function(req, res){
  res.status(404).render("errorPage", {code: "404", description: "Not found."});
});


//error handler
app.use( (err, req, res, next) => 
    {
  console.log(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || "An error occurred"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});