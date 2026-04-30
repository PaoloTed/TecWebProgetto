// Script per verificare gli utenti nel database
import { User } from "./models/Database.js";

async function checkUsers() {
  try {
    const users = await User.findAll();
    console.log("\n Utenti nel database:");
    console.log("========================");
    
    if (users.length === 0) {
      console.log("Nessun utente trovato.");
    } else {
      users.forEach(user => {
        console.log(`- ${user.userName} (${user.email}) - Ruolo: ${user.role}`);
      });
    }
    console.log(`\nTotale: ${users.length} utenti\n`);
  } catch (error) {
    console.error("Errore:", error.message);
  }
  process.exit(0);
}

checkUsers();
