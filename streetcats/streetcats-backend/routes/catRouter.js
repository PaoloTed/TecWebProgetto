import express from "express";
import { CatController } from "../controllers/CatController.js";
import { CommentController } from "../controllers/CommentController.js";
import { requireAuth, requireCatOwnerOrAdmin } from "../middleware/authorization.js";
import { upload } from "../middleware/upload.js";

export const catRouter = express.Router();

// GET Lista tutti i gatti
catRouter.get("/cats", async (req, res, next) => {
  try {
    const cats = await CatController.getAllCats();
    res.json(cats);
  } catch (err) {
    next(err);
  }
});

// GET Dettaglio singolo gatto
catRouter.get("/cats/:id", async (req, res, next) => {
  try {
    const cat = await CatController.findById(req.params.id);
    if (cat) {
      res.json(cat);
    } else {
      next({ status: 404, message: "Gatto non trovato" });
    }
  } catch (err) {
    next(err);
  }
});

// GET Commenti di un gatto
catRouter.get("/cats/:id/comments", async (req, res, next) => {
  try {
    const cat = await CatController.findById(req.params.id);
    if (!cat) {
      return next({ status: 404, message: "Gatto non trovato" });
    }
    const comments = await CommentController.getCommentsByCat(req.params.id);
    res.json(comments);
  } catch (err) {
    next(err);
  }
});


// POST Crea nuovo gatto (richiede autenticazione)
catRouter.post("/cats", requireAuth, upload.single('photo'), async (req, res, next) => {
  try {
    let photoUrl = req.body.photoUrl;
    if (req.file) {
      photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const newCat = await CatController.createCat(
      req.body.name,
      req.body.description,
      req.body.color,
      req.body.size,
      photoUrl,
      req.body.latitude,
      req.body.longitude,
      req.email
    );
    res.status(201).json(newCat);
  } catch (err) { next(err); }
});

// PUT  Modifica gatto richiede autenticazione e permessi 
catRouter.put("/cats/:id", requireAuth, requireCatOwnerOrAdmin, upload.single('photo'), async (req, res, next) => {
  try {
    // se è stata caricata una nuova foto, aggiunge l'url al campo photoUrl
    if (req.file) {
      req.body.photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updatedCat = await CatController.updateCat(
      req.cat,
      req.body.name,
      req.body.description,
      req.body.color,
      req.body.size,
      req.body.photoUrl,
      req.body.latitude,
      req.body.longitude
    );
    res.json(updatedCat);
  } catch (err) { next(err); }
});

// DELETE Elimina gatto richiede autenticazione e permessi 
catRouter.delete("/cats/:id", requireAuth, requireCatOwnerOrAdmin, async (req, res, next) => {
  try {
    // Cat viene inserito in req da requireCatOwnerOrAdmin
    const deletedCat = await CatController.deleteCat(req.cat);
    res.json({ message: "Gatto eliminato", cat: deletedCat });
  } catch (err) { next(err); }
});


// POST Aggiungi commento (richiede autenticazione)
catRouter.post("/cats/:id/comments", requireAuth, async (req, res, next) => {
  try {
    const text = req.body.text;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ errorBackEnd: "Il testo del commento e' obbligatorio" });
    }
    if (text.length > 2000) {
      return res.status(400).json({ errorBackEnd: "Il commento non puo' superare i 2000 caratteri" });
    }
    const newComment = await CommentController.createComment(text, req.params.id, req.email);
    res.status(201).json(newComment);
  } catch (err) {
    if (err.message === 'Gatto non trovato') return next({ status: 404, message: err.message });
    next(err);
  }
});


