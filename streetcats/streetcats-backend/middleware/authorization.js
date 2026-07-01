import { AuthController } from "../controllers/AuthController.js";
import { CatController } from "../controllers/CatController.js";
import { CommentController } from "../controllers/CommentController.js";

// Middleware per verificare il token JWT (inserisce email e ruolo dell'utente loggato nell'oggetto request)
export function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = null;
  if (authHeader !== undefined && authHeader !== null) {
    const parts = authHeader.split(' ');
    if (parts.length > 1) {
      token = parts[1];
    }
  }

  if (token === null) {
    return next({
      status: 401,
      message: "Unauthorized: Token non fornito"
    });
  }

  AuthController.isTokenValid(token, (err, decodedToken) => {
    if (err) {
      return next({
        status: 401,
        message: "Unauthorized: Token non valido o scaduto"
      });
    }

    // Aggiunge i dati dell'utente alla request per uso nei controller
    req.email = decodedToken.email;
    req.role = decodedToken.role;
    next();
  });
}

// Middleware per controllare se l'utente è proprietario del gatto o admin
export const requireCatOwnerOrAdmin = async (req, res, next) => {
  try {
    const cat = await CatController.findById(req.params.id);
    if (!cat) {
      return next({ status: 404, message: "Gatto non trovato" });
    }

    if (cat.UserEmail !== req.email && req.role !== 'admin') {
      return next({ status: 403, message: "Non hai i permessi per questa operazione" });
    }

    // Salva il gatto nella request
    req.cat = cat;

    next();
  } catch (err) {
    next(err);
  }
};

// Middleware per controllare se l'utente è proprietario del commento o admin
export const requireCommentOwnerOrAdmin = async (req, res, next) => {
  try {
    const comment = await CommentController.findById(req.params.id);
    if (!comment) {
      return next({ status: 404, message: "Commento non trovato" });
    }

    if (comment.UserEmail !== req.email && req.role !== 'admin') {
      return next({ status: 403, message: "Non hai i permessi per questa operazione" });
    }

    // Salva il commento nella request
    req.comment = comment;
    next();
  } catch (err) {
    next(err);
  }
};
