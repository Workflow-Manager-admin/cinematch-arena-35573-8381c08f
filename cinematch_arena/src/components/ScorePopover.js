import React from "react";
import "./ScorePopover.css";

// PUBLIC_INTERFACE
/**
 * A simple popover/modal to display score history.
 */
function ScorePopover({ open, onClose, scoreHistory }) {
  if (!open) return null;
  return (
    <div className="score-popover-backdrop" onClick={onClose}>
      <div
        className="score-popover"
        onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
      >
        <div className="score-popover-header">
          <span>Score History</span>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        {scoreHistory.length === 0 ? (
          <div className="score-empty">No scores yet – play a game!</div>
        ) : (
          <table className="score-table">
            <thead>
              <tr>
                <th>Game</th>
                <th>Column</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[...scoreHistory]
                .reverse()
                .slice(0, 10)
                .map((rec, idx) => (
                  <tr key={idx}>
                    <td>{rec.game}</td>
                    <td>{rec.column}</td>
                    <td>{rec.score}</td>
                    <td>
                      {new Date(rec.timestamp).toLocaleDateString()}<br />
                      <span style={{ fontSize: 12 }}>
                        {new Date(rec.timestamp).toLocaleTimeString()}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ScorePopover;
