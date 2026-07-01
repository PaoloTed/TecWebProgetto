import { Cat, Comment } from "../models/Database.js";

// Controller per la gestione dei gatti CRUD
export class CatController {

  // Ottiene tutti i gatti ordinati per i più recenti
  static async getAllCats() {
    return Cat.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  // Ottiene i gatti registrati da un utente specifico
  static async getCatsByUser(email) {
    return Cat.findAll({
      where: { UserEmail: email },
      order: [['createdAt', 'DESC']]
    });
  }

  // Trova un gatto tramite il suo ID
  static async findById(id) {
    return Cat.findByPk(id);
  }

  // Crea e salva un nuovo gatto nel database
  static async createCat(catData, email) {
    const cat = Cat.build({
      name: catData.name,
      description: catData.description,
      color: catData.color,
      size: catData.size,
      photoUrl: catData.photoUrl,
      latitude: catData.latitude,
      longitude: catData.longitude,
      UserEmail: email
    });
    return cat.save();
  }

  // Aggiorna i dati di un gatto esistente
  static async updateCat(id, updatedData) {
    const cat = await Cat.findByPk(id);
    if (!cat) {
      return null;
    }

    cat.set(updatedData);
    return cat.save();
  }

  // Elimina un gatto dal database
  static async deleteCat(id) {
    const cat = await Cat.findByPk(id);
    if (!cat) {
      return null;
    }

    await Comment.destroy({ where: { CatId: id } });
    await cat.destroy();
    return cat;
  }
}
