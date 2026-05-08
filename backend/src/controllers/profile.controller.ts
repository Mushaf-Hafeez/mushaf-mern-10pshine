import User from "../models/user.model";
import type { Request, Response, NextFunction } from "express";

// updateProfile controller function
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
  } catch (error: any) {
    next(error);
  }
};
