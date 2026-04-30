import express from "express";
import { UtenteController } from "../controllers/UtenteController.js";

export const UtenteRouter = new express.Router();

UtenteRouter.get("/users", (req, res, next) => {
  UtenteController.getAllUtentes().then(UtenteItems => {
    res.json(UtenteItems)
  }).catch(err => {
    next(err);
  });
});

UtenteRouter.post('/login', (req, res, next) => {
  UtenteController.findByEmailAndPassword(req,res)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

UtenteRouter.post('/logout', (req, res) => {
  UtenteController.logout(req, res);
});
UtenteRouter.post("/registerUser", (req, res, next) => {
  UtenteController.saveUtente(req).then( result => {
    res.json(result);
  }).catch(err => {
    next(err);
  });
});

UtenteRouter.get("/utente/:id", (req, res, next) => {
  UtenteController.findById(req).then( (item) => {
    res.json(item);
  }).catch( err => {
    next(err);
  })
});

UtenteRouter.get("/utente/:username", (req, res, next) => {
  UtenteController.findByUsername(req).then((item) => {
      res.json(item);
    })
    .catch((err) => {
      next(err);
    });
});

UtenteRouter.delete("/utente/:id", (req, res, next) => {
  UtenteController.delete(req).then( (item) => {
    res.json(item);
  }).catch( err => {
    next(err);
  })
});