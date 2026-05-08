import { Router } from "express";
const profileRoutes = Router();

// importing middlewares
import { isAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/multer.config";

// importing controllers
import { updateProfile } from "../controllers/profile.controller";

// defining routes
profileRoutes.put("/", isAuth, upload.single("image"), updateProfile);

export default profileRoutes;
