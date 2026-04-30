import { DataTypes, Model } from 'sequelize';

export function createUtenteModel(database) {
    class Utente extends Model {}
    Utente.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true 
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true 

        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        sequelize: database,
        modelName: 'Utente'
    });
  
    return Utente;
}
