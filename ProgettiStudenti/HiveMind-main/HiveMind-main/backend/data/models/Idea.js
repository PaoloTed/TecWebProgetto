import { DataTypes, Model } from 'sequelize';

export function createIdeaModel(database) 
{
    class Idea extends Model {}
    Idea.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titolo: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true 
        },
        descrizione: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: false 
        },
        like :
        {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
            defaultValue: []
        },
        dislike :
        {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
            defaultValue: []
        }
    }, {
        sequelize: database,
        modelName: 'Idea'
    });
  
    return Idea;
}
