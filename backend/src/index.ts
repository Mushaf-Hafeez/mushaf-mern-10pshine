import express from "express";
import type { Application, Request, Response } from "express";

// environment variables
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;

// creating app
const app: Application = express();

// database connection
import connectDB from "./config/db.config.ts";
connectDB();

// middleware
app.use(express.json());

// default route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "server is running",
  });
});

// listen to the requests
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
