import mongoose, { Schema, Document } from "mongoose";

// defining interface
export interface IOTP extends Document {
  otp: number;
  expires_in: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// defining schema
const otpSchema = new Schema<IOTP>(
  {
    otp: {
      type: Number,
      required: true,
    },
    expires_in: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// defining model
const OTP = mongoose.model<IOTP>("OTP", otpSchema);
export default OTP;
