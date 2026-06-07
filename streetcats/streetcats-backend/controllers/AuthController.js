import { User } from "../models/Database.js";
import Jwt from "jsonwebtoken";
import 'dotenv/config.js';

// Controller per la gestione dell'autenticazione (login, registrazione e token JWT)
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
      role: 'user' // I nuovi utenti sono sempre 'user', non 'admin'
    });
    return user.save();
  }

  // Genera un token JWT per l'utente
  static issueToken(email, role = 'user') {
    let expires = '365d';
    if (process.env.JWT_EXPIRES_IN !== undefined && process.env.JWT_EXPIRES_IN !== null) {
      expires = process.env.JWT_EXPIRES_IN;
    }
    return Jwt.sign(
      { email: email, role: role },
      process.env.TOKEN_SECRET,
      { expiresIn: expires }
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
    if (user !== null) {
      return true;
    } else {
      return false;
    }
  }

  // Verifica se un'email è già registrata
  static async emailExists(email) {
    const user = await User.findByPk(email);
    if (user !== null) {
      return true;
    } else {
      return false;
    }
  }
}
