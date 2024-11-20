import express from "express";
import {
  createLoker,
  getAllLoker,
  getMyPosts,
  updateLoker,
  deleteLoker,
  getLokerById,
} from "../controller/lokerController.js";
import authenticate from "../middleware/authenticate.js";
import { lokerUpload } from "../middleware/multer.js";

const lokerRoute = express.Router();

lokerRoute.post(
  "/lokerupload",
  authenticate,
  lokerUpload.single("gambar_loker"),
  createLoker
);
lokerRoute.get("/loker", getAllLoker);

lokerRoute.get("/loker/myposts", authenticate, getMyPosts);

lokerRoute.patch(
  "/lokerupload/:id",
  authenticate,
  lokerUpload.single("gambar_loker"),
  updateLoker
);

lokerRoute.delete(
  "/lokerupload/:id", 
  authenticate,
  deleteLoker 
);

lokerRoute.get("/loker/:id", getLokerById);

export default lokerRoute;
