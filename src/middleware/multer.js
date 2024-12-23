import multer from "multer";
import path from "path";
import fs from "fs";

// Konfigurasi penyimpanan untuk magang
const magangStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "assets/images/magang/";

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Konfigurasi penyimpanan untuk loker
const lokerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "assets/images/loker/";

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Konfigurasi penyimpanan untuk sertifikasi
const sertifikasiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "assets/images/sertifikasi/";

    // Cek apakah direktori sudah ada, jika belum, buat direktori
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Nama file menggunakan timestamp dan ekstensi file asli
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


// Middleware upload untuk magang
const magangUpload = multer({
  storage: magangStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  },
});

// Middleware upload untuk loker
const lokerUpload = multer({
  storage: lokerStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  },
});

// Middleware upload untuk sertifikasi
const sertifikasiUpload = multer({
  storage: sertifikasiStorage, // Gunakan sertifikasiStorage yang sudah didefinisikan sebelumnya
  limits: { fileSize: 1024 * 1024 * 5 }, // Batasi ukuran file menjadi 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Jika file adalah gambar, izinkan
    } else {
      cb(new Error("Only images are allowed"), false); // Jika bukan gambar, tolak
    }
  },
});


export { magangUpload, lokerUpload , sertifikasiUpload };
