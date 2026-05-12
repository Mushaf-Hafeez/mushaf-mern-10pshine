import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import type { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";

import { config } from "dotenv";
config();

import AppError from "../utils/AppError";

// Extend Express Request to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface Payload {
  id: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // get the token
    const token = req.cookies.token;

    // validation
    if (!token) {
      return next(new AppError(401, "Token is required."));
    }

    // decode the token
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as Payload;

    if (typeof decode === "string") {
      return next(new AppError(401, "Invalid token."));
    }

    const user: IUser | null = await User.findById(decode.id).select(
      "-password",
    );

    if (!user) {
      return next(new AppError(404, "User not found."));
    }

    req.user = user;

    next();
  } catch (error: any) {
    next(error);
  }
};
