import { Idea } from "../models/connectionDB.js";
import { Utente } from "../models/connectionDB.js";
import { Commento } from "../models/connectionDB.js"

export class CommentoController
{
    static async getAllIdea() {
        return Commento.findAll({
          include: {
            model: Utente,
            attributes: ['username'] // Seleziona solo il campo username dell'utente
          }
        });
      }
    
    static async saveCommento(req) 
    {
      const { data_pubblicazione, contenuto, titolo, username } = req.body; //titolo e username bisogna prenderli da Idea e Utente.
    try 
    {
        // Cerca l'idea a cui si sta commentando
        const idea = await Idea.findOne({ where: { titolo } });
        
        // Se l'idea non esiste, restituisci un errore
        if (!idea) 
        {
          throw new Error('IDEA_NON_TROVATA');
        }
    
        // Cerca l'utente che sta scrivendo il commento
        const utente = await Utente.findOne({ where: { username } });
    
        // Se l'utente non esiste, restituisci un errore
        if (!utente) 
        {
          throw new Error('UTENTE_NON_TROVATO');
        }
    
        // Crea il nuovo commento
        const nuovoCommento = await Commento.create({
            data_pubblicazione,
            contenuto,
            IdeaId: idea.id,
            UtenteId: utente.id
        });
    
        const commentoConUtente = {
          ...nuovoCommento.dataValues,
          Utente: {
            username: utente.username
        }
        };

        return commentoConUtente;
        } 
        catch (error) 
        {
          // Gestisci l'errore qui
          throw new Error(error.message);
        }
    }
    
    static async findById(req)
    {
        return Commento.findByPk(req.params.id);
    }
    
    static async update(req)
    {
        let commento = await this.findById(req);
        Commento.setDataValue('Commento', req.body.Commento);
        return Commento.save();
    }
    
    static async delete(req)
    {
        return new Promise( (resolve, reject) => {
        this.findById(req).then( item => {
            item.destroy().then( () => {resolve(item)})
        })
        })
    }
    static async getCommentiByIdea(req) 
    {
        const { ideaId } = req.params;
        try {
          const commenti = await Commento.findAll({
            where: { IdeaId: ideaId },
            include: {
              model: Utente,
              attributes: ['username'] // Include il campo username dell'utente
            }
          });
          return commenti;
        } catch (error) {
          throw new Error(error.message);
        }
    }
    
}