import { Router } from "express";
const authRoutes = Router();

// importing controllers
import {
  sendOTP,
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

// defining routes
authRoutes.post("/otp", sendOTP);
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.put("/forgot-password", forgotPassword);
authRoutes.put("/reset-password", resetPassword);

export default authRoutes;
