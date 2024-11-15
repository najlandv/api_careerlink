import { compare } from "bcrypt";
import Pengguna from "../models/Pengguna.js";
import db from "../utils/db.js";
import { dataValid } from "../validation/dataValidation.js";
import { generateAccessToken } from "../utils/jwt.js";

const register = async (req, res, next) => {
    const t = await db.transaction();
    const valid = {
        nama_lengkap: "required",
        nama_pengguna: "required",
        email: "required,isEmail",
        password: "required",
        confirmPassword: "required",
    };

    try {
        const user = await dataValid(valid, req.body);

        if (user.data.password !== user.data.confirmPassword) {
            user.message.push("Password tidak sesuai");
        }

        if (user.message.length > 0) {
            return res.status(400).json({
                errors: user.message,
                message: "Register Failed",
            });
        }

        const emailExist = await Pengguna.findAll({
            where: {
                email: user.data.email,
            },
        });

        if (emailExist.length > 0) {
            return res.status(400).json({
                errors: ["Email telah digunakan"],
                message: "Register Failed",
            });
        }

        const newUser = await Pengguna.create(
            {
                ...user.data,
            },
            {
                transaction: t,
            }
        );

        if (!newUser) {
            await t.rollback();
            return res.status(400).json({
                message: "Register Failed",
            });
        } else {
            await t.commit();
            res.status(201).json({
                message: "Register Successfully",
            });
        }
    } catch (error) {
        await t.rollback();
        next(
            new Error(
                "controller/authController.js:register - " + error.message
            )
        );
    }
};

const login = async (req, res, next) => {
    try {
        const valid = {
            email: "required",
            password: "required",
        };
        const user = await dataValid(valid, req.body);
        const data = user.data;
        if (user.message.length > 0) {
            return res.status(400).json({
                errors: user.message,
                message: "Login Failed",
            });
        }
        const userExists = await Pengguna.findOne({
            where: {
                email: data.email,
            },
        });
        if (!userExists || !compare(data.password, userExists.password)) {
            // Return a generic error message for both user not found and wrong password
            return res.status(400).json({
                errors: ["Email or password is incorrect"],
                message: "Login Failed",
            });
        }

        // Sertakan id_pengguna dalam payload
        const usr = {
            id_pengguna: userExists.id_pengguna,  // Pastikan ID pengguna ditambahkan
            nama_lengkap: userExists.nama_lengkap,
            email: userExists.email,
        };

        const token = generateAccessToken(usr);  // Pastikan token berisi id_pengguna

        return res.status(200).json({
            errors: [],
            message: "Login successful",
            data: usr,
            accessToken: token,  // Token yang dikirimkan ke client
        });
    } catch (error) {
        next(new Error("controllers/authController.js:login - " + error.message));
    }
};

export { register, login };