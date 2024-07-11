import dotenv from "dotenv";

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const TEST = process.env.NODE_ENV === "test";

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export const DATABASE_URI = process.env.DATABASE_URI;
