import type { Request, Response, NextFunction } from "express";

import OTP from "../models/otp.model";
import User from "../models/user.model";

import {
  createUserValidation,
  emailValidation,
  loginValidation,
  resetPasswordValidation,
} from "../validators/validations";
import AppError from "../utils/AppError";
import {
  createJWT,
  generateOTP,
  sendOTPMail,
  sendResetPasswordMail,
  verifyOTP,
} from "../utils/utils";

import bcrypt from "bcryptjs";

// sendOTP controller
export const sendOTP = async (
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

    // check if the user already exists with this mail in the database
    const user = await User.findOne({ email });

    // return if user found
    if (user) {
      return next(new AppError(400, "User already exists."));
    }

    // generate otp and store it in the database
    const otp = generateOTP();

    // delete all the otp with the email first
    await OTP.deleteMany({ email });

    // store the otp with the email in the database and then send the mail to the user.
    await OTP.create({
      otp,
      expires_in: new Date(Date.now() + 5 * 60 * 1000),
      email,
    });

    // send the otp via mail to the user
    await sendOTPMail(otp, email);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

    // send success response
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
    const result = createUserValidation.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    interface UserData {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      otp: string;
    }

    let userData: UserData = result.data;

    // check if the user already exists in the database
    let user = await User.findOne({ email: userData.email });

    if (user) {
      return next(new AppError(400, "User already exists."));
    }

    // verify the otp
    const isValidOTP = await verifyOTP(userData.otp, userData.email);

    // handle invalid/expired otp
    if (!isValidOTP) {
      return next(new AppError(400, "Invalid/expired OTP."));
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // store it in the database
    user = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      profile_pic: `https://api.dicebear.com/9.x/avataaars/svg?seed=${crypto.randomUUID()}`,
    });

    if (!user) {
      return next(new AppError(500, "Error while creating the user."));
    }

    // delete all the otps
    await OTP.deleteMany({ email: user.email });

    const payload = {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };

    // get the jwt token
    const token: string = createJWT(payload);

    // also send user without password in the response
    const { password, ...safeUser } = user.toObject();

    // return the response
    return res.status(201).json({
      success: true,
      user: safeUser,
      token,
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

      // return the response
      return res.status(200).json({
        success: true,
        user: safeUser,
        token,
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
