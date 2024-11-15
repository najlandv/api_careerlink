import db from "../utils/db.js";
import { Sequelize } from "sequelize";
import Pengguna from "./Pengguna.js";

const Magang = db.define(
  "Magang",
  {
    id_magang: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    tanggal_posting: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    perusahaan: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    judul_magang: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    alamat: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    posisi_magang: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    kualifikasi: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    jenis_magang: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    durasi_magang: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    deskripsi_magang: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    kontak: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gambar_magang: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "magang",
    underscored: true,
    timestamps: true,
  }
);

Pengguna.hasMany(Magang, {
  foreignKey: "id_pengguna",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Magang.belongsTo(Pengguna, {
  foreignKey: "id_pengguna",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Magang;
