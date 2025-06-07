import React, { useState } from "react";
import "./Login.css";

// PUBLIC_INTERFACE
/** Mocked login component – for demo only */
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      onLogin(username.trim());
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="login-center">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Welcome to CineMatch Arena</h2>
        <label htmlFor="username">Enter your username:</label>
        <input
          id="username"
          className="login-input"
          autoFocus
          disabled={submitting}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={32}
          placeholder="e.g. MovieBuff99"
        />
        <button className="btn btn-large login-btn" type="submit" disabled={submitting || !username.trim()}>
          {submitting ? "Logging in..." : "Log in"}
        </button>
        <div className="login-note">
          <span>
            <b>Demo:</b> No password required. No sign up—just type a nickname!
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
