import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRETKEY } from "../config/config";

export const authRouter = express.Router();

authRouter.post("/(.html)?", (req, res) => {
  if (JWT_SECRETKEY === undefined) {
    logging.error("JWT SERET KEY not found!");
    res.status(500).json({ message: "Server error" });
  } else {
    const jwtToken = req.cookies.jwt;
    jwt.verify(jwtToken, JWT_SECRETKEY!, function (err, decoded) {
      if (err === null) {
        res.status(200);
        logging.log(
          `Incoming - METHOD:[${req.method}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}] - STATUS:[${res.statusCode}]`,
        );
      } else {
        if (err.name === "TokenExpiredError") {
          // refresh token if expired?
          res.status(401).json({ message: "Token expired." });
          logging.log(
            `Incoming - METHOD:[${req.method}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}] - STATUS:[${res.statusCode}] - REASON:[${res.header}]`,
          );
        } else if (err.name === "JsonWebTokenError") {
          //  invalid token
          logging.warn(err.message);
          res.status(401).json({ message: "Not Authorized." });
        }
      }
    });
  }
});
