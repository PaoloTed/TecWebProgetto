import express from "express";
import { CatController } from "../controllers/CatController.js";
import { CommentController } from "../controllers/CommentController.js";
import { enforceAuthentication } from "../middleware/authorization.js";

export const catRouter = express.Router();

/** GET /cats - Lista tutti i gatti */
catRouter.get("/cats", async (req, res, next) => {
  try {
    const cats = await CatController.getAllCats();
    res.json(cats);
  } catch (err) { next(err); }
});

/** GET /cats/:id - Dettaglio singolo gatto */
catRouter.get("/cats/:id", async (req, res, next) => {
  try {
    const cat = await CatController.findById(req.params.id);
    if (cat) res.json(cat);
    else next({ status: 404, message: "Gatto non trovato" });
  } catch (err) { next(err); }
});

/** GET /cats/:id/comments - Commenti di un gatto */
catRouter.get("/cats/:id/comments", async (req, res, next) => {
  try {
    const cat = await CatController.findById(req.params.id);
    if (!cat) return next({ status: 404, message: "Gatto non trovato" });
    const comments = await CommentController.getCommentsByCat(req.params.id);
    res.json(comments);
  } catch (err) { next(err); }
});


/** POST /cats - Crea nuovo gatto (richiede autenticazione) */
catRouter.post("/cats", enforceAuthentication, async (req, res, next) => {
  try {
    const { name, description, color, size, neutered, photoUrl, address, latitude, longitude } = req.body;
    if (!name) return res.status(400).json({ error: "Il nome del gatto e' obbligatorio" });
    const newCat = await CatController.createCat(
      { name, description, color, size, neutered, photoUrl, address, latitude, longitude },
      req.email
    );
    res.status(201).json(newCat);
  } catch (err) { next(err); }
});

/** PUT /cats/:id - Modifica gatto (richiede autenticazione + owner/admin) */
catRouter.put("/cats/:id", enforceAuthentication, async (req, res, next) => {
  try {
    const cat = await CatController.findById(req.params.id);
    if (!cat) return next({ status: 404, message: "Gatto non trovato" });
    if (cat.UserEmail !== req.email && req.role !== 'admin') {
      return next({ status: 403, message: "Non hai i permessi per modificare questo gatto" });
    }
    const updatedCat = await CatController.updateCat(req.params.id, req.body);
    res.json(updatedCat);
  } catch (err) { next(err); }
});

/** DELETE /cats/:id - Elimina gatto (richiede autenticazione + owner/admin) */
catRouter.delete("/cats/:id", enforceAuthentication, async (req, res, next) => {
  try {
    const cat = await CatController.findById(req.params.id);
    if (!cat) return next({ status: 404, message: "Gatto non trovato" });
    if (cat.UserEmail !== req.email && req.role !== 'admin') {
      return next({ status: 403, message: "Non hai i permessi per eliminare questo gatto" });
    }
    const deletedCat = await CatController.deleteCat(req.params.id);
    res.json({ message: "Gatto eliminato", cat: deletedCat });
  } catch (err) { next(err); }
});


/** POST /cats/:id/comments - Aggiungi commento (richiede autenticazione) */
catRouter.post("/cats/:id/comments", enforceAuthentication, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Il testo del commento e' obbligatorio" });
    }
    if (text.length > 2000) {
      return res.status(400).json({ error: "Il commento non puo' superare i 2000 caratteri" });
    }
    const newComment = await CommentController.createComment({ text }, req.params.id, req.email);
    res.status(201).json(newComment);
  } catch (err) {
    if (err.message === 'Gatto non trovato') return next({ status: 404, message: err.message });
    next(err);
  }
});

/**
 * DELETE /cats/:catId/comments/:commentId
 * Elimina un commento — solo l'autore o un admin possono farlo
 */
catRouter.delete("/cats/:catId/comments/:commentId", enforceAuthentication, async (req, res, next) => {
  try {
    const comment = await CommentController.findById(req.params.commentId);
    if (!comment) return next({ status: 404, message: "Commento non trovato" });
    if (comment.UserEmail !== req.email && req.role !== 'admin') {
      return next({ status: 403, message: "Non hai i permessi per eliminare questo commento" });
    }
    await CommentController.deleteComment(req.params.commentId);
    res.json({ message: "Commento eliminato con successo" });
  } catch (err) { next(err); }
});
