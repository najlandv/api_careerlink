import express from 'express';
import { register, login } from "../controller/authController.js";

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);

export default authRoute;
