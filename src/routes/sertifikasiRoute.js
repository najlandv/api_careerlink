import express from "express";
import {
  tambahSertifikasi,
  getAllSertifikasi,
  getMySertifikasi,
  perbaruiSertifikasi,
  hapusSertifikasi,
  getSertifikasiById,
} from "../controller/sertifikasiController.js";
import authenticate from "../middleware/authenticate.js";
import { sertifikasiUpload } from "../middleware/multer.js";

const sertifikasiRoute = express.Router();

// Route untuk menambah data sertifikasi
sertifikasiRoute.post(
  "/sertifikasiupload",
  authenticate,
  sertifikasiUpload.single("gambar_sertifikasi"),
  tambahSertifikasi
);

// Route untuk mendapatkan semua data sertifikasi
sertifikasiRoute.get("/sertifikasi", getAllSertifikasi);

// Route untuk mendapatkan sertifikasi yang dibuat oleh pengguna yang login
sertifikasiRoute.get("/sertifikasi/myposts", authenticate, getMySertifikasi);

// Route untuk memperbarui data sertifikasi berdasarkan ID
sertifikasiRoute.patch(
  "/sertifikasiupload/:id",
  authenticate,
  sertifikasiUpload.single("gambar_sertifikasi"),
  perbaruiSertifikasi
);

// Route untuk menghapus data sertifikasi berdasarkan ID
sertifikasiRoute.delete(
  "/sertifikasiupload/:id",
  authenticate,
  hapusSertifikasi
);

// Route untuk mendapatkan data sertifikasi berdasarkan ID
sertifikasiRoute.get("/sertifikasi/:id", getSertifikasiById);

export default sertifikasiRoute;
