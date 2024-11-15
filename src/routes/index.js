import express from "express";
import errorrHandling from "../controller/errorrHandling.js";

const route = express.Router();

const routers = [];

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
