import multer from "multer";
import path from "path";
import fs from "fs";

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

export { magangUpload };
