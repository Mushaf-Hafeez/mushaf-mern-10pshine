import { Router } from "express";
const authRoutes = Router();

// importing controllers
import {
  sendOTP,
  signup,
  login,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller";

// importing middlewares
import { isAuth } from "../middlewares/auth.middleware";

// defining routes
authRoutes.post("/otp", sendOTP);
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.put("/forgot-password", forgotPassword);
authRoutes.put("/reset-password", resetPassword);
authRoutes.get("/check-auth", isAuth, checkAuth);

export default authRoutes;
