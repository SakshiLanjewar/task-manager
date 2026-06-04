import React, { useState, useEffect, useRef } from "react";
import { useTaskContext } from "../context/TaskContext";

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
};

/**
 * TaskForm — a modal dialog for creating or editing tasks.
 * Uses uncontrolled-to-controlled form state, pre-filled when editing.
 */
function TaskForm({ taskToEdit, onClose }) {
  const { addTask, editTask, loading } = useTaskContext();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  const isEditing = Boolean(taskToEdit);

  // Pre-fill the form when editing an existing task
  useEffect(() => {
    if (taskToEdit) {
      setForm({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "medium",
        status: taskToEdit.status || "todo",
        dueDate: taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
    // Autofocus the title input — a small but delightful UX touch
    setTimeout(() => titleRef.current?.focus(), 100);
  }, [taskToEdit]);

  // Close modal on Escape key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.title.length > 100) errs.title = "Max 100 characters";
    if (form.description.length > 500) errs.description = "Max 500 characters";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      ...form,
      dueDate: form.dueDate || null,
    };

    const result = isEditing
      ? await editTask(taskToEdit._id, payload)
      : await addTask(payload);

    if (result?.success !== false) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Task form">
        <div className="modal-header">
          <h2>{isEditing ? "✏️ Edit Task" : "✨ New Task"}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="task-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              ref={titleRef}
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={errors.title ? "input-error" : ""}
              maxLength={100}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add some details…"
              rows={3}
              maxLength={500}
            />
            <span className="char-count">{form.description.length}/500</span>
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          {/* Priority + Status row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="todo">📋 To Do</option>
                <option value="inprogress">⚡ In Progress</option>
                <option value="done">✅ Done</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving…" : isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
