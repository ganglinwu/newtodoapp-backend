import express from "express";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { JWT_SECRETKEY } from "../config/config";
import { userModel } from "../models/Users";

export const loginRouter = express.Router();

loginRouter.get("(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "/static", "/login.html"));
});

loginRouter.post("(.html)?", async (req, res) => {
  const { userName, password } = req.body;
  const user = await userModel.findOne({ userName }).exec();
  if (!user) {
    res.status(401).json({ message: "Unauthorized Access, Login failed" });
    logging.warn(
      `Unauthorized Access(No Such User) - REQ BODY:[${req.body}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}]`,
    );
  } else if (!JWT_SECRETKEY) {
    logging.warn("JWT_SECRETKEY NOT FOUND");
    res.status(500).json({ message: "Server Error" });
  } else {
    try {
      const result = await bcrypt.compare(password, user!.password);
      if (result) {
        const token = jwt.sign({ userID: user!._id }, JWT_SECRETKEY!, {
          expiresIn: "1h",
        });
        res.status(200).json({ message: "Login Success", token });
      } else {
        logging.warning(
          `Unauthorized Access(PASSWORD DOES NOT MATCH) - REQ BODY:[${req.body}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}]`,
        );
        res.status(401).json({ message: "Unauthorized Access, Login failed" });
      }
    } catch (err) {
      logging.error(err.message);
      res.status(500).json({ message: "Server error" });
    }
  }
});
