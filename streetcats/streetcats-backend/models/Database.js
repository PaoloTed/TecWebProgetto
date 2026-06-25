import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createCatModel } from "./Cat.js";
import { createModel as createCommentModel } from "./Comment.js";

import 'dotenv/config.js'; // Legge il file .env e rende disponibili le variabili in .env

// Configurazione del database SQLite 
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
export const { User } = database.models;
export const { Cat } = database.models;
export const { Comment } = database.models;

// Un utente puo registrare molti gatti
User.Cats = User.hasMany(Cat);
Cat.User = Cat.belongsTo(User);

// Un utente puo scrivere molti commenti
User.Comments = User.hasMany(Comment);
Comment.User = Comment.belongsTo(User);

// Un gatto puo avere molti commenti
Cat.Comments = Cat.hasMany(Comment);
Comment.Cat = Comment.belongsTo(Cat);

// Sincronizza lo schema del database e se le tabelle non esistono vengono create
database.sync().then(() => {
  console.log("Database sincronizzato correttamente");
}).catch(err => {
  console.error("Errore sincronizzazione database: " + err.message);
});
