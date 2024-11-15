// routes/profileRoute.js
import express from "express";
import { getProfile, updateProfile } from "../controller/profileController.js";
import authenticate from "../middleware/authenticate.js";

const profileRoute = express.Router();

profileRoute.get("/profile", authenticate, getProfile);
profileRoute.put("/profile", authenticate, updateProfile);

export default profileRoute;
