import Loker from "../models/Loker.js";
import Pengguna from "../models/Pengguna.js";
import { dataValid } from "../validation/dataValidation.js";
import fs from "fs";
import db from "../utils/db.js";

const createLoker = async (req, res, next) => {
  const t = await db.transaction();
  const valid = {
    perusahaan: "required",
    judul_loker: "required",
    alamat: "required",
    posisi_loker: "required",
    kualifikasi: "required",
    jenis_loker: "required",
    deskripsi_loker: "required",
    kontak: "required"
  };

  const userId = req.user.id_pengguna;

  try {
    const loker = await dataValid(valid, req.body);

    if (loker.message.length > 0) {
      return res.status(400).json({
        errors: loker.message,
        message: "Gagal menambahkan data loker karena kesalahan validasi",
      });
    }

    if (!loker.data.tanggal_posting) {
      loker.data.tanggal_posting = new Date(); 
    }

    loker.data.id_pengguna = userId;

    if (req.file) {
      loker.data.gambar_loker = req.file.path;
    }

    const result = await Loker.create(
      {
        ...loker.data,
      },
      {
        transaction: t,
      }
    );

    if (!result) {
      await t.rollback();
      return res.status(400).json({
        message: "Gagal menambahkan data loker",
      });
    } else {
      await t.commit();
      res.status(201).json({
        message: "Data loker berhasil ditambahkan",
        data: result,
      });
    }
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controller/lokerController.js:createLoker - " + error.message
      )
    );
  }
};

const getAllLoker = async (req, res, next) => {
  try {
    const lokers = await Loker.findAll({
      include: [
        {
          model: Pengguna,
          attributes: ["id_pengguna", "nama_lengkap", "email"],
        },
      ],
      order: [["tanggal_posting", "DESC"]],
    });

    if (!lokers || lokers.length === 0) {
      return res.status(404).json({
        errors: ["Data loker tidak ditemukan"],
        message: "Fetch Failed",
      });
    }

    res.status(200).json({
      message: "Data loker berhasil diambil",
      data: lokers,
    });
  } catch (error) {
    next(
      new Error(
        "controller/lokerController.js:getAllLoker - " + error.message
      )
    );
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const userId = req.user.id_pengguna;

    const lokerList = await Loker.findAll({
      where: { id_pengguna: userId },
      include: {
        model: Pengguna,
        attributes: ["nama_lengkap", "email"],
      },
      order: [["tanggal_posting", "DESC"]],
    });

    res.status(200).json({
      message: "Data loker (mypost) berhasil diambil",
      data: lokerList,
    });
  } catch (error) {
    next(
      new Error("controller/lokerController.js:getMyPosts - " + error.message)
    );
  }
};

const getLokerById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const loker = await Loker.findByPk(id);

    if (!loker) {
      return res.status(404).json({
        errors: ["Data loker tidak ditemukan."],
        message: "Gagal mengambil data loker",
      });
    }

    return res.status(200).json({
      message: "Data loker berhasil ditemukan",
      data: loker,
    });
  } catch (error) {
    next(
      new Error(
        "controller/lokerController.js:getLokerById - " + error.message
      )
    );
  }
};

const updateLoker = async (req, res, next) => {
  const t = await db.transaction();
  const id = req.params.id;

  try {
    const loker = req.body;

    const existingLoker = await Loker.findByPk(id);

    if (!existingLoker) {
      return res.status(404).json({
        errors: ["Data loker tidak ditemukan"],
        message: "Gagal mengupdate data loker",
      });
    }

    if (existingLoker.id_pengguna !== req.user.id_pengguna) {
      return res.status(403).json({
        errors: ["Anda tidak memiliki izin untuk mengupdate data loker ini"],
        message: "Gagal mengupdate data",
      });
    }

    if (req.file) {
      const imagePath = req.file.path;

      if (
        existingLoker.gambar_loker &&
        existingLoker.gambar_loker !== imagePath
      ) {
        fs.unlink(existingLoker.gambar_loker, (err) => {
          if (err) {
            console.error(`Gagal menghapus gambar lama: ${err.message}`);
          }
        });
      }
    }

    const result = await Loker.update(
      {
        ...loker,
      },
      {
        where: {
          id_loker: id,
        },
        transaction: t,
      }
    );

    if (result[0] === 0) {
      await t.rollback();
      return res.status(400).json({
        errors: ["Gagal mengupdate data loker"],
        message: "Gagal mengupdate data loker",
      });
    }

    await t.commit();
    res.status(200).json({
      message: "Berhasil mengupdate data loker",
      data: loker.data,
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controller/lokerController.js:updateLoker - " + error.message
      )
    );
  }
};

const deleteLoker = async (req, res, next) => {
  const t = await db.transaction();
  const id = req.params.id;

  try {
    const existingLoker = await Loker.findByPk(id);

    if (!existingLoker) {
      return res.status(404).json({
        errors: ["Data loker tidak ditemukan."],
        message: "Gagal menghapus data loker.",
      });
    }

    if (existingLoker.id_pengguna !== req.user.id_pengguna) {
      return res.status(403).json({
        errors: ["Anda tidak memiliki izin untuk menghapus data loker ini."],
        message: "Gagal menghapus data, tidak memiliki izin",
      });
    }

    if (existingLoker.gambar_loker) {
      fs.unlink(existingLoker.gambar_loker, (err) => {
        if (err) {
          console.error(`Gagal menghapus gambar: ${err.message}`);
        }
      });
    }

    const result = await Loker.destroy({
      where: {
        id_loker: id,
      },
      transaction: t,
    });

    if (result === 0) {
      await t.rollback();
      return res.status(400).json({
        message: "Gagal menghapus data loker",
      });
    }

    await t.commit();
    res.status(200).json({
      message: "Data loker berhasil dihapus",
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controller/lokerController.js:deleteLoker - " + error.message
      )
    );
  }
};

export {
  createLoker,
  getAllLoker,
  getMyPosts,
  updateLoker,
  deleteLoker,
  getLokerById,
};
