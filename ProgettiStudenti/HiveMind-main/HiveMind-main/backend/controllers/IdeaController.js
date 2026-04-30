import { Idea } from "../models/connectionDB.js";
import { Utente } from "../models/connectionDB.js";
import { Commento } from "../models/connectionDB.js";

export class IdeaController {
  static async getAllIdea() {
    try {
      const ideeConCommenti = await Idea.findAll({
        include: [
          {
            model: Utente,
            attributes: ['username'] // Seleziona solo il campo username dell'utente
          },
          {
            model: Commento, // Include i commenti associati a ciascuna idea
            include: {
              model: Utente,
              attributes: ['username']
            }
          }
        ]
      });

      return ideeConCommenti;
    } catch (error) {
      console.error('Errore nel recuperare le idee con i commenti e gli utenti:', error);
      throw error;
    }
  }


  static async saveIdea(req) {
    const { titolo, descrizione, username } = req.body;
    try {
      // Cerca un utente con lo stesso indirizzo email
      const utente = await Utente.findOne({ where: { username } });
      if (!utente) {
        throw new Error('UTENTE_NON_TROVATO');
      }
      // Cerca un'idea con lo stesso titolo
      const existingIdea = await Idea.findOne({ where: { titolo } });

      // Se esiste un utente con lo stesso indirizzo email, restituisci un errore
      if (existingIdea) {
        throw new Error('IDEA_PRESENT');
      }
      // Altrimenti, crea un nuovo utente
      const nuovaIdea = await Idea.create({ titolo, descrizione, UtenteId: utente.id, });
      return nuovaIdea;
    }
    catch (error) {
      // Gestisci l'errore qui
      throw new Error(error.message);
    }
  }

  static async findById(req) {
    return Idea.findByPk(req.params.id);
  }

  static async update(req) {
    let Idea = await this.findById(req);
    Idea.setDataValue('Idea', req.body.Idea);
    return Idea.save();
  }

  static async delete(req) {
    return new Promise((resolve, reject) => {
      this.findById(req).then(item => {
        item.destroy().then(() => { resolve(item) })
      })
    })
  }
  static async increment(req, res) {
    try {
      const id = req.params.id;
      const username = req.params.username; // Ottieni l'username dal percorso della richiesta
      // Controlla se l'utente esiste nel database
      const existingUser = await Utente.findOne({ where: { username: username } });
      if (!existingUser) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
      const idea = await Idea.findByPk(id, {
        include:
        {
          model: Utente,
          attributes: ['username'] // Seleziona solo il campo username dell'utente
        }
      });

      if (!idea) {
        return res.status(404).json({ error: 'Idea non trovata' });
      }
      // Verifica che l'utente che vota non sia lo stesso che ha creato l'idea
      if (idea.Utente.username === username) {
        return res.status(403).json({ error: 'Non puoi votare la tua stessa idea' });
      }
      // Controllo se l'utente ha già inserito un like per questa idea
      if (idea.like && idea.like.includes(username)) {
        return { status: 400, data: 'Hai già inserito il like' };
      }
      // Aggiungo l'username dell'utente ai likes e salvo l'idea
      // Aggiorna il campo 'like' usando il metodo `update`
      // Rimuovi l'username da 'dislike' se presente
      idea.dislike = idea.dislike.filter(user => user !== username);
      const updatedLikes = [...idea.like, username];

      await Idea.update(
        { like: updatedLikes, dislike: idea.dislike },
        { where: { id: id } }
      );
      // Ritorna l'idea aggiornata
      const updatedIdea = await Idea.findByPk(id, {
        include:
        {
          model: Utente,
          attributes: ['username'] // Seleziona solo il campo username dell'utente
        }
      });

      res.status(200).json(updatedIdea);
    }
    catch (error) {
      return { status: 500, data: 'Errore durante l\'incremento dei like:' };
    }
  }
  static async decrement(req, res) {
    try {
      const id = req.params.id;
      const username = req.params.username; // Ottieni l'username dal percorso della richiesta
      // Controlla se l'utente esiste nel database
      const existingUser = await Utente.findOne({ where: { username: username } });
      if (!existingUser) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
      const idea = await Idea.findByPk(id, {
        include:
        {
          model: Utente,
          attributes: ['username'] // Seleziona solo il campo username dell'utente
        }
      });

      if (!idea) {
        return res.status(404).json({ error: 'Idea non trovata' });
      }
      // Verifica che l'utente che vota non sia lo stesso che ha creato l'idea
      if (idea.Utente.username === username) {
        return res.status(403).json({ error: 'Non puoi votare la tua stessa idea' });
      }
      // Controllo se l'utente ha già inserito un like per questa idea
      if (idea.dislike && idea.dislike.includes(username)) {
        return { status: 400, data: 'Hai già inserito il dislike' };
      }
      // Aggiungo l'username dell'utente ai likes e salvo l'idea
      // Aggiorna il campo 'like' usando il metodo `update`
      // Rimuovi l'username da 'like' se presente
      idea.like = idea.like.filter(user => user !== username);
      const updatedDislikes = [...idea.dislike, username];

      await Idea.update(
        { like: idea.like, dislike: updatedDislikes },
        { where: { id: id } }
      );
      // Ritorna l'idea aggiornata
      const updatedIdea = await Idea.findByPk(id, {
        include:
        {
          model: Utente,
          attributes: ['username'] // Seleziona solo il campo username dell'utente
        }
      });

      res.status(200).json(updatedIdea);
    }
    catch (error) {
      return { status: 500, data: 'Errore durante l\'incremento dei like:' };
    }
  }


}