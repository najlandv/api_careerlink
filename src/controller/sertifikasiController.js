import Sertifikasi from "../models/Sertifikasi.js";
import Pengguna from "../models/Pengguna.js";
import { dataValid } from "../validation/dataValidation.js";
import fs from "fs";
import db from "../utils/db.js";

const tambahSertifikasi = async (req, res, next) => {
  const t = await db.transaction();
  const valid = {
    instansi: "required",
    judul_sertifikasi: "required",
    deskripsi: "required",
    tanggal_pelaksanaan: "required",
    kontak: "required",
    harga: "required",
  };

  const userId = req.user.id_pengguna;

  try {
    const sertifikasi = await dataValid(valid, req.body);

    if (sertifikasi.message.length > 0) {
      return res.status(400).json({
        errors: sertifikasi.message,
        message: "Gagal menambahkan data sertifikasi karena kesalahan validasi",
      });
    }

    if (!sertifikasi.data.tanggal_posting) {
      sertifikasi.data.tanggal_posting = new Date();
    }

    sertifikasi.data.id_pengguna = userId;

    if (req.file) {
      sertifikasi.data.gambar_sertifikasi = req.file.path;
    }

    const result = await Sertifikasi.create(
      {
        ...sertifikasi.data,
      },
      {
        transaction: t,
      }
    );

    if (!result) {
      await t.rollback();
      return res.status(400).json({
        message: "Gagal menambahkan data sertifikasi",
      });
    } else {
      await t.commit();
      res.status(201).json({
        message: "Data sertifikasi berhasil ditambahkan",
        data: result,
      });
    }
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controller/sertifikasiController.js:tambahSertifikasi - " +
          error.message
      )
    );
  }
};

const getAllSertifikasi = async (req, res, next) => {
  try {
    const sertifikasis = await Sertifikasi.findAll({
      include: [
        {
          model: Pengguna,
          attributes: ["id_pengguna", "nama_lengkap", "email"],
        },
      ],
      order: [["tanggal_posting", "DESC"]],
    });

    if (!sertifikasis || sertifikasis.length === 0) {
      return res.status(404).json({
        errors: ["Data sertifikasi tidak ditemukan"],
        message: "Fetch Failed",
      });
    }

    res.status(200).json({
      message: "Data sertifikasi berhasil diambil",
      data: sertifikasis,
    });
  } catch (error) {
    next(
      new Error(
        "controller/sertifikasiController.js:getAllSertifikasi - " +
          error.message
      )
    );
  }
};

const getMySertifikasi = async (req, res, next) => {
  try {
    const userId = req.user.id_pengguna;

    const sertifikasiList = await Sertifikasi.findAll({
      where: { id_pengguna: userId },
      include: {
        model: Pengguna,
        attributes: ["nama_lengkap", "email"],
      },
      order: [["tanggal_posting", "DESC"]],
    });

    res.status(200).json({
      message: "Data sertifikasi (mypost) berhasil diambil",
      data: sertifikasiList,
    });
  } catch (error) {
    next(
      new Error(
        "controller/sertifikasiController.js:getMySertifikasi - " +
          error.message
      )
    );
  }
};

const getSertifikasiById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const sertifikasi = await Sertifikasi.findByPk(id);

    if (!sertifikasi) {
      return res.status(404).json({
        errors: ["Data sertifikasi tidak ditemukan."],
        message: "Gagal mengambil data sertifikasi",
      });
    }

    return res.status(200).json({
      message: "Data sertifikasi berhasil ditemukan",
      data: sertifikasi,
    });
  } catch (error) {
    next(
      new Error(
        "controller/sertifikasiController.js:getSertifikasiById - " +
          error.message
      )
    );
  }
};

const perbaruiSertifikasi = async (req, res, next) => {
  const t = await db.transaction();
  const id = req.params.id;

  try {
    const sertifikasi = req.body;

    const existingSertifikasi = await Sertifikasi.findByPk(id);

    if (!existingSertifikasi) {
      return res.status(404).json({
        errors: ["Data sertifikasi tidak ditemukan"],
        message: "Gagal memperbarui data sertifikasi",
      });
    }

    if (existingSertifikasi.id_pengguna !== req.user.id_pengguna) {
      return res.status(403).json({
        errors: ["Anda tidak memiliki izin untuk memperbarui data ini"],
        message: "Gagal memperbarui data",
      });
    }

    if (req.file) {
      sertifikasi.data.gambar_sertifikasi = req.file.path;

      if (
        existingSertifikasi.gambar_sertifikasi &&
        existingSertifikasi.gambar_sertifikasi !== sertifikasi.data.gambar_sertifikasi
      ) {
        fs.unlink(existingSertifikasi.gambar_sertifikasi, (err) => {
          if (err) {
            console.error(`Gagal menghapus gambar lama: ${err.message}`);
          } else {
            console.log(
              `Berhasil menghapus gambar lama: ${existingSertifikasi.gambar_sertifikasi}`
            );
          }
        });
      }
    }

    const result = await Sertifikasi.update(
      {
        ...sertifikasi,
      },
      {
        where: {
          id_sertifikasi: id,
        },
        transaction: t,
      }
    );

    if (result[0] === 0) {
      await t.rollback();
      return res.status(400).json({
        errors: ["Gagal memperbarui data sertifikasi"],
        message: "Gagal memperbarui data",
      });
    }

    await t.commit();
    res.status(200).json({
      message: "Berhasil memperbarui data sertifikasi",
      data: sertifikasi.data,
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controller/sertifikasiController.js:perbaruiSertifikasi - " +
          error.message
      )
    );
  }
};

const hapusSertifikasi = async (req, res, next) => {
  const t = await db.transaction();
  const id = req.params.id;

  try {
    const existingSertifikasi = await Sertifikasi.findByPk(id);

    if (!existingSertifikasi) {
      return res.status(404).json({
        errors: ["Data sertifikasi tidak ditemukan."],
        message: "Gagal menghapus data sertifikasi.",
      });
    }

    if (existingSertifikasi.id_pengguna !== req.user.id_pengguna) {
      return res.status(403).json({
        errors: ["Anda tidak memiliki izin untuk menghapus data ini."],
        message: "Gagal menghapus data, tidak memiliki izin",
      });
    }

    if (existingSertifikasi.gambar_sertifikasi) {
      fs.unlink(existingSertifikasi.gambar_sertifikasi, (err) => {
        if (err) {
          console.error(`Gagal menghapus gambar: ${err.message}`);
        } else {
          console.log(
            `Berhasil menghapus gambar: ${existingSertifikasi.gambar_sertifikasi}`
          );
        }
      });
    }

    const result = await Sertifikasi.destroy({
      where: {
        id_sertifikasi: id,
      },
      transaction: t,
    });

    if (result === 0) {
      await t.rollback();
      return res.status(400).json({
        message: "Gagal menghapus data sertifikasi",
      });
    }

    await t.commit();
    res.status(200).json({
      message: "Data sertifikasi berhasil dihapus",
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controller/sertifikasiController.js:hapusSertifikasi - " +
          error.message
      )
    );
  }
};

export {
  tambahSertifikasi,
  getAllSertifikasi,
  getMySertifikasi,
  perbaruiSertifikasi,
  hapusSertifikasi,
  getSertifikasiById,
};
