import express from "express";
import logging from "./utils/logging";
import http from "http";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { PORT } from "./config/config";

import { connectDB } from "./middleware/connectDB";
import { loggingHandler } from "./middleware/loggingHandler";
import { corsHandler } from "./middleware/corsHandler";
import { routeNotFound } from "./middleware/routeNotFound";
import { userProjectModel } from "./models/UserProjects";
import { loginRouter } from "./routers/loginRouter";
import { registerRouter } from "./routers/registerRouter";
import { authRouter, authCheck } from "./routers/authRouter";
import { refreshRouter } from "./routers/refreshRouter";
import { logoutRouter } from "./routers/logoutRouter";
import { dataRouter } from "./routers/dataRouter";

export const app = express();
export let listener: ReturnType<typeof http.createServer>;

export const initializeServer = function () {
  logging.info("-------------------------------------");
  logging.info("Initialize API");
  logging.info("-------------------------------------");
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json()); //allow access request body through req.body
  app.use(cookieParser());
  app.use(express.static("static"));

  logging.info("-------------------------------------");
  logging.info("Initialize logging handler");
  logging.info("-------------------------------------");
  app.use(loggingHandler);

  logging.info("-------------------------------------");
  logging.info("Loading CORS options");
  logging.info("-------------------------------------");
  app.use(corsHandler);

  logging.info("-------------------------------------");
  logging.info("Creating routes");
  logging.info("-------------------------------------");
  app.get("^/$|/index(.html)?", (req, res) => {
    res.status(200).send({ hello: "world" });
  });
  app.use("/api/data/", dataRouter);
  app.use("/login", loginRouter);
  app.use("/register", registerRouter);
  app.use("/refresh", refreshRouter);
  app.use("/auth", authRouter);
  app.use("/logout", logoutRouter);

  logging.info("-------------------------------------");
  logging.info("Creating health check route");
  logging.info("-------------------------------------");
  app.get("/healthcheck(.html)?", (req, res) => {
    res.status(200).send({ health: "check" });
  });

  logging.info("-------------------------------------");
  logging.info("Creating demo data route");
  logging.info("-------------------------------------");
  app.get("/demodata(.html)?", authCheck, async (req, res) => {
    try {
      const demoUserProjects = await userProjectModel.find({}).exec();
      res.status(200).send(demoUserProjects);
    } catch (error) {
      logging.error(error);
      res
        .status(500)
        .send({ message: "Server error, unable to retrieve user projects" });
    }
  });

  logging.info("-------------------------------------");
  logging.info("Loading 404 route handler");
  logging.info("-------------------------------------");
  app.use(routeNotFound);
};

async function startServer() {
  logging.info("-------------------------------------");
  logging.info("Connecting Database");
  logging.info("-------------------------------------");

  initializeServer();
  mongoose.connection.once("connected", () => {
    listener = app.listen(PORT, () => {
      logging.info("-------------------------------------");
      logging.info(`Server started on port ${PORT}`);
      logging.info("-------------------------------------");
    });
  });
  await connectDB();
}

startServer();
