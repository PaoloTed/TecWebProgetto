import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Controllo che la cartella esista
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (fs.existsSync(uploadDir) === false) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurazione di Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Cartella di destinazione
  },
  filename: (req, file, cb) => {
    // Genera un nome per il file caricato usando il timestamp e il nome del file
    const suffisso = Date.now() + '-' + file.originalname;
    cb(null, suffisso);
  }
});

// Filtro per accettare solo immagini
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Formato file non supportato. Inserisci solo immagini.'), false);
  }
};

// Crea l'istanza multer con limite dimensione 5MB per immagine
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});
