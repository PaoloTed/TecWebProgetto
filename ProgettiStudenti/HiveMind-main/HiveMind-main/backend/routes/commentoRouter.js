import express from "express";
import { CommentoController } from "../controllers/CommentoController.js";
import { Commento } from "../models/connectionDB.js";

export const CommentoRouter = new express.Router();

CommentoRouter.get("/commenti", (req, res, next) => {
  CommentoController.getAllCommento().then(CommentoItems => {
    res.json(CommentoItems)
  }).catch(err => {
    next(err);
  });
});

CommentoRouter.post("/registerCommento", (req, res, next) => {
  CommentoController.saveCommento(req).then( result => {
    res.json(result);
  }).catch(err => {
    next(err);
  });
});

CommentoRouter.get("/commento/:id", (req, res, next) => {
  Commento.findById(req).then( (item) => {
    res.json(item);
  }).catch( err => {
    next(err);
  })
});

CommentoRouter.delete("/commento/:id", (req, res, next) => {
  Commento.delete(req).then( (item) => {
    res.json(item);
  }).catch( err => {
    next(err);
  })
});
CommentoRouter.get("/commenti/idea/:ideaId", (req, res, next) => {
  CommentoController.getCommentiByIdea(req).then( (item) => {
    res.json(item);
  }).catch( err => {
    next(err);
  })
});

