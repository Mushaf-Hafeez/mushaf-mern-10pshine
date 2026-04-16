import express from "express";
import type { Application, Request, Response, NextFunction } from "express";

// importing routes
import authRoutes from "./routes/auth.route";

// environment variables
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;

// creating app
const app: Application = express();

// database connection
import connectDB from "./config/db.config";
connectDB();

// middleware
app.use(express.json());

// api versioning
app.use("/api/v1/auth", authRoutes);

// defining customError interface
interface CustomError extends Error {
  statusCode: number;
}

// global error handler
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.log(error.message);

    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  },
);

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
