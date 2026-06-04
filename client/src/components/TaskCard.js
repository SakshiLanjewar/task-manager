import React, { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import { PRIORITY_CONFIG } from "../utils/constants";
import { useTaskContext } from "../context/TaskContext";

/**
 * TaskCard — the atom of the Kanban board.
 * Displays task metadata with priority-coded colors,
 * and surfaces edit/delete controls on hover.
 */
function TaskCard({ task, onEdit, dragHandleProps, isDragging }) {
  const { removeTask } = useTaskContext();
  const [confirming, setConfirming] = useState(false);

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const dueDateDisplay = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    const overdue = isPast(date) && task.status !== "done";
    const due = isToday(date);
    return {
      text: format(date, "MMM d, yyyy"),
      overdue,
      dueToday: due,
    };
  };

  const dueInfo = dueDateDisplay();

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 2500);
      return;
    }
    await removeTask(task._id);
  };

  return (
    <div
      className={`task-card ${isDragging ? "dragging" : ""}`}
      style={{ borderLeft: `4px solid ${priority.color}` }}
    >
      {/* Drag handle */}
      <div className="drag-handle" {...dragHandleProps} title="Drag to move">
        <span>⠿</span>
      </div>

      {/* Header row */}
      <div className="task-card-header">
        <span
          className="priority-badge"
          style={{ color: priority.color, background: priority.bg }}
        >
          {priority.dot} {priority.label}
        </span>
        <div className="task-actions">
          <button
            className="icon-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            className={`icon-btn delete-btn ${confirming ? "confirming" : ""}`}
            onClick={handleDelete}
            title={confirming ? "Click again to confirm" : "Delete task"}
            aria-label="Delete task"
          >
            {confirming ? "⚠️" : "🗑️"}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`task-title ${task.status === "done" ? "done-title" : ""}`}>
        {task.title}
      </h3>

      {/* Description (truncated) */}
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {/* Footer: due date */}
      {dueInfo && (
        <div
          className={`due-date ${dueInfo.overdue ? "overdue" : dueInfo.dueToday ? "due-today" : ""}`}
        >
          📅 {dueInfo.overdue ? "Overdue: " : dueInfo.dueToday ? "Due today: " : ""}
          {dueInfo.text}
        </div>
      )}
    </div>
  );
}

export default TaskCard;
