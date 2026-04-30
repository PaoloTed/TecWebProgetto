import { Cat, Comment } from "../models/Database.js";

/**
 * Controller per la gestione dei gatti
 * Operazioni CRUD (Create, Read, Update, Delete)
 */
export class CatController {

  /**
   * Ottiene tutti i gatti
   * @returns {Promise<Cat[]>}
   */
  static async getAllCats() {
    return Cat.findAll({
      order: [['createdAt', 'DESC']] // Ordina per data creazione, più recenti prima
    });
  }

  /**
   * Ottiene i gatti dell'utente corrente
   * @param {string} username - Username dell'utente
   * @returns {Promise<Cat[]>}
   */
  static async getCatsByUser(username) {
    return Cat.findAll({
      where: { UserUserName: username },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Trova un gatto per ID
   * @param {number} id - ID del gatto
   * @returns {Promise<Cat|null>}
   */
  static async findById(id) {
    return Cat.findByPk(id);
  }

  /**
   * Crea un nuovo gatto
   * @param {Object} catData - Dati del gatto
   * @param {string} username - Username del creatore
   * @returns {Promise<Cat>}
   */
  static async createCat(catData, username) {
    const cat = Cat.build({
      name: catData.name,
      description: catData.description,
      color: catData.color,
      size: catData.size,
      neutered: catData.neutered || false,
      photoUrl: catData.photoUrl,
      address: catData.address,
      latitude: catData.latitude,
      longitude: catData.longitude,
      UserUserName: username
    });
    return cat.save();
  }

  /**
   * Aggiorna un gatto esistente
   * @param {number} id - ID del gatto
   * @param {Object} updatedData - Dati aggiornati
   * @returns {Promise<Cat>}
   */
  static async updateCat(id, updatedData) {
    const cat = await Cat.findByPk(id);
    if (!cat) return null;
    
    cat.set(updatedData);
    return cat.save();
  }

  /**
   * Elimina un gatto
   * @param {number} id - ID del gatto
   * @returns {Promise<Cat|null>}
   */
  static async deleteCat(id) {
    const cat = await Cat.findByPk(id);
    if (!cat) return null;
    
    await cat.destroy();
    return cat;
  }

  /**
   * Cerca gatti vicini a una posizione
   * @param {number} lat - Latitudine
   * @param {number} lon - Longitudine
   * @param {number} radius - Raggio in km (default 5)
   * @returns {Promise<Cat[]>}
   */
  static async findNearby(lat, lon, radius = 5) {
    // Approssimazione: 1 grado ~ 111 km
    const latDelta = radius / 111;
    const lonDelta = radius / (111 * Math.cos(lat * Math.PI / 180));

    return Cat.findAll({
      where: {
        latitude: {
          [Op.between]: [lat - latDelta, lat + latDelta]
        },
        longitude: {
          [Op.between]: [lon - lonDelta, lon + lonDelta]
        }
      }
    });
  }

  /**
   * Verifica se l'utente è il proprietario del gatto
   * @param {string} username - Username dell'utente
   * @param {number} catId - ID del gatto
   * @returns {Promise<boolean>}
   */
  static async isOwner(username, catId) {
    const cat = await Cat.findByPk(catId);
    return cat && cat.UserUserName === username;
  }
}
