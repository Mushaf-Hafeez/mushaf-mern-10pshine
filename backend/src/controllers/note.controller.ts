import Note from "../models/note.model";
import AppError from "../utils/AppError";

import type { Request, Response, NextFunction } from "express";
import {
  createNoteValidation,
  noteIdValidation,
  updateNoteValidation,
} from "../validators/validations";

// getNotes controller
export const getNotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // get the user id from req.user
    const user = req.user!._id;

    // get the params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // get how many notes user have in the database
    const totalNotes = await Note.countDocuments({ user });

    // get all the notes from the database
    const notes = await Note.find({ user })
      .populate("user", "-password")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // check if more notes exist
    const hasMore = skip + notes.length < totalNotes;

    return res.status(200).json({
      success: true,
      notes,
      hasMore,
      currentPage: page,
    });
  } catch (error: any) {
    next(error);
  }
};

// getNote controller
export const getNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = noteIdValidation.safeParse(req.params);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    // get the id
    const id = result.data.id;

    // find the note from the database
    const note = await Note.findOne({ _id: id, user: req.user!._id }).populate(
      "user",
      "-password",
    );

    // returns if no note found
    if (!note) {
      return next(new AppError(404, "Note not found."));
    }

    // return success response
    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error: any) {
    next(error);
  }
};

// createNote controller
export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = createNoteValidation.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    const { content } = result.data;

    // create note
    const note = await Note.create({
      content,
      user: req.user!._id,
    });

    // return success response
    return res.status(201).json({
      success: true,
      note,
    });
  } catch (error: any) {
    next(error);
  }
};

// updateNote controller
export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const paramsResult = noteIdValidation.safeParse(req.params);
    if (!paramsResult.success) {
      return next(
        new AppError(
          400,
          paramsResult.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    const bodyResult = updateNoteValidation.safeParse(req.body);
    if (!bodyResult.success) {
      return next(
        new AppError(
          400,
          bodyResult.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    const { id } = paramsResult.data;
    const { content } = bodyResult.data;

    // update the note
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: req.user!._id },
      { $set: { content } },
      { new: true },
    );

    // return if not updated
    if (!updatedNote) {
      return next(new AppError(404, "Note not found."));
    }

    // success response
    return res.status(200).json({
      success: true,
      note: updatedNote,
    });
  } catch (error: any) {
    next(error);
  }
};

// deleteNote controller
export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validation
    const result = noteIdValidation.safeParse(req.params);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues[0]?.message || "Validation error.",
        ),
      );
    }

    const { id } = result.data;

    // delete the note
    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      user: req.user!._id,
    });

    if (!deletedNote) {
      return next(new AppError(404, "Note not found."));
    }

    // success response
    return res.status(200).json({
      success: true,
      message: "Note has been deleted.",
    });
  } catch (error: any) {
    next(error);
  }
};
