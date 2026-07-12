import { DataTypes } from "sequelize";

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

    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Campi per la posizione
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    }
    // createdAt e updatedAt aggiunti da Sequelize
    // UserEmail (FK) aggiunto dall'associazione
  });
}
