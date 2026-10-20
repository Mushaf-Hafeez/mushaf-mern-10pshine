import type { Request, Response, NextFunction } from "express";

import OTP from "../models/otp.model";
import User from "../models/user.model";

import {
  createUserValidation,
  deleteAccountValidation,
  emailValidation,
  loginValidation,
  resetPasswordValidation,
  sendOTPValidation,
  signupWithOTPValidation,
} from "../validators/validations";
import AppError from "../utils/AppError";
import {
  createJWT,
  generateOTP,
  sendOTPMail,
  sendResetPasswordMail,
} from "../utils/utils";

import bcrypt from "bcryptjs";
import Note from "../models/note.model";
import mongoose from "mongoose";

// sendOTP controller
export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = sendOTPValidation.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    interface SignupData {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }

    let signupData: SignupData = result.data;

    // check if the user already exists with this email in the database
    const user = await User.findOne({ email: signupData.email });

    // return if user found
    if (user) {
      return next(new AppError(400, "User already exists."));
    }

    // hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(signupData.password, salt);

    // generate otp
    const otp = generateOTP();

    // delete all previous otp records for this email
    await OTP.deleteMany({ email: signupData.email });

    // store temporary signup data with otp in the database
    await OTP.create({
      name: signupData.name,
      email: signupData.email,
      password: hashedPassword,
      otp,
      expires_in: new Date(Date.now() + 5 * 60 * 1000),
    });

    // send the otp via mail to the user
    await sendOTPMail(otp, signupData.email);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error: any) {
    next(error);
  }
};

// signup controller
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validate user's data
    const result = signupWithOTPValidation.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    interface SignupVerifyData {
      email: string;
      otp: string;
    }

    let signupData: SignupVerifyData = result.data;

    // check if the user already exists in the database
    let user = await User.findOne({ email: signupData.email });

    if (user) {
      return next(new AppError(400, "User already exists."));
    }

    // verify the otp and fetch temporary signup data
    const otpRecord = await OTP.findOne({
      email: signupData.email,
      otp: signupData.otp,
    });

    // handle invalid/expired otp
    if (!otpRecord) {
      return next(new AppError(400, "Invalid/expired OTP."));
    }

    // check if otp has expired
    if (new Date() > otpRecord.expires_in) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return next(new AppError(400, "Invalid/expired OTP."));
    }

    // create user using stored temporary data
    user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
      profile_pic: `https://api.dicebear.com/9.x/avataaars/svg?seed=${crypto.randomUUID()}`,
    });

    if (!user) {
      return next(new AppError(500, "Error while creating the user."));
    }

    // delete the otp record after successful signup
    await OTP.deleteOne({ _id: otpRecord._id });

    const payload = {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };

    // get the jwt token
    const token: string = createJWT(payload);

    // also send user without password in the response
    const { password, ...safeUser } = user.toObject();

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // return the response
    return res.status(201).json({
      success: true,
      user: safeUser,
      message: "User created successfully.",
    });
  } catch (error: any) {
    next(error);
  }
};

// login controller
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = loginValidation.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    interface LoginData {
      email: string;
      password: string;
    }

    // get the logi data
    const loginData: LoginData = result.data;

    // return if not user found with this email in the database
    let user = await User.findOne({ email: loginData.email });

    if (!user) {
      return next(new AppError(404, "User not found. Please register first."));
    }

    // compare the password
    const doesPasswordMatch: boolean = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!doesPasswordMatch) {
      return next(new AppError(400, "Invalid password."));
    } else {
      // create token
      const payload = {
        id: String(user._id),
        name: user.name,
        email: user.email,
      };

      // get the jwt token
      const token: string = createJWT(payload);

      // also send the user in the response without password
      const { password, ...safeUser } = user.toObject();

      // set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // return the response
      return res.status(200).json({
        success: true,
        user: safeUser,
        message: "User logged in successfully.",
      });
    }
  } catch (error: any) {
    next(error);
  }
};

// forgotPassword controller
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = emailValidation.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    const email = result.data.email;

    // return if the user does not exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError(404, "User not exists."));
    }

    // generate a reset_password_token
    const reset_password_token: string = crypto.randomUUID();

    // update the user
    user.reset_password_token = reset_password_token;
    user.reset_password_token_expires_in = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    // create the link to reset password that will redirect the user to reset-password-page
    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password/${reset_password_token}`;

    // send the reset password link to the user's mail
    await sendResetPasswordMail(resetPasswordLink, email);

    // send the success response
    return res.status(200).json({
      success: true,
      message: "Mail sent successfully.",
    });
  } catch (error: any) {
    next(error);
  }
};

// resetPassword controller
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = resetPasswordValidation.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    // find the user
    const user = await User.findOne({
      $and: [
        {
          reset_password_token: result.data.reset_password_token,
        },
        {
          reset_password_token_expires_in: { $gt: new Date() },
        },
      ],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid/expired token.",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(result.data.password, salt);

    if (!hashedPassword) {
      return next(new AppError(500, "Error while hashing the password."));
    }

    // update user
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          reset_password_token: "",
          reset_password_token_expires_in: "",
        },
      },
    );

    if (!updatedUser) {
      return next(new AppError(500, "Error updating password."));
    }

    // send success response
    return res.status(200).json({
      success: true,
      message: "Password has been updated.",
    });
  } catch (error: any) {
    next(error);
  }
};

// checkAuth controller
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error: any) {
    next(error);
  }
};

// deleteAccount controller
export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = deleteAccountValidation.safeParse(req.body);

    if (!result.success) {
      throw new AppError(
        400,
        result.error.issues[0]?.message || "Validation error.",
      );
    }

    const password = result.data.password;

    // find the user from the database
    const user = await User.findById(req.user!._id);

    // return if no user found
    if (!user) {
      throw new AppError(404, "User not found.");
    }

    // compare the password
    if (!(await bcrypt.compare(password, user.password))) {
      throw new AppError(400, "Incorrect password.");
    }

    // delete all the user's notes
    await Note.deleteMany({ user: req.user!._id });

    // delete the user from the database
    await User.findByIdAndDelete(req.user!._id);

    // return the success response
    return res.status(200).json({
      success: true,
      message: "User has been deleted.",
    });
  } catch (error: any) {
    next(error);
  }
};

// logout controller
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};
