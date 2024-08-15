import mongoose from "mongoose";

const Schema = mongoose.Schema;

// we nest taskSchema inside projectSchema so we declare this before projectSchema
const taskSchema = new Schema(
  {
    taskName: { type: String, required: true },
    taskDueDate: Date,
    taskUrgency: String,
    taskDuration: Number,
  },
  { _id: false, timestamps: true },
);

// we nest projectSchema inside userProjectSchema so we declare this before userProjectSchema
const projectSchema = new Schema(
  {
    projectName: { type: String, required: true },
    tasks: [taskSchema],
  },
  { _id: false, timestamps: true },
);

const userProjectSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    projects: [projectSchema],
  },
  { collection: "userprojects", timestamps: true },
);
export const userProjectModel = mongoose.model(
  "userProject",
  userProjectSchema,
);
