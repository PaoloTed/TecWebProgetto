import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Controllo che la cartella esista
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurazione di Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Nessun errore, cartella di destinazione 
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Genera un nome per il file usando il timestamp e il nome del file
    const filename = Date.now() + '-' + file.originalname;
    // Nessun errore, nome file completo
    cb(null, filename);
  }
});

// Filtro per accettare solo immagini
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    // Nessun errore, ok
    cb(null, true);
  } else {
    // Errore, non ok
    cb(new Error('Formato file non supportato. Inserisci solo immagini.'), false);
  }
};

const maxSize = 5 * 1024 * 1024 // 5MB

// Crea l'istanza multer con limite dimensione 5MB per immagine
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize
  },
  fileFilter: fileFilter
});
