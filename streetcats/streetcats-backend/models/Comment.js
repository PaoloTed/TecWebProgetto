import { DataTypes } from "sequelize";

/**
 * Modello Comment
 * Rappresenta un commento associato a un gatto
 */
export function createModel(database) {
  database.define('Comment', {
    // Attributi Comment
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 2000]
      }
    }
    // createdAt e updatedAt sono aggiunti automaticamente da Sequelize
    // UserEmail (FK) verrà aggiunto dall'associazione
    // CatId (FK) verrà aggiunto dall'associazione
  }, {
    // Opzioni del modello
  });
}
