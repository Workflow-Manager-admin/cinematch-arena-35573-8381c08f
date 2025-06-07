import React from "react";
import "./GameCard.css";

// PUBLIC_INTERFACE
/**
 * Individual game card for each movie game.
 */
function GameCard({ game, column, onPlay }) {
  return (
    <div className="game-card">
      <div className="game-card-header">
        <span className="game-card-title">{game.title}</span>
      </div>
      <div className="game-card-desc">{game.desc}</div>
      <button className="btn btn-large play-btn" onClick={onPlay}>
        Play {column}
      </button>
    </div>
  );
}

export default GameCard;
