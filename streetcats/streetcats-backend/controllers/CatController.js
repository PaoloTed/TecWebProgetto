import { Cat, Comment } from "../models/Database.js";

// Controller per la gestione dei gatti CRUD
export class CatController {

  // Ottiene tutti i gatti
  static async getAllCats() {
    return Cat.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  // Ottiene i gatti registrati da un utente
  static async getCatsByUser(email) {
    return Cat.findAll({
      where: { UserEmail: email },
      attributes: ['id', 'name', 'color', 'catImageUrl', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
  }

  // Trova un gatto tramite il suo ID
  static async findById(id) {
    return Cat.findByPk(id);
  }

  // Crea e salva un nuovo gatto nel db
  static async createCat(name, description, color, size, catImageUrl, latitude, longitude, email) {
    const cat = Cat.build({
      name: name,
      description: description,
      color: color,
      size: size,
      catImageUrl: catImageUrl,
      latitude: latitude,
      longitude: longitude,
      UserEmail: email
    });
    return cat.save();
  }

  // Aggiorna i dati di un gatto (riceve l'oggetto cat già trovato dal middleware)
  static async updateCat(cat, name, description, color, size, catImageUrl, latitude, longitude) {
    cat.set({
      name: name,
      description: description,
      color: color,
      size: size,
      catImageUrl: catImageUrl,
      latitude: latitude,
      longitude: longitude
    });
    return cat.save();
  }

  // Elimina un gatto dal db
  static async deleteCat(cat) {
    await Comment.destroy({ where: { CatId: cat.id } });
    await cat.destroy();
    return cat;
  }
}
