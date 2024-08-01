import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRETKEY } from "../config/config";
import { refreshRouter } from "./refreshRouter";

export const authRouter = express.Router();

export const authCheck = function () {
  authRouter.post("/(.html)?", (req, res) => {
    if (JWT_SECRETKEY === undefined) {
      logging.error("JWT SERET KEY not found!");
      res.status(500).json({ message: "Server error" });
    } else {
      const accessToken = req.cookies["accessToken"];
      jwt.verify(accessToken, JWT_SECRETKEY!, function (err, decoded) {
        if (err === null) {
          res.status(200);
          logging.log(
            `Outgoing - METHOD:[${req.method}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}] - STATUS:[${res.statusCode}]`,
          );
        } else {
          if (err.name === "TokenExpiredError") {
            logging.log(
              `Outgoing - METHOD:[${req.method}] - URL:[${req.url}] - IP:[${req.socket.remoteAddress}] - STATUS:[${res.statusCode}] - REASON:[Token expired]`,
            );
            logging.log(`Checking for refresh token`);
            return res.redirect("http://localhost:3001/refresh");
          } else if (err.name === "JsonWebTokenError") {
            //  invalid token
            logging.warn(err.message);
            res.status(401).json({ message: "Not Authorized." });
          }
        }
      });
    }
  });
};

authCheck();
