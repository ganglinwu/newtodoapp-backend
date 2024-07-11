import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userProjectSchema = new Schema(
  {
    userName: { type: String, required: true },
    timeUpdated: { type: Date, default: Date.now },
    projects: [
      {
        projectName: { type: String, required: true },
        tasks: [
          {
            taskName: { type: String, required: true },
            taskDueDate: Date,
            taskUrgency: String,
            taskDuration: Number,
          },
        ],
      },
    ],
  },
  { collection: "userprojects" },
);
export const userProjectModel = mongoose.model(
  "userProject",
  userProjectSchema,
);
