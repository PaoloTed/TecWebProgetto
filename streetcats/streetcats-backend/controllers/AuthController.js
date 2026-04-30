import { User } from "../models/Database.js";
import Jwt from "jsonwebtoken";
import 'dotenv/config.js';

/**
 * Controller per l'autenticazione
 * Gestisce login, registrazione e token JWT
 */
export class AuthController {

  /**
   * Verifica le credenziali dell'utente
   * @param {string} email - Email dell'utente
   * @param {string} password - Password in chiaro (verrà hashata per il confronto)
   * @returns {Promise<User|null>} - L'utente se le credenziali sono valide, null altrimenti
   */
  static async checkCredentials(email, password) {
    // Crea un utente temporaneo per hashare la password
    const tempUser = User.build({ email, password });
    
    // Cerca l'utente con email e password hashata
    const found = await User.findOne({
      where: {
        email: email,
        password: tempUser.password // La password è già hashata dal setter
      }
    });
    
    return found;
  }

  /**
   * Registra un nuovo utente
   * @param {Object} userData - Dati dell'utente (userName, password, email)
   * @returns {Promise<User>} - L'utente creato
   */
  static async saveUser(userData) {
    const user = User.build({
      userName: userData.userName,
      password: userData.password,
      email: userData.email,
      role: 'user' // I nuovi utenti sono sempre 'user', non 'admin'
    });
    return user.save();
  }

  /**
   * Genera un token JWT per l'utente
   * @param {string} email - Email dell'utente
   * @param {string} role - Ruolo dell'utente (user/admin)
   * @returns {string} - Token JWT
   */
  static issueToken(email, role = 'user') {
    return Jwt.sign(
      { email: email, role: role },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '365d' } // Token valido in base al .env (default 365 giorni)
    );
  }

  /**
   * Verifica se un token JWT è valido
   * @param {string} token - Token JWT da verificare
   * @param {Function} callback - Callback (err, decodedToken)
   */
  static isTokenValid(token, callback) {
    Jwt.verify(token, process.env.TOKEN_SECRET, callback);
  }

  /**
   * Trova un utente per email
   * @param {string} email - Email da cercare
   * @returns {Promise<User|null>}
   */
  static async findUserByEmail(email) {
    return User.findByPk(email);
  }

  /**
   * Trova un utente per username
   * @param {string} userName - Username da cercare
   * @returns {Promise<User|null>}
   */
  static async findUserByUsername(userName) {
    return User.findOne({ where: { userName } });
  }

  /**
   * Verifica se un utente esiste già tramite username
   * @param {string} userName - Username da verificare
   * @returns {Promise<boolean>}
   */
  static async userExists(userName) {
    const user = await User.findOne({ where: { userName } });
    return user !== null;
  }

  /**
   * Verifica se un'email è già registrata
   * @param {string} email - Email da verificare
   * @returns {Promise<boolean>}
   */
  static async emailExists(email) {
    const user = await User.findByPk(email);
    return user !== null;
  }
}
