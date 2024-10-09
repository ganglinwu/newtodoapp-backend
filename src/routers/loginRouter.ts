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
    logging.warn(
      `Unauthorized Access(No Such User) - REQ BODY:[${req.body}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}]`,
    );
    return res
      .status(401)
      .json({ message: "Unauthorized Access, Login failed" });
  } else if (!JWT_SECRETKEY) {
    logging.warn("JWT_SECRETKEY NOT FOUND");
    return res.status(500).json({ message: "Server Error" });
  }
  try {
    const result = await bcrypt.compare(password, user!.password);
    if (result) {
      const accessToken = jwt.sign(
        { userName: user.userName, email: user.email },
        JWT_SECRETKEY!,
        {
          expiresIn: "60s",
        },
      );
      const refreshToken = jwt.sign(
        { userName: user.userName, email: user.email },
        JWT_SECRETKEY!,
        {
          expiresIn: "1d",
        },
      );
      res.clearCookie(accessToken);
      res.clearCookie(refreshToken);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      return res
        .status(200)
        .json({
          message: "Login Success",
          accessToken,
          username: user.userName,
          email: user.email,
        });
    } else {
      logging.warning(
        `Unauthorized Access(PASSWORD DOES NOT MATCH) - REQ BODY:[${req.body}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}]`,
      );
      return res
        .status(401)
        .json({ message: "Unauthorized Access, Login failed" });
    }
  } catch (err) {
    logging.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});
