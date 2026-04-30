import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createCatModel } from "./Cat.js";
import { createModel as createCommentModel } from "./Comment.js";

import 'dotenv/config.js'; // Legge il file .env e rende disponibili le variabili in process.env

/**
 * Configurazione del database
 * Utilizza SQLite 
 */
export const database = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_CONNECTION_URI || './database.sqlite',
  logging: false 
});

// Crea i modelli
createUserModel(database);
createCatModel(database);
createCommentModel(database);

// Esporta i modelli per l'uso nei controller
export const { User, Cat, Comment } = database.models;

/**
 * Configurazione delle associazioni tra modelli
 * 
 * User -> Cat (1:N) - Un utente può registrare molti gatti
 * User -> Comment (1:N) - Un utente può scrivere molti commenti
 * Cat -> Comment (1:N) - Un gatto può avere molti commenti
 */

// Un utente può registrare molti gatti
User.Cats = User.hasMany(Cat);
Cat.User = Cat.belongsTo(User);

// Un utente può scrivere molti commenti
User.Comments = User.hasMany(Comment);
Comment.User = Comment.belongsTo(User);

// Un gatto può avere molti commenti
Cat.Comments = Cat.hasMany(Comment);
Comment.Cat = Comment.belongsTo(Cat);

/**
 * Sincronizza lo schema del database
 * Crea le tabelle mancanti
 */
database.sync().then(() => {
  console.log("Database sincronizzato correttamente");
}).catch(err => {
  console.error("Errore sincronizzazione database: " + err.message);
});
