import { Comment, Cat, User } from "../models/Database.js";

/**
 * Controller per la gestione dei commenti
 * Operazioni CRUD (Create, Read, Update, Delete)
 */
export class CommentController {

  /**
   * Ottiene tutti i commenti di un gatto
   * @param {number} catId - ID del gatto
   * @returns {Promise<Comment[]>}
   */
  static async getCommentsByCat(catId) {
    return Comment.findAll({
      where: { CatId: catId },
      include: [{
        model: User,
        attributes: ['userName'] // Include solo lo username dell'autore
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Ottiene tutti i commenti di un utente
   * @param {string} email - Email dell'utente
   * @returns {Promise<Comment[]>}
   */
  static async getCommentsByUser(email) {
    return Comment.findAll({
      where: { UserEmail: email },
      include: [{
        model: Cat,
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Trova un commento per ID
   * @param {number} id - ID del commento
   * @returns {Promise<Comment|null>}
   */
  static async findById(id) {
    return Comment.findByPk(id);
  }

  /**
   * Crea un nuovo commento
   * @param {Object} commentData - Dati del commento
   * @param {number} catId - ID del gatto
   * @param {string} email - Email dell'autore
   * @returns {Promise<Comment>}
   */
  static async createComment(commentData, catId, email) {
    // Verifica che il gatto esista
    const cat = await Cat.findByPk(catId);
    if (!cat) {
      throw new Error('Gatto non trovato');
    }

    const comment = Comment.build({
      text: commentData.text,
      CatId: catId,
      UserEmail: email
    });
    return comment.save();
  }

  /**
   * Aggiorna un commento esistente
   * @param {number} id - ID del commento
   * @param {Object} updatedData - Dati aggiornati
   * @returns {Promise<Comment|null>}
   */
  static async updateComment(id, updatedData) {
    const comment = await Comment.findByPk(id);
    if (!comment) return null;
    
    comment.set({ text: updatedData.text });
    return comment.save();
  }

  /**
   * Elimina un commento
   * @param {number} id - ID del commento
   * @returns {Promise<Comment|null>}
   */
  static async deleteComment(id) {
    const comment = await Comment.findByPk(id);
    if (!comment) return null;
    
    await comment.destroy();
    return comment;
  }

  /**
   * Verifica se l'utente è il proprietario del commento
   * @param {string} email - Email dell'utente
   * @param {number} commentId - ID del commento
   * @returns {Promise<boolean>}
   */
  static async isOwner(email, commentId) {
    const comment = await Comment.findByPk(commentId);
    return comment && comment.UserEmail === email;
  }
}
