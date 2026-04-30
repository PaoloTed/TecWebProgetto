import { DataTypes } from "sequelize";

/**
 * Modello Cat
 * Rappresenta un gatto di strada registrato nel sistema
 */
export function createModel(database) {
  database.define('Cat', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size: {
      type: DataTypes.ENUM('piccolo', 'medio', 'grande'),
      allowNull: true
    },
    neutered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Campi per la posizione
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: -180,
        max: 180
      }
    }
    // createdAt e updatedAt sono aggiunti automaticamente da Sequelize
    // UserUserName (FK) verrà aggiunto dall'associazione
  }, {
    // Opzioni del modello
  });
}
