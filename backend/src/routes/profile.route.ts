import { Router } from "express";
const profileRoutes = Router();

// importing middlewares
import { isAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/multer.config";

// importing controllers
import {
  getProfile,
  updateProfile,
  updateProfilePic,
} from "../controllers/profile.controller";

// defining routes
profileRoutes.get("/", isAuth, getProfile);
profileRoutes.put("/", isAuth, updateProfile);
profileRoutes.put(
  "/profile-pic",
  isAuth,
  upload.single("image"),
  updateProfilePic,
);

export default profileRoutes;
