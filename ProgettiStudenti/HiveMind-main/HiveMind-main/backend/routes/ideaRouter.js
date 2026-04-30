import express from "express";
import { UtenteController } from "../controllers/UtenteController.js";
import { IdeaController } from "../controllers/IdeaController.js";
import { Idea } from "../models/connectionDB.js";

export const IdeaRouter = new express.Router();

IdeaRouter.get("/idee", (req, res, next) => {
  IdeaController.getAllIdea().then(IdeaItems => {
    res.json(IdeaItems)
  }).catch(err => {
    next(err);
  });
});

IdeaRouter.post("/registerIdea", (req, res, next) => {
  IdeaController.saveIdea(req).then( result => {
    res.json(result);
  }).catch(err => {
    next(err);
  });
});

IdeaRouter.get("/idea/:id", (req, res, next) => {
  Idea.findById(req).then( (item) => {
    res.json(item);
  }).catch( err => {
    next(err);
  })
});

IdeaRouter.delete("/idea/:id", (req, res, next) => {
  Idea.delete(req).then( (item) => {
    res.json(item);
  }).catch( err => {
    next(err);
  })
});

IdeaRouter.patch('/idee/:id/like/:username', async (req, res,next) => {
  IdeaController.increment(req,res).then( (item) => {
    res.json(item);
  }).catch( err => {
    next(err);
  })
});
IdeaRouter.patch('/idee/:id/dislike/:username', async (req, res) => {
  IdeaController.decrement(req,res).then( (item) => {
    res.json(item);
  }).catch( err => {
    next(err);
  })
});