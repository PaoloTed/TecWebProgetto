import { DataTypes } from "sequelize";
import { createHash } from "crypto";

/**
 * Modello User
 * Rappresenta un utente registrato nel sistema
 */
export function createModel(database) {
  database.define('User', {
    // Attributi del modello User
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        len: [3, 50] // Username tra 3 e 50 caratteri
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        // hash SHA256 della password 
        let hash = createHash("sha256");
        this.setDataValue('password', hash.update(value).digest("hex"));
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    }
    // createdAt e updatedAt sono aggiunti automaticamente da Sequelize
  }, {
    // Opzioni del modello
  });
}
