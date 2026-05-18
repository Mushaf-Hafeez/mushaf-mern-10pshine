import mongoose, { Schema, Types, Document } from "mongoose";
import { title } from "process";

// defining interface
export interface INote extends Document {
  title: string;
  content: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// defining schema
const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// createIndex on title and content for text search
noteSchema.index({ title: "text", content: "text" });

// defining model
const Note = mongoose.model<INote>("Note", noteSchema);
export default Note;
