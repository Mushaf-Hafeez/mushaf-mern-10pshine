import mongoose, { Document, Schema } from "mongoose";

// defining interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profile_pic?: string;
  reset_password_token?: string;
  reset_password_token_expires_in?: string;
  createdAt: Date;
  updatedAt: Date;
}

// defining schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      //  uncomment it in production
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
    },
    reset_password_token: {
      type: String,
    },
    reset_password_token_expires_in: {
      type: String,
    },
  },
  { timestamps: true },
);

// defining model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
