import express from "express";
import { CommentController } from "../controllers/CommentController.js";
import { enforceAuthentication } from "../middleware/authorization.js";

export const commentRouter = express.Router();

/**
 * GET /comments/:id - Dettaglio singolo commento
 */
commentRouter.get("/comments/:id", async (req, res, next) => {
  try {
    const comment = await CommentController.findById(req.params.id);
    if (comment) {
      res.json(comment);
    } else {
      next({ status: 404, message: "Commento non trovato" });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /comments/:id - Modifica commento (richiede autenticazione + owner/admin)
 */
commentRouter.put("/comments/:id", enforceAuthentication, async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const comment = await CommentController.findById(commentId);

    if (!comment) {
      return next({ status: 404, message: "Commento non trovato" });
    }

    // Verifica permessi: solo owner o admin
    if (comment.UserUserName !== req.username && req.role !== 'admin') {
      return next({ status: 403, message: "Non hai i permessi per modificare questo commento" });
    }

    // Validazione
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Il testo del commento e' obbligatorio" });
    }

    const updatedComment = await CommentController.updateComment(commentId, { text });
    res.json(updatedComment);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /comments/:id - Elimina commento (richiede autenticazione + owner/admin)
 */
commentRouter.delete("/comments/:id", enforceAuthentication, async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const comment = await CommentController.findById(commentId);

    if (!comment) {
      return next({ status: 404, message: "Commento non trovato" });
    }

    // Verifica permessi: solo owner o admin
    if (comment.UserUserName !== req.username && req.role !== 'admin') {
      return next({ status: 403, message: "Non hai i permessi per eliminare questo commento" });
    }

    const deletedComment = await CommentController.deleteComment(commentId);
    res.json({ message: "Commento eliminato", comment: deletedComment });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users/:username/comments - Commenti di un utente
 */
commentRouter.get("/users/:username/comments", async (req, res, next) => {
  try {
    const comments = await CommentController.getCommentsByUser(req.params.username);
    res.json(comments);
  } catch (err) {
    next(err);
  }
});
