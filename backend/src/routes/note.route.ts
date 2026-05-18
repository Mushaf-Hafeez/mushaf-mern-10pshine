import { Router } from "express";
const noteRoutes = Router();

// importing controllers
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchedNotes,
} from "../controllers/note.controller";

// importing middlewares
import { isAuth } from "../middlewares/auth.middleware";

// defining routes
noteRoutes.get("/", isAuth, getNotes);
noteRoutes.get("/search", isAuth, searchedNotes);
noteRoutes.get("/:id", isAuth, getNote);
noteRoutes.post("/", isAuth, createNote);
noteRoutes.put("/:id", isAuth, updateNote);
noteRoutes.delete("/:id", isAuth, deleteNote);

export default noteRoutes;
