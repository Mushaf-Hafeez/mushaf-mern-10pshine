import mongoose from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("database connected");
  } catch (error: any) {
    console.log("Error while connecting to the database: ", error.message);
    process.exit(1);
  }
};

export default connectDB;
