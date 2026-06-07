import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createCatModel } from "./Cat.js";
import { createModel as createCommentModel } from "./Comment.js";

import 'dotenv/config.js'; // Legge il file .env e rende disponibili le variabili in process.env

let dbStorage = './database.sqlite';
if (process.env.DB_CONNECTION_URI !== undefined && process.env.DB_CONNECTION_URI !== null && process.env.DB_CONNECTION_URI !== "") {
  dbStorage = process.env.DB_CONNECTION_URI;
}

// Configurazione del database SQLite 
export const database = new Sequelize({
  dialect: 'sqlite',
  storage: dbStorage,
  logging: false
});

// Crea i modelli
createUserModel(database);
createCatModel(database);
createCommentModel(database);

// Esporta i modelli per l'uso nei controller
export const { User } = database.models;
export const { Cat } = database.models;
export const { Comment } = database.models;

// Un utente può registrare molti gatti
User.Cats = User.hasMany(Cat);
Cat.User = Cat.belongsTo(User);

// Un utente può scrivere molti commenti
User.Comments = User.hasMany(Comment);
Comment.User = Comment.belongsTo(User);

// Un gatto può avere molti commenti
Cat.Comments = Cat.hasMany(Comment);
Comment.Cat = Comment.belongsTo(Cat);

// Sincronizza lo schema del database e se le tabelle non esistono vengono create
database.sync().then(() => {
  console.log("Database sincronizzato correttamente");
}).catch(err => {
  console.error("Errore sincronizzazione database: " + err.message);
});
