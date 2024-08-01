import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRETKEY } from "../config/config";

export const refreshRouter = express.Router();

refreshRouter.get("/(.html)?", (req, res) => {
  logging.log(
    `Incoming - METHOD:[${req.method}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}]`,
  );
  if (JWT_SECRETKEY === undefined) {
    logging.error("JWT SECRET KEY not found!");
    return res.status(500).json({ message: "Server error" });
  }
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    logging.log(`Outgoing - STATUS:[401] - refresh token not found`);
    return res
      .status(401)
      .json({ message: "Refresh Token not found. Not Authorized." });
  }
  try {
    const { username, email } = jwt.verify(refreshToken, JWT_SECRETKEY!) as {
      username: string;
      email: string;
    };
    const accessToken = jwt.sign(
      { userName: username, email: email },
      JWT_SECRETKEY!,
      {
        expiresIn: "300",
      },
    );
    res.clearCookie("accessToken");
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    });
    return res.status(200).json({ message: "New accessToken granted" });
  } catch (err) {
    res.clearCookie(refreshToken);
    logging.error(err);
    return res
      .status(401)
      .json({ message: "Not authorized, please log in again." });
  }
});
