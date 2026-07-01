import { User } from "../models/Database.js";
import Jwt from "jsonwebtoken";
import 'dotenv/config.js';

// Controller per la gestione dell'autenticazione login, registrazione e token JWT
export class AuthController {

  // Verifica le credenziali dell'utente (email e password)
  static async checkCredentials(email, password) {
    const found = await User.findOne({
      where: {
        email: email,
        password: password
      }
    });

    return found;
  }

  // Registra un nuovo utente nel database
  static async saveUser(userData) {
    const user = User.build({
      userName: userData.userName,
      password: userData.password, // La password viene passata già hashata
      email: userData.email,
      role: 'user' // I nuovi utenti sono sempre 'user'
    });
    return user.save();
  }

  // Genera un token JWT per l'utente
  static issueToken(email, role = 'user') {
    return Jwt.sign(
      { email: email, role: role },
      // Recupera la secret key dal file .env
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '365d' }
    );
  }

  // Verifica se un token JWT è valido
  static isTokenValid(token, callback) {
    Jwt.verify(token, process.env.TOKEN_SECRET, callback);
  }

  // Trova un utente per email
  static async findUserByEmail(email) {
    return User.findByPk(email);
  }

  // Verifica se un utente esiste già tramite username
  static async userExists(userName) {
    const user = await User.findOne({ where: { userName } });
    return !!user;
  }

  // Verifica se un'email è già registrata
  static async emailExists(email) {
    const user = await User.findByPk(email);
    return !!user;
  }
}
