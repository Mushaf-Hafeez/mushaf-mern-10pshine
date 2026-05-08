import User from "../models/user.model";
import type { Request, Response, NextFunction } from "express";
import { updateProfileValidation } from "../validators/validations";
import AppError from "../utils/AppError";

// updateProfile controller function
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = updateProfileValidation.safeParse({
      name: req.body.name,
      profile_pic: req?.file?.path,
    });

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    // update the user
    const user = await User.findByIdAndUpdate(req.user!._id, result.data, {
      new: true,
    });

    // return success response
    return res.status(200).json({
      success: true,
      user,
      message: "User has been updated successfully.",
    });
  } catch (error: any) {
    next(error);
  }
};
