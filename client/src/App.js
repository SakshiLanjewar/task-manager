import React from "react";
import { TaskProvider } from "./context/TaskContext";
import Board from "./components/Board";
import "./styles/App.css";

/**
 * App — root component.
 * Wraps the entire dashboard in the TaskProvider so
 * all child components can access global task state.
 */
function App() {
  return (
    <TaskProvider>
      <Board />
    </TaskProvider>
  );
}

export default App;
