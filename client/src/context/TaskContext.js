import React, { createContext, useContext, useReducer, useCallback } from "react";
import { getTasks, createTask, updateTask, deleteTask, reorderTasks } from "../utils/api";

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  tasks: [],        // flat list of all tasks
  loading: false,
  error: null,
};

// ─── Action Types ─────────────────────────────────────────────────────────────
const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  LOAD_TASKS: "LOAD_TASKS",
  ADD_TASK: "ADD_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  SET_TASKS: "SET_TASKS",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function taskReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case ACTIONS.SET_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ACTIONS.LOAD_TASKS:
      return { ...state, loading: false, tasks: action.payload, error: null };

    case ACTIONS.ADD_TASK:
      return { ...state, loading: false, tasks: [...state.tasks, action.payload] };

    case ACTIONS.UPDATE_TASK:
      return {
        ...state,
        loading: false,
        tasks: state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
      };

    case ACTIONS.DELETE_TASK:
      return {
        ...state,
        loading: false,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      };

    case ACTIONS.SET_TASKS:
      // Used for optimistic drag-and-drop updates
      return { ...state, tasks: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  /** Load all tasks from the API */
  const fetchTasks = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await getTasks();
      dispatch({ type: ACTIONS.LOAD_TASKS, payload: res.data.data });
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
    }
  }, []);

  /** Add a new task */
  const addTask = useCallback(async (taskData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await createTask(taskData);
      dispatch({ type: ACTIONS.ADD_TASK, payload: res.data.data });
      return { success: true };
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      return { success: false, error: err.message };
    }
  }, []);

  /** Edit an existing task */
  const editTask = useCallback(async (id, taskData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await updateTask(id, taskData);
      dispatch({ type: ACTIONS.UPDATE_TASK, payload: res.data.data });
      return { success: true };
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      return { success: false, error: err.message };
    }
  }, []);

  /** Remove a task */
  const removeTask = useCallback(async (id) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await deleteTask(id);
      dispatch({ type: ACTIONS.DELETE_TASK, payload: id });
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
    }
  }, []);

  /**
   * Handle drag-and-drop reordering.
   * We do an *optimistic update* — update the UI immediately,
   * then sync with the backend asynchronously.
   * (Optimistic: assuming success before confirmation — snappy UX)
   */
  const handleReorder = useCallback(
    async (newTasksArray, updates) => {
      dispatch({ type: ACTIONS.SET_TASKS, payload: newTasksArray });
      try {
        await reorderTasks(updates);
      } catch (err) {
        // Roll back if API call fails
        dispatch({ type: ACTIONS.SET_ERROR, payload: "Reorder failed. Refreshing…" });
        fetchTasks();
      }
    },
    [fetchTasks]
  );

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        addTask,
        editTask,
        removeTask,
        handleReorder,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

/** Custom hook for consuming task context */
export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used within a TaskProvider");
  return ctx;
};
