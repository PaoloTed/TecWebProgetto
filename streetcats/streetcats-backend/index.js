import express from "express";
import morgan from "morgan"; // Logging delle richieste HTTP
import cors from "cors";

// Importa la configurazione del database (inizializza i modelli)
import { database } from "./models/Database.js";

// Importa router e middleware
import { authRouter } from "./routes/authRouter.js";
import { catRouter } from "./routes/catRouter.js";
import { commentRouter } from "./routes/commentRouter.js";
import { enforceAuthentication } from "./middleware/authorization.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // Log delle richieste in formato 'dev'
app.use(cors()); // Abilita CORS per le richieste dal frontend Angular
app.use(express.json()); // Parse del body JSON delle richieste

// Rotta di test
app.get("/", (req, res) => {
  res.json({
    message: "StreetCats API",
    version: "1.0.0",
    status: "running"
  });
});

// Rotta per verificare lo stato del database
app.get("/health", async (req, res) => {
  try {
    await database.authenticate();
    res.json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: error.message
    });
  }
});

// ========== ROUTES ==========

// Rotte autenticazione (auth, signup, profile)
app.use(authRouter);

// Rotte gatti (CRUD)
app.use(catRouter);

// Rotte commenti (update, delete, list by user)
app.use(commentRouter);

// ========== ERROR HANDLER ==========

// Gestione errori globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || "An error occurred"
  });
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
});
