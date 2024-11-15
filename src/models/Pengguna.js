import db from "../utils/db.js"
import { Sequelize } from "sequelize"
import{encrypt} from "../utils/bcrypt.js";


const Pengguna = db.define(
    "Pengguna",
    {
        id_pengguna: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        nama_lengkap: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },

        nama_pengguna: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        
        password:{
            type: Sequelize.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue("password", encrypt(value));
            },
        },
        
        
    },
{
    tableName: "pengguna",
        underscored: true,
        timestamps: false,
})

    export default Pengguna;