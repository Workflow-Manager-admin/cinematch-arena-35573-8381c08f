import React from "react";
import "./GameCard.css";

/**
 * Individual Game Card for each movie game.
 * 
 * Optionally receives a 'movies' prop (list of TMDB movie objects for the correct industry), 
 * but presentation remains stateless for now; all gameplay logic is handled in the dashboard modal.
 * This makes the data flow and dependencies explicit, and prepares for possible future migration of per-card play logic.
 *
 * Props:
 *   - game: object { title, desc, key }
 *   - column: "Hollywood" | "Kollywood"
 *   - movies?: TMDB Movie array [for this domain]
 *   - onPlay: function, triggered when Play is clicked
 */
// PUBLIC_INTERFACE
function GameCard({ game, column, onPlay, movies }) {
  return (
    <div className="game-card">
      <div className="game-card-header">
        <span className="game-card-title">{game.title}</span>
      </div>
      <div className="game-card-desc">{game.desc}</div>
      {/* Future: could show a preview (e.g., number of loaded movies) */}
      <button className="btn btn-large play-btn" onClick={onPlay}>
        Play {column}
      </button>
    </div>
  );
}

export default GameCard;
