import db from "../utils/db.js";
import { Sequelize } from "sequelize";
import Pengguna from "./Pengguna.js";

const Loker = db.define("Loker", {
    id_loker: {
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
    judul_loker: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    alamat: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    posisi_loker: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    kualifikasi: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    jenis_loker: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    deskripsi_loker: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    kontak: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    gambar_loker: {
        type: Sequelize.STRING,
        allowNull: true,
    },

},  {tableName: "loker",
    underscored: true,
    }
);


Pengguna.hasMany(Loker, {
    foreignKey: "id_pengguna",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

Loker.belongsTo(Pengguna, {
    foreignKey: "id_pengguna",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

export default Loker;
