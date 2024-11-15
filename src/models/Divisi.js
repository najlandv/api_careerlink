import db from "../utils/db.js";
import { Sequelize } from "sequelize";

const Divisi = db.define(
    "DB",
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_divis: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "divisi",
        underscored: true,
        timestamps: false,
    }
);

export default Divisi;
