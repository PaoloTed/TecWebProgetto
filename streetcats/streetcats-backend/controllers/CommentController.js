import { Comment, Cat, User } from "../models/Database.js";

// Controller per la gestione dei commenti (inserimento, lettura, modifica ed eliminazione)
export class CommentController {

  // Ottiene tutti i commenti associati ad un gatto specifico (include lo username dell'autore)
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

  // Ottiene tutti i commenti scritti da un determinato utente
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

  // Trova un commento tramite il suo ID
  static async findById(id) {
    return Comment.findByPk(id);
  }

  // Crea e salva un nuovo commento per un gatto
  static async createComment(commentData, catId, email) {
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

  // Aggiorna il testo di un commento esistente
  static async updateComment(id, updatedData) {
    const comment = await Comment.findByPk(id);
    if (!comment) return null;

    comment.set({ text: updatedData.text });
    return comment.save();
  }

  // Elimina un commento dal database
  static async deleteComment(id) {
    const comment = await Comment.findByPk(id);
    if (!comment) return null;

    await comment.destroy();
    return comment;
  }
}
