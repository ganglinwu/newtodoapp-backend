import express from "express";
import path from "path";
import { userModel } from "../models/Users";

export const loginRouter = express.Router();

loginRouter.get("(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "/static", "/login.html"));
});

loginRouter.post("(.html)?", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await userModel.findOne({ userName }).exec();
    if (!user) {
      res
        .status(401)
        .json({ message: "Unauthorized Access, no matching user" });
      logging.info(
        `Unauthorized Access - REQ BODY:[${req.body}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}]`,
      );
    }
    }
  } catch (err) {
    res.status(400).json({ message: `${err}` + "username not found" });
    res.sendFile(path.join(__dirname, "..", "..", "/static", "/login.html"));
  }
});
