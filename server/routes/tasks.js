const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { taskValidationRules, validate } = require("../middleware/validation");

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
// Fetch all tasks, grouped and sorted by status → order.
router.get("/", async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ status: 1, order: 1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    console.error("GET /tasks error:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching tasks" });
  }
});

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
// Create a new task. Appends it at the bottom of the target column.
router.post("/", taskValidationRules, validate, async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    // Determine the next order value in the chosen column
    const maxOrderDoc = await Task.findOne({ status: status || "todo" })
      .sort({ order: -1 })
      .select("order");
    const order = maxOrderDoc ? maxOrderDoc.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
      order,
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    console.error("POST /tasks error:", err.message);
    res.status(500).json({ success: false, message: "Server error creating task" });
  }
});

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error fetching task" });
  }
});

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
// Full or partial update of a task's fields.
router.put("/:id", taskValidationRules, validate, async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, order } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, status, dueDate, order },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) {
    console.error("PUT /tasks/:id error:", err.message);
    res.status(500).json({ success: false, message: "Server error updating task" });
  }
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error deleting task" });
  }
});

// ─── PATCH /api/tasks/reorder ─────────────────────────────────────────────────
// Bulk-update order + status after a drag-and-drop operation.
// Body: { updates: [{ id, status, order }, ...] }
router.patch("/reorder", async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ success: false, message: "updates array is required" });
    }

    // Execute all updates concurrently for efficiency (alacrity: quick eagerness)
    const ops = updates.map(({ id, status, order }) =>
      Task.findByIdAndUpdate(id, { status, order }, { new: true })
    );
    const results = await Promise.all(ops);

    res.json({ success: true, data: results });
  } catch (err) {
    console.error("PATCH /tasks/reorder error:", err.message);
    res.status(500).json({ success: false, message: "Server error reordering tasks" });
  }
});

module.exports = router;
