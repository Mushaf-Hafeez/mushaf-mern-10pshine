import Note from "../models/note.model";
import AppError from "../utils/utils";

import type { Request, Response, NextFunction } from "express";

// getNotes controller
export const getNotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // get the user id from req.user
    const user = req.user!._id;

    // get all the notes from the database
    const notes = await Note.find({ user }).populate("user", "-password");

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error: any) {
    next(error);
  }
};
