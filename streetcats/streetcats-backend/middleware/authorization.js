import { AuthController } from "../controllers/AuthController.js";

/**
 * Middleware per verificare l'autenticazione JWT
 * Estrae il token dall'header Authorization e verifica che sia valido
 * Se valido, aggiunge email e role alla request
 */
export function enforceAuthentication(req, res, next) {
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

/**
 * Middleware opzionale per l'autenticazione
 * Se il token è presente e valido, aggiunge i dati utente alla request
 * Se non presente o non valido, continua comunque (per rotte pubbliche con features extra per utenti autenticati)
 */
export function optionalAuthentication(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return next(); // Nessun token, continua come utente anonimo
  }

  AuthController.isTokenValid(token, (err, decodedToken) => {
    if (!err && decodedToken) {
      req.email = decodedToken.email;
      req.role = decodedToken.role;
    }
    next();
  });
}

/**
 * Middleware per verificare che l'utente sia admin
 * Da usare DOPO enforceAuthentication
 */
export function requireAdmin(req, res, next) {
  if (req.role !== 'admin') {
    return next({
      status: 403,
      message: "Forbidden: Accesso riservato agli amministratori"
    });
  }
  next();
}

/**
 * Middleware per verificare che l'utente sia il proprietario della risorsa o admin
 * @param {Function} getOwnerId - Funzione async che restituisce l'email del proprietario
 */
export function requireOwnerOrAdmin(getOwnerId) {
  return async (req, res, next) => {
    try {
      const ownerId = await getOwnerId(req);
      
      if (req.email === ownerId || req.role === 'admin') {
        next();
      } else {
        next({
          status: 403,
          message: "Forbidden: Non hai i permessi per modificare questa risorsa"
        });
      }
    } catch (err) {
      next(err);
    }
  };
}
