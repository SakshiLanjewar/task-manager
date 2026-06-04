import React, { useEffect, useState, useCallback } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import TaskForm from "./TaskForm";
import { useTaskContext } from "../context/TaskContext";
import { COLUMN_ORDER } from "../utils/constants";

/**
 * Board — the central orchestrator of the dashboard.
 * Manages column task slicing, drag-and-drop coordination,
 * and surfaces the TaskForm modal for add/edit operations.
 */
function Board() {
  const { tasks, loading, error, fetchTasks, handleReorder, clearError } = useTaskContext();
  const [showForm, setShowForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filter, setFilter] = useState({ priority: "" });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Split flat task list into column buckets
  const getColumnTasks = useCallback(
    (statusId) => {
      return tasks
        .filter((t) => t.status === statusId)
        .filter((t) => (filter.priority ? t.priority === filter.priority : true))
        .sort((a, b) => a.order - b.order);
    },
    [tasks, filter]
  );

  /**
   * onDragEnd — fires when the user releases a dragged card.
   * We compute the new task order and status, then dispatch
   * an optimistic update followed by an API sync.
   */
  const onDragEnd = useCallback(
    (result) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index)
        return;

      const sourceColTasks = [...getColumnTasks(source.droppableId)];
      const destColTasks =
        source.droppableId === destination.droppableId
          ? sourceColTasks
          : [...getColumnTasks(destination.droppableId)];

      // Remove from source
      const [moved] = sourceColTasks.splice(source.index, 1);

      // Insert into destination
      if (source.droppableId === destination.droppableId) {
        sourceColTasks.splice(destination.index, 0, moved);
      } else {
        destColTasks.splice(destination.index, 0, moved);
      }

      // Build the full new tasks array (other columns untouched)
      const otherTasks = tasks.filter(
        (t) =>
          t.status !== source.droppableId &&
          t.status !== destination.droppableId
      );

      const updatedSource = sourceColTasks.map((t, i) => ({
        ...t,
        status: source.droppableId,
        order: i,
      }));

      const updatedDest =
        source.droppableId === destination.droppableId
          ? []
          : destColTasks.map((t, i) => ({
              ...t,
              status: destination.droppableId,
              order: i,
            }));

      const newTasksArray = [...otherTasks, ...updatedSource, ...updatedDest];

      // API payload: only the cards whose position/status changed
      const apiUpdates = [...updatedSource, ...updatedDest]
        .filter((t) => {
          const original = tasks.find((orig) => orig._id === t._id);
          return !original || original.status !== t.status || original.order !== t.order;
        })
        .map(({ _id, status, order }) => ({ id: _id, status, order }));

      handleReorder(newTasksArray, apiUpdates);
    },
    [tasks, getColumnTasks, handleReorder]
  );

  const openAddForm = () => {
    setTaskToEdit(null);
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setTaskToEdit(task);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setTaskToEdit(null);
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="board-wrapper">
      {/* ── Top bar ── */}
      <header className="board-header">
        <div className="header-left">
          <h1 className="board-title">
            <span className="title-icon">🚀</span> TaskFlow
          </h1>
          <p className="board-subtitle">Drag, drop, and conquer your day.</p>
        </div>

        <div className="header-right">
          {/* Progress indicator */}
          <div className="progress-wrap">
            <span className="progress-label">{progress}% complete</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Priority filter */}
          <select
            className="filter-select"
            value={filter.priority}
            onChange={(e) => setFilter({ priority: e.target.value })}
            aria-label="Filter by priority"
          >
            <option value="">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <button className="add-task-btn" onClick={openAddForm} aria-label="Add new task">
            + New Task
          </button>
        </div>
      </header>

      {/* ── Error banner ── */}
      {error && (
        <div className="error-banner" role="alert">
          ⚠️ {error}
          <button onClick={clearError} className="dismiss-btn" aria-label="Dismiss error">✕</button>
        </div>
      )}

      {/* ── Loading overlay ── */}
      {loading && tasks.length === 0 && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading your tasks…</p>
        </div>
      )}

      {/* ── Kanban board ── */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {COLUMN_ORDER.map((statusId) => (
            <KanbanColumn
              key={statusId}
              statusId={statusId}
              tasks={getColumnTasks(statusId)}
              onEdit={openEditForm}
            />
          ))}
        </div>
      </DragDropContext>

      {/* ── Task Form Modal ── */}
      {showForm && (
        <TaskForm taskToEdit={taskToEdit} onClose={closeForm} />
      )}
    </div>
  );
}

export default Board;
