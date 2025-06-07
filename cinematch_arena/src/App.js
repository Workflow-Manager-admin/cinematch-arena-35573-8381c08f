import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import GameDashboard from "./components/GameDashboard";

// PUBLIC_INTERFACE
function App() {
  // User state - mocked login for demo: user is null if not logged in
  const [user, setUser] = useState(null);

  // Score history: array of { game, score, column, timestamp }
  const [scoreHistory, setScoreHistory] = useState([]);

  // Handles user login - in real app, this would be replaced with backend
  const handleLogin = (username) => {
    setUser({
      username,
      avatar: null, // Could randomize for demo
    });
  };

  // Log out
  const handleLogout = () => {
    setUser(null);
  };

  // Save a new score record
  const handleScoreSave = (game, score, column) => {
    setScoreHistory((prev) => [
      ...prev,
      {
        game,
        score,
        column,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="app">
      <Navbar
        user={user}
        onLogout={handleLogout}
        scoreHistory={scoreHistory}
      />
      <div style={{ paddingTop: 70, minHeight: "80vh" }}>
        <main className="main-content">
          {!user ? (
            <Login onLogin={handleLogin} />
          ) : (
            <GameDashboard
              user={user}
              onScore={handleScoreSave}
              scoreHistory={scoreHistory}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
