import OTP from "../models/otp.model";

import type { SendMailOptions } from "nodemailer";
import type { SignOptions } from "jsonwebtoken";

import transporter from "../config/nodemailer.config";

import {
  OTPMailTemplate,
  resetPasswordMailTemplate,
} from "../templates/templates";

import jwt from "jsonwebtoken";

import { config } from "dotenv";
config();

export const sendOTPMail = async (otp: string, to: string) => {
  const options: SendMailOptions = {
    to,
    from: process.env.MAIL_USER,
    subject: "Note Flow OTP Verification.",
    html: OTPMailTemplate(otp),
  };

  try {
    const mailResponse = await transporter.sendMail(options);
    return true;
  } catch (error: any) {
    console.log("Error while send the OTP mail: ", error.message);
    return false;
  }
};

export const sendResetPasswordMail = async (resetLink: string, to: string) => {
  const options: SendMailOptions = {
    to,
    from: process.env.MAIL_USER,
    subject: "Note Flow Reset Password.",
    html: resetPasswordMailTemplate(resetLink),
  };

  try {
    const mailResponse = await transporter.sendMail(options);
    return true;
  } catch (error: any) {
    console.log("Error while send the reset password mail: ", error.message);
    return false;
  }
};

export const generateOTP = (): string => {
  let otp = "";
  for (let counter = 0; counter < 6; counter++) {
    const num = Math.floor(Math.random() * 10);
    otp += num;
  }

  return otp;
};

export const verifyOTP = async (
  otp: string,
  email: string,
): Promise<boolean> => {
  const validOTP = await OTP.findOne({
    $and: [{ otp }, { email }, { expires_in: { $gt: new Date() } }],
  });

  if (validOTP) return true;

  return false;
};

export const createJWT = (payload: {
  id: string;
  name: string;
  email: string;
}): string => {
  const options: SignOptions = {
    expiresIn: "7d",
  };

  const token: string = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    options,
  );

  return token;
};

// creating AppError class and extends it with Error
class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default AppError;
