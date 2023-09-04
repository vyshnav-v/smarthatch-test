
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      min: 2,
      max: 50,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: [
      {
        assignee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
       
      },
    ],
    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    taskName: String,
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
