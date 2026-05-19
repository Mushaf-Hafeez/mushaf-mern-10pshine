import mongoose, { Schema, Types, Document } from "mongoose";

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
const Note = mongoose.model<INote>("Note", noteSchema);
export default Note;
