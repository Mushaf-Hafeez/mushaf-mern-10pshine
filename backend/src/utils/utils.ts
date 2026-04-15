import transporter from "../config/nodemailer.config";
import type { SendMailOptions } from "nodemailer";

import { OTPMailTemplate } from "../templates/templates";

import { config } from "dotenv";
config();

export const sendOTPMail = async (otp: number, to: string) => {
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

export const generateOTP = (): number => {
  let otp = "";
  for (let counter = 0; counter < 6; counter++) {
    const num = Math.floor(Math.random() * 10);
    otp += num;
  }

  return Number(otp);
};
