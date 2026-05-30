import { AuthController } from "../controllers/AuthController.js";

// Middleware per verificare il token JWT (inserisce email e ruolo dell'utente loggato nell'oggetto request)
export function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Formato: "Bearer <token>"

  if (!token) {
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
