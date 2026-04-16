import { Router } from "express";
const authRoutes = Router();

// importing controllers
import { sendOTP, signup } from "../controllers/auth.controller";

// defining routes
authRoutes.post("/otp", sendOTP);
authRoutes.post("/signup", signup);

export default authRoutes;
