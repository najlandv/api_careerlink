import Magang from "../models/Magang.js";
import Pengguna from "../models/Pengguna.js";
import { dataValid } from "../validation/dataValidation.js";
import fs from "fs";
import db from "../utils/db.js";

const createMagang = async (req, res, next) => {
  const t = await db.transaction();
  const valid = {
    perusahaan: "required",
    judul_magang: "required",
    alamat: "required",
    posisi_magang: "required",
    kualifikasi: "required",
    jenis_magang: "required",
    durasi_magang: "required",
    deskripsi_magang: "required",
    kontak: "required",
  };

  const userId = req.user.id_pengguna;

  try {
    const magang = await dataValid(valid, req.body);

    if (magang.message.length > 0) {
      return res.status(400).json({
        errors: magang.message,
        message: "Gagal menambahkan data  magang karena kesalahan validasi",
      });
    }

    if (!magang.data.tanggal_posting) {
      magang.data.tanggal_posting = new Date();
    }

    console.log(userId);

    magang.data.id_pengguna = userId;

    if (req.file) {
      magang.data.gambar_magang = req.file.path;
    }

    const result = await Magang.create(
      {
        ...magang.data,
      },
      {
        transaction: t,
      }
    );

    if (!result) {
      await t.rollback();
      return res.status(400).json({
        message: "Gagal menambahkan data magang",
      });
    } else {
      await t.commit();
      res.status(201).json({
        message: "Data magang berhasil ditambahkan",
        data: result,
      });
    }
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controller/magangController.js:createMagang - " + error.message
      )
    );
  }
};

const getAllMagang = async (req, res, next) => {
  try {
    const magangs = await Magang.findAll({
      include: [
        {
          model: Pengguna,
          attributes: ["id_pengguna", "nama_lengkap", "email"],
        },
      ],
      order: [["tanggal_posting", "DESC"]],
    });

    if (!magangs || magangs.length === 0) {
      return res.status(404).json({
        errors: ["Data magang tidak ditemukan"],
        message: "Fetch Failed",
      });
    }

    res.status(200).json({
      message: "Data magang berhasil diambil",
      data: magangs,
    });
  } catch (error) {
    next(
      new Error(
        "controller/magangController.js:getAllMagang - " + error.message
      )
    );
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const userId = req.user.id_pengguna;

    console.log("Mengambil postingan magang untuk pengguna dengan ID:", userId);

    const magangList = await Magang.findAll({
      where: { id_pengguna: userId },
      include: {
        model: Pengguna,
        attributes: ["nama_lengkap", "email"],
      },
      order: [["tanggal_posting", "DESC"]],
    });

    res.status(200).json({
      message: "Data magang (mypost) berhasil diambil",
      data: magangList,
    });
  } catch (error) {
    next(
      new Error("controller/magangController.js:getMyPosts - " + error.message)
    );
  }
};

const getMagangById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const magang = await Magang.findByPk(id);

    if (!magang) {
      return res.status(404).json({
        errors: ["Data magang tidak ditemukan."],
        message: "Gagal mengambil data magang",
      });
    }

    return res.status(200).json({
      message: "Data magang berhasil ditemukan",
      data: magang,
    });
  } catch (error) {
    next(
      new Error(
        "controller/magangController.js:getMagangById - " + error.message
      )
    );
  }
};

const updateMagang = async (req, res, next) => {
  const t = await db.transaction();
  const id = req.params.id;

  try {
    const magang = req.body;

    const existingMagang = await Magang.findByPk(id);

    if (!existingMagang) {
      return res.status(404).json({
        errors: ["Data magang tidak ditemukan"],
        message: "Gagal mengupdate data magang",
      });
    }

    if (existingMagang.id_pengguna !== req.user.id_pengguna) {
      return res.status(403).json({
        errors: ["Anda tidak memiliki izin untuk mengupdate data magang ini"],
        message: "Gagal mengupdate data",
      });
    }

    if (req.file) {
      const imagePath = req.file.path;

      if (
        existingMagang.gambar_magang &&
        existingMagang.gambar_magang !== imagePath
      ) {
        fs.unlink(existingMagang.gambar_magang, (err) => {
          if (err) {
            console.error(`Gagal menghapus gambar lama : ${err.message}`);
          } else {
            console.log(
              `Berhasil menghapus gambar lama : ${existingMagang.gambar_magang}`
            );
          }
        });
      }

      magang.gambar_magang = imagePath;
    }

    const result = await Magang.update(
      {
        ...magang,
      },
      {
        where: {
          id_magang: id,
        },
        transaction: t,
      }
    );

    console.log(magang);

    if (result[0] === 0) {
      await t.rollback();
      return res.status(400).json({
        errors: ["Gagal mengupdate data magang"],
        message: "Gagal mengupdate data magang",
      });
    }

    await t.commit();
    res.status(200).json({
      message: "Berhasil mengupdate data magang",
      data: magang.data,
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controller/magangController.js:updateMagang - " + error.message
      )
    );
  }
};

const deleteMagang = async (req, res, next) => {
  const t = await db.transaction();
  const id = req.params.id;

  try {
    const existingMagang = await Magang.findByPk(id);

    if (!existingMagang) {
      return res.status(404).json({
        errors: ["Data magang tidak ditemukan."],
        message: "Gagal menghapus data magang.",
      });
    }

    if (existingMagang.id_pengguna !== req.user.id_pengguna) {
      return res.status(403).json({
        errors: ["Anda tidak memiliki izin untuk menghapus data magang ini."],
        message: "Gagal menghapus data, tidak memiliki izin",
      });
    }

    if (existingMagang.gambar_magang) {
      fs.unlink(existingMagang.gambar_magang, (err) => {
        if (err) {
          console.error(`Gagal menghapus gambar: ${err.message}`);
        } else {
          console.log(
            `Berhasil menghapus gambar: ${existingMagang.gambar_magang}`
          );
        }
      });
    }

    const result = await Magang.destroy({
      where: {
        id_magang: id,
      },
      transaction: t,
    });

    if (result === 0) {
      await t.rollback();
      return res.status(400).json({
        message: "Gagal menghapus data magang",
      });
    }

    await t.commit();
    res.status(200).json({
      message: "Data magang berhasil dihapus",
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controller/magangController.js:deleteMagang - " + error.message
      )
    );
  }
};

export {
  createMagang,
  getAllMagang,
  getMyPosts,
  updateMagang,
  deleteMagang,
  getMagangById,
};
