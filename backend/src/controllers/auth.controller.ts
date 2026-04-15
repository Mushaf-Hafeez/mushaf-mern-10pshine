import type { Request, Response, NextFunction } from "express";
import { emailValidation } from "../validators/validations";
import { generateOTP, sendOTPMail } from "../utils/utils";
import OTP from "../models/otp.model";
import z from "zod";

export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = emailValidation.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error?.issues[0]?.message,
      });
    }

    const email = result.data.email;

    // generate otp and store it in the database
    const otp = generateOTP();

    // delete all the otp with the email first
    await OTP.deleteMany({ email });

    // store the otp with the email in the database and then send the mail to the user.
    await OTP.create({
      otp,
      expires_in: String(Date.now() + 5 * 60 * 1000),
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
