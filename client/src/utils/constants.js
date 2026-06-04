/**
 * Shared configuration for priority levels and Kanban columns.
 * Centralizing these prevents magic strings scattered across components.
 */

export const PRIORITY_CONFIG = {
  high: {
    label: "High",
    color: "#FF4757",
    bg: "rgba(255,71,87,0.12)",
    border: "#FF4757",
    dot: "🔴",
  },
  medium: {
    label: "Medium",
    color: "#FFA502",
    bg: "rgba(255,165,2,0.12)",
    border: "#FFA502",
    dot: "🟡",
  },
  low: {
    label: "Low",
    color: "#2ED573",
    bg: "rgba(46,213,115,0.12)",
    border: "#2ED573",
    dot: "🟢",
  },
};

export const STATUS_CONFIG = {
  todo: {
    id: "todo",
    label: "To Do",
    emoji: "📋",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    accent: "#667eea",
    lightBg: "rgba(102,126,234,0.08)",
  },
  inprogress: {
    id: "inprogress",
    label: "In Progress",
    emoji: "⚡",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    accent: "#f5576c",
    lightBg: "rgba(245,87,108,0.08)",
  },
  done: {
    id: "done",
    label: "Done",
    emoji: "✅",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    accent: "#00f2fe",
    lightBg: "rgba(79,172,254,0.08)",
  },
};

export const COLUMN_ORDER = ["todo", "inprogress", "done"];
