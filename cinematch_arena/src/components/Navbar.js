import React, { useState } from "react";
import "./Navbar.css";
import ScorePopover from "./ScorePopover";

// PUBLIC_INTERFACE
/**
 * CineMatch Arena Navbar
 * Shows logo, share button, score history, and user info.
 */
function Navbar({ user, onLogout, scoreHistory }) {
  const [showScores, setShowScores] = useState(false);

  // Demo sharing: copy link (could use Web Share API if supported)
  const handleShare = () => {
    try {
      const shareText = "Check out my CineMatch Arena movie game scores!";
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({ title: "CineMatch Arena", text: shareText, url });
      } else {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (e) {
      alert("Sharing not supported in your browser.");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left logo">
        <span className="logo-symbol">🎬</span> CineMatch Arena
      </div>
      <div className="nav-actions">
        {user && (
          <>
            <button className="btn nav-btn" onClick={handleShare}>
              Share
            </button>
            <button
              className="btn nav-btn"
              onClick={() => setShowScores((s) => !s)}
            >
              Score History
            </button>
            <ScorePopover open={showScores} onClose={() => setShowScores(false)} scoreHistory={scoreHistory} />
          </>
        )}
        {/* User profile / login/logout controls */}
        <div className="userbox">
          {user ? (
            <>
              <span className="user-welcome">
                👤 {user.username}
                <button className="btn nav-btn logout-btn" onClick={onLogout}>
                  Log out
                </button>
              </span>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
