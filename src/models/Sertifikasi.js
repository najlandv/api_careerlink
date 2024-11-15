import db from "../utils/db.js";
import { Sequelize } from "sequelize";
import Pengguna from "./Pengguna.js";

const Sertifikasi = db.define("Sertifikasi", {
    id_sertifikasi: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    tanggal_posting: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    instansi: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    judul_sertifikasi: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    tanggal_pelaksanaan: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    gambar_sertifikasi: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    kontak: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    harga: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
},
{
    tableName: "sertifikasi",
    underscored: true,
    timestamps: true,
}
);

Pengguna.hasMany(Sertifikasi, {
    foreignKey: "id_pengguna",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

Sertifikasi.belongsTo(Pengguna, {
    foreignKey: "id_pengguna",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
}
);

export default Sertifikasi;