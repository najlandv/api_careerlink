// controller/profileController.js
import Pengguna from "../models/Pengguna.js";

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id_pengguna;
    
    // Log untuk melihat ID pengguna dari token
    console.log('Mencari pengguna dengan ID:', userId);

    const pengguna = await Pengguna.findByPk(userId, {
      attributes: ['id_pengguna', 'nama_lengkap', 'nama_pengguna', 'email'],
    });

    if (!pengguna) {
      return res.status(404).json({
        errors: ["User not found"],
        message: "Profile Fetch Failed",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      data: pengguna,
    });
  } catch (error) {
    next(new Error("controller/profileController.js:getProfile - " + error.message));
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id_pengguna;

    // Ambil data yang ingin diperbarui dari body request
    const { nama_lengkap, nama_pengguna, email, password } = req.body;

    // Validasi input
    if (!nama_lengkap || !nama_pengguna || !email) {
      return res.status(400).json({
        errors: ["Nama lengkap, nama pengguna, dan email harus diisi"],
        message: "Profile Update Failed",
      });
    }

    // Cari pengguna berdasarkan ID
    const pengguna = await Pengguna.findByPk(userId);

    if (!pengguna) {
      return res.status(404).json({
        errors: ["User not found"],
        message: "Profile Update Failed",
      });
    }

    // Update data pengguna
    pengguna.nama_lengkap = nama_lengkap;
    pengguna.nama_pengguna = nama_pengguna;
    pengguna.email = email;


    await pengguna.save();

    res.status(200).json({
      message: "Profile updated successfully",
      data: pengguna,
    });
  } catch (error) {
    next(new Error("controller/profileController.js:updateProfile - " + error.message));
  }
};

export { getProfile, updateProfile };
