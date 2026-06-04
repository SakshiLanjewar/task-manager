import React, { useState } from "react";
import { TaskProvider } from "./context/TaskContext";
import Board from "./components/Board";
import Login from "./components/Login";
import "./styles/App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <TaskProvider>
      <Board onLogout={() => setIsLoggedIn(false)} />
    </TaskProvider>
  );
}

export default App;