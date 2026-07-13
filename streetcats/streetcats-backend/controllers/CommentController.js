import { Comment, Cat, User } from "../models/Database.js";

// Controller per la gestione dei commenti CRUD
export class CommentController {

  // Ottiene tutti i commenti di un gatto (con username proprietario)
  static async getCommentsByCat(catId) {
    return Comment.findAll({
      where: { CatId: catId },
      include: [{
        model: User,
        attributes: ['userName']
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  // Ottiene tutti i commenti di un utente
  static async getCommentsByUser(email) {
    return Comment.findAll({
      where: { UserEmail: email },
      attributes: ['id', 'text', 'createdAt'],
      include: [{
        model: Cat,
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  // Trova un commento tramite il suo ID
  static async findById(id) {
    return Comment.findByPk(id);
  }

  // Crea e salva un commento per un gatto
  static async createComment(text, catId, email) {
    const cat = await Cat.findByPk(catId);
    if (cat === null) {
      throw new Error('Gatto non trovato');
    }

    const comment = Comment.build({
      text: text,
      CatId: catId,
      UserEmail: email
    });
    return comment.save();
  }

  // Aggiorna il testo di un commento (riceve l'oggetto comment già trovato dal middleware)
  static async updateComment(comment, text) {
    comment.set({ text: text });
    return comment.save();
  }

  // Elimina un commento dal db (riceve l'oggetto comment già trovato dal middleware)
  static async deleteComment(comment) {
    await comment.destroy();
    return comment;
  }
}
