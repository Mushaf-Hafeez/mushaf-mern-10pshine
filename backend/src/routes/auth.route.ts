import { Router } from "express";
const authRoutes = Router();

// importing controllers
import { sendOTP, signup, login } from "../controllers/auth.controller";

// defining routes
authRoutes.post("/otp", sendOTP);
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);

export default authRoutes;
