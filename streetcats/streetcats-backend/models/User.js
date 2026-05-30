import { DataTypes } from "sequelize";
import { createHash } from "crypto";

export function createModel(database) {
  database.define('User', {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
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
      primaryKey: true,
      validate: {
        isEmail: true
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    }
    // createdAt e updatedAt aggiunti da Sequelize
  }, {
  });
}
