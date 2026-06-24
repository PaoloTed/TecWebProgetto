import { DataTypes } from "sequelize";

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
      allowNull: false
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
