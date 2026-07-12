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
      attributes: ['id', 'name', 'color', 'photoUrl', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
  }

  // Trova un gatto tramite il suo ID
  static async findById(id) {
    return Cat.findByPk(id);
  }

  // Crea e salva un nuovo gatto nel database
  static async createCat(name, description, color, size, photoUrl, latitude, longitude, email) {
    const cat = Cat.build({
      name: name,
      description: description,
      color: color,
      size: size,
      photoUrl: photoUrl,
      latitude: latitude,
      longitude: longitude,
      UserEmail: email
    });
    return cat.save();
  }

  // Aggiorna i dati di un gatto esistente
  static async updateCat(id, name, description, color, size, photoUrl, latitude, longitude) {
    const cat = await Cat.findByPk(id);
    if (!cat) {
      return null;
    }

    cat.set({
      name: name,
      description: description,
      color: color,
      size: size,
      photoUrl: photoUrl,
      latitude: latitude,
      longitude: longitude
    });
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
