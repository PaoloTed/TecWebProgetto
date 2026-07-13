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

// PUT Modifica commento richiede autenticazione e permessi 
commentRouter.put("/comments/:id", requireAuth, requireCommentOwnerOrAdmin, async (req, res, next) => {
  try {
    // Validazione
    const text = req.body.text;
    if (!text)
      return res.status(400).json({ errorBackEnd: "Il testo del commento e' obbligatorio" });

    // Comment viene inserito in req da requireCommentOwnerOrAdmin
    const updatedComment = await CommentController.updateComment(req.comment, text);
    res.json(updatedComment);
  } catch (err) {
    next(err);
  }
});

// DELETE Elimina commento richiede autenticazione e permessi
commentRouter.delete("/comments/:id", requireAuth, requireCommentOwnerOrAdmin, async (req, res, next) => {
  try {
    const deletedComment = await CommentController.deleteComment(req.comment);
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
