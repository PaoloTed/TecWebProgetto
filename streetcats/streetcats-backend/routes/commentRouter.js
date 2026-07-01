import express from "express";
import { CommentController } from "../controllers/CommentController.js";
import { requireAuth, requireCommentOwnerOrAdmin } from "../middleware/authorization.js";

export const commentRouter = express.Router();

// GET  Dettaglio singolo commento
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

// PUT Modifica commento richiede autenticazione e permessi (controllati dal middleware)
commentRouter.put("/comments/:id", requireAuth, requireCommentOwnerOrAdmin, async (req, res, next) => {
  try {
    const commentId = req.params.id;

    // Validazione
    const text = req.body.text;
    if (!text)
      return res.status(400).json({ error: "Il testo del commento e' obbligatorio" });

    const updatedComment = await CommentController.updateComment(commentId, { text });
    res.json(updatedComment);
  } catch (err) {
    next(err);
  }
});

// DELETE Elimina commento richiede autenticazione e permessi (controllati dal middleware)
commentRouter.delete("/comments/:id", requireAuth, requireCommentOwnerOrAdmin, async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const deletedComment = await CommentController.deleteComment(commentId);
    res.json({ message: "Commento eliminato", comment: deletedComment });
  } catch (err) {
    next(err);
  }
});

// GET Commenti di un utente
commentRouter.get("/users/:email/comments", async (req, res, next) => {
  try {
    const comments = await CommentController.getCommentsByUser(req.params.email);
    res.json(comments);
  } catch (err) {
    next(err);
  }
});
