import mongoose from "mongoose";
import logger from "../utils/logger";
import { config } from "dotenv";
config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    logger.info("database connected");
  } catch (error: any) {
    logger.error("Error while connecting to the database: ", error.message);
    process.exit(1);
  }
};

export default connectDB;
