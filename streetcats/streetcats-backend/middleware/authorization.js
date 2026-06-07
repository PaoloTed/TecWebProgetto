import { AuthController } from "../controllers/AuthController.js";

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
