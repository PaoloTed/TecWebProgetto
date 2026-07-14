import express from "express";
import morgan from "morgan"; // Logging delle richieste HTTP
import cors from "cors";
import path from "path";
import { authRouter } from "./routes/authRouter.js";
import { catRouter } from "./routes/catRouter.js";
import { commentRouter } from "./routes/commentRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// Rotta di test
app.get("/", (req, res) => {
  res.json({
    message: "StreetCats API",
    version: "1.0.0",
    status: "running"
  });
});


// Rotte autenticazione (auth, signup, profile)
app.use(authRouter);

// Rotte gatti 
app.use(catRouter);

// Rotte commenti 
app.use(commentRouter);

// Gestione errori globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "An error occurred";
  res.status(status).json({
    code: status,
    description: message
  });
});

// Avvia il server
app.listen(PORT, () => {
  console.log('Server avviato su http://localhost:' + PORT);
});
