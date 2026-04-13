import mongoose, { Schema, Types, Document } from "mongoose";

// defining interface
export interface IOTP extends Document {
  otp: number;
  expires_in: string;
  user: Types.ObjectId;
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// defining model
const OTP = mongoose.model<IOTP>("OTP", otpSchema);
export default OTP;
