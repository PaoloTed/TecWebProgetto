import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { Cat, Comment } from "../models/Database.js";
import { requireAuth } from "../middleware/authorization.js";
import { createHash } from "crypto";

export const authRouter = express.Router();

// POST Gestisce il login degli utenti
authRouter.post("/auth", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validazione input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email e password sono obbligatori"
      });
    }

    // Cifra la password inserita per il confronto con il database
    const hashedPassword = createHash("sha256").update(password).digest("hex");

    // Verifica credenziali
    const user = await AuthController.checkCredentials(email, hashedPassword);

    if (user) {
      // Genera e restituisce il token
      const token = AuthController.issueToken(user.email, user.role);
      res.json({
        message: "Login effettuato con successo",
        token: token,
        user: {
          userName: user.userName,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({
        error: "Credenziali non valide. Riprova."
      });
    }
  } catch (err) {
    next(err);
  }
});

// POST Registrazione di un utente
authRouter.post("/signup", async (req, res, next) => {
  try {
    const { userName, password, email } = req.body;

    // Validazione input
    if (!userName || !password || !email) {
      return res.status(400).json({
        error: "Username, password e email sono obbligatori"
      });
    }

    // Validazione lunghezza username
    if (userName.length < 3 || userName.length > 50) {
      return res.status(400).json({
        error: "L'username deve essere tra 3 e 50 caratteri"
      });
    }

    // Validazione password
    if (password.length < 6) {
      return res.status(400).json({
        error: "La password deve essere di almeno 6 caratteri"
      });
    }

    // Verifica se l'username esiste già
    if (await AuthController.userExists(userName)) {
      return res.status(400).json({
        error: "Username già in uso. Scegline un altro."
      });
    }

    // Verifica se l'email esiste già
    if (await AuthController.emailExists(email)) {
      return res.status(400).json({
        error: "Email già registrata. Usa un'altra email o effettua il login."
      });
    }

    // Crea l'utente (cifra la password prima di salvarla)
    const hashedPwd = createHash("sha256").update(password).digest("hex");
    const newUser = await AuthController.saveUser({ userName, password: hashedPwd, email });

    // Genera token per login automatico dopo la registrazione
    const token = AuthController.issueToken(newUser.email, newUser.role);

    res.status(201).json({
      message: "Registrazione completata con successo",
      token: token,
      user: {
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    // Gestione errori di validazione Sequelize
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: err.errors.map(e => e.message).join(', ')
      });
    }
    next(err);
  }
});

// GET Restituisce i dettagli del profilo dell'utente autenticato e le sue ultime attività
authRouter.get("/profile", requireAuth, async (req, res, next) => {
  try {
    if (req.email === undefined || req.email === null || req.email === "") {
      return res.status(401).json({ error: "Non autenticato" });
    }

    const user = await AuthController.findUserByEmail(req.email);
    if (user === null) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    // Ultime 10 segnalazioni
    const cats = await Cat.findAll({
      where: { UserEmail: req.email },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Ultimi 10 commenti con informazioni sul gatto associato
    const comments = await Comment.findAll({
      where: { UserEmail: req.email },
      include: [{ model: Cat, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      userName: user.userName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      stats: {
        cats: cats.length,
        comments: comments.length
      },
      recentCats: cats.map(c => ({
        id: c.id,
        name: c.name,
        color: c.color,
        photoUrl: c.photoUrl,
        createdAt: c.createdAt
      })),
      recentComments: comments.map(c => {
        let catInfo = null;
        if (c.Cat) {
          catInfo = { id: c.Cat.id, name: c.Cat.name };
        }
        return {
          id: c.id,
          text: c.text,
          createdAt: c.createdAt,
          cat: catInfo
        };
      })
    });
  } catch (err) {
    next(err);
  }
});
