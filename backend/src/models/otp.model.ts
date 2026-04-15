import mongoose, { Schema, Document } from "mongoose";

// defining interface
export interface IOTP extends Document {
  otp: string;
  expires_in: Date;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// defining schema
const otpSchema = new Schema<IOTP>(
  {
    otp: {
      type: String,
      required: true,
    },
    expires_in: {
      type: Date,
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
