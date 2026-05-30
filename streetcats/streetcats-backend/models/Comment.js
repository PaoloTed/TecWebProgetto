import { DataTypes } from "sequelize";

export function createModel(database) {
  database.define('Comment', {
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
    // createdAt e updatedAt aggiunti da Sequelize
    // UserEmail (FK) aggiunto dall'associazione
    // CatId (FK) aggiunto dall'associazione
  });
}
