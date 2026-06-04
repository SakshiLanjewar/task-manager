const mongoose = require("mongoose");

/**
 * Task Schema — the core data model for our dashboard.
 * Each task belongs to one of three Kanban columns (status)
 * and carries priority, ordering, and optional due date metadata.
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "medium",
    },
    status: {
      type: String,
      enum: {
        values: ["todo", "inprogress", "done"],
        message: "Status must be todo, inprogress, or done",
      },
      default: "todo",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    // `order` tracks the card's vertical position within a column
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Index for efficient column queries sorted by order
taskSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model("Task", taskSchema);
