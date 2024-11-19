import express from "express";
import {
  createMagang,
  getAllMagang,
  getMyPosts,
  updateMagang,
  deleteMagang,
  getMagangById,
} from "../controller/magangController.js";
import authenticate from "../middleware/authenticate.js";
import { magangUpload } from "../middleware/multer.js";

const magangRoute = express.Router();

magangRoute.post(
  "/magangupload",
  authenticate,
  magangUpload.single("gambar_magang"),
  createMagang
);
magangRoute.get("/magang", getAllMagang);

magangRoute.get("/magang/myposts", authenticate, getMyPosts);

magangRoute.patch(
  "/magangupload/:id",
  authenticate,
  magangUpload.single("gambar_magang"),
  updateMagang
);

magangRoute.delete(
  "/magangupload/:id", 
  authenticate,
  deleteMagang 
);

magangRoute.get("/magang/:id", getMagangById);

export default magangRoute;
