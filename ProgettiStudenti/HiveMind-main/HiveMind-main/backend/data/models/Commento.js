import { DataTypes, Model } from 'sequelize';

export function createCommentoModel(database) 
{
    class Commento extends Model {}
    Commento.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        data_pubblicazione: {
            type: DataTypes.DATE,
            allowNull: false
        },
        contenuto: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, 
    {
        sequelize: database,
        modelName: 'Commento'
    });
    
    return Commento;
}
