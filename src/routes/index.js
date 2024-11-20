import express from "express";
import errorrHandling from "../controller/errorrHandling.js";
import authRoute from "./authRoute.js";
import profileRoute from "./profileRoute.js";
import magangRoute from "./magangRoute.js"; 
import lokerRoute from "./lokerRoute.js"; 
import ubahpwRoute from "./ubahpwRoute.js"; 

const route = express.Router();
// Membuat routes-nya
const routers = [authRoute, profileRoute, ubahpwRoute, magangRoute, lokerRoute]

routers.forEach((router) => route.use("/api", router));

route.use("*", errorrHandling);
route.use("*", (req, res) => {
  res.status(404).json({
    errors: ["Page Not Found"],
    message: "Internal Server Error",
    data: null,
  });
});

export default route;
