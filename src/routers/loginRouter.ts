import express from "express";
import path from "path";
import { userModel } from "../models/Users";
import bcrypt from "bcrypt";

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
  }
  try {
    const result = await bcrypt.compare(password, user!.password);
    logging.info(user!.password);
    logging.info(result);
    if (result) {
      res.status(200).json({ message: "Login Success" });
    } else {
      logging.warning(
        `Unauthorized Access(PASSWORD DOES NOT MATCH) - REQ BODY:[${req.body}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}]`,
      );
      res.status(401).json({ message: "Unauthorized Access, Login failed" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    res.sendFile(path.join(__dirname, "..", "..", "/static", "/login.html"));
  }
});
