import mongoose from "mongoose";
import { DATABASE_URI } from "../config/config";

if (!DATABASE_URI) {
  const noConnectionStringError = new Error(
    "Database connection string not found",
  );
  logging.error(noConnectionStringError);
}

export const connectDB = async () => {
  try {
    if (!DATABASE_URI) {
      throw new Error("DATABASE URI KEY MISSING");
    }
    mongoose.connection.once("connected", () => {
      logging.info("***********************************");
      logging.info("*** SUCCESS: DATABASE CONNECTED ***");
      logging.info("***********************************");
    });
    await mongoose.connect(DATABASE_URI);
  } catch (err) {
    logging.error(err);
    logging.warn("Database connection failed");
  }
};
