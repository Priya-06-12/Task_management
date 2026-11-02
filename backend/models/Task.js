const mongoose = require("mongoose");

const STATUSES = ["Pending", "In Progress", "Completed"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot be longer than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be longer than 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: "Status must be Pending, In Progress or Completed",
      },
      default: "Pending",
    },
  },
  // timestamps adds createdAt and updatedAt automatically
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
module.exports.STATUSES = STATUSES;
