import bcrypt from "bcrypt";
import Pengguna from "../models/Pengguna.js";
import db from "../utils/db.js";

const gantiPassword = async (req, res, next) => {
  const t = await db.transaction();

  try {
    const userId = req.user.id_pengguna;

    // Log untuk melihat ID pengguna dari token
    console.log('Mengganti password untuk ID pengguna:', userId);

    // Ambil data dari body request
    const { password_lama, password_baru, konfirmasi_password } = req.body;

    // Validasi input
    if (!password_lama || !password_baru || !konfirmasi_password) {
      return res.status(400).json({
        errors: ["Password lama, password baru, dan konfirmasi password harus diisi"],
        message: "Ganti Password Gagal",
      });
    }

    // Pastikan password baru dan konfirmasi password sesuai
    if (password_baru !== konfirmasi_password) {
      return res.status(400).json({
        errors: ["Password baru dan konfirmasi password tidak sama"],
        message: "Ganti Password Gagal",
      });
    }

    // Cari pengguna berdasarkan ID
    const pengguna = await Pengguna.findByPk(userId);

    if (!pengguna) {
      return res.status(404).json({
        errors: ["Pengguna tidak ditemukan"],
        message: "Ganti Password Gagal",
      });
    }

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(password_lama, pengguna.password);
    if (!isMatch) {
      return res.status(400).json({
        errors: ["Password lama tidak cocok"],
        message: "Ganti Password Gagal",
      });
    }

    // Update password di database
    pengguna.password = password_baru;
    await pengguna.save({ transaction: t });

    await t.commit();
    res.status(200).json({
      message: "Password berhasil diubah",
    });
  } catch (error) {
    await t.rollback();
    next(new Error("controller/ubahpwController.js:gantiPassword - " + error.message));
  }
};

export { gantiPassword };
