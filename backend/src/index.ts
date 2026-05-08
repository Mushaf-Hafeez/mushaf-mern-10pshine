import express from "express";
import type { Application, Request, Response, NextFunction } from "express";

// importing routes
import authRoutes from "./routes/auth.route";
import noteRoutes from "./routes/note.route";
import profileRoutes from "./routes/profile.route";

// importing logger
import logger from "./utils/logger";
import httpLogger from "./utils/httpLogger";

import cors from "cors";
import type { CorsOptions } from "cors";

// environment variables
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;

// creating app
const app: Application = express();

// database connection
import connectDB from "./config/db.config";
connectDB();

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// middleware
app.use(express.json());
app.use(httpLogger);
app.use(cors(corsOptions));

// api versioning
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/profile", profileRoutes);

// defining customError interface
interface CustomError extends Error {
  statusCode: number;
}

// global error handler
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    req.log.error({
      message: error.message,
      path: req.originalUrl,
      method: req.method,
    });

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
  logger.info(`server is running on http://localhost:${PORT}`);
});
