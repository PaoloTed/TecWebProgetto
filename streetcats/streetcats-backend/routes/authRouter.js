import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { enforceAuthentication } from "../middleware/authorization.js";

export const authRouter = express.Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Login utente
 *     description: Autentica un utente e restituisce un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: mario_rossi
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login riuscito, restituisce il token JWT
 *       401:
 *         description: Credenziali non valide
 */
authRouter.post("/auth", async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    // Validazione input
    if (!userName || !password) {
      return res.status(400).json({
        error: "Username e password sono obbligatori"
      });
    }

    // Verifica credenziali
    const user = await AuthController.checkCredentials(userName, password);

    if (user) {
      // Genera e restituisce il token
      const token = AuthController.issueToken(user.userName, user.role);
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

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Registrazione nuovo utente
 *     description: Crea un nuovo account utente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *               - email
 *             properties:
 *               userName:
 *                 type: string
 *                 example: mario_rossi
 *               password:
 *                 type: string
 *                 example: password123
 *               email:
 *                 type: string
 *                 example: mario@example.com
 *     responses:
 *       201:
 *         description: Utente creato con successo
 *       400:
 *         description: Dati non validi o utente già esistente
 */
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

    // Crea l'utente
    const newUser = await AuthController.saveUser({ userName, password, email });

    // Genera token per login automatico dopo la registrazione
    const token = AuthController.issueToken(newUser.userName, newUser.role);

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

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Profilo utente corrente
 *     description: Restituisce i dati dell'utente autenticato
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dati del profilo utente
 *       401:
 *         description: Non autenticato
 */
authRouter.get("/profile", enforceAuthentication, async (req, res, next) => {
  try {
    // req.username viene impostato dal middleware enforceAuthentication
    if (!req.username) {
      return res.status(401).json({ error: "Non autenticato" });
    }

    const user = await AuthController.findUserByUsername(req.username);

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    res.json({
      userName: user.userName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (err) {
    next(err);
  }
});
