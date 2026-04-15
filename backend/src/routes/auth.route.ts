import { Router } from "express";
const authRoutes = Router();

// importing controllers
import { sendOTP } from "../controllers/auth.controller";

// defining routes
authRoutes.post("/otp", sendOTP);

export default authRoutes;
