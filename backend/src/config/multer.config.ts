import multer from "multer";
import type { FileFilterCallback } from "multer";
import { storage } from "./cloudinary.config";

import type { Request } from "express";

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPG, and JPEG files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
