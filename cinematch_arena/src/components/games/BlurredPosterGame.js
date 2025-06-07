import React, { useState } from "react";

/**
 * Blurred Poster Guessing Game
 * Shows a movie poster with a strong blur and a couple of text clues.
 * User types their guess, can click reveal to see the answer.
 * @param {object} props
 *   @param {array} movies - TMDB movies (industry filtered)
 *   @param {string} column - Hollywood/Kollywood
 *   @param {function} onComplete
 */
// PUBLIC_INTERFACE
function BlurredPosterGame({ movies, column, onComplete }) {
  const [chosen] = useState(() => {
    if (!movies.length) return {};
    return movies[Math.floor(Math.random() * movies.length)];
  });
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);

  return (
    <div style={{padding:10}}>
      <h3>Blurred Poster Guessing – {column}</h3>
      {chosen?.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w300${chosen.poster_path}`}
          alt="Blurred poster"
          style={{
            width: 140, height: 196, objectFit: "cover",
            filter: revealed ? "none" : "blur(11px)", marginBottom: 12,
            borderRadius: 7, border: "2px solid #23afe6"
          }}
        />
      ) : <div style={{minHeight:180}}>No poster available</div>}
      <div>
        <span style={{fontSize:"1.02rem", color:"#aef"}}>
          Clue 1: Year – {chosen?.release_date ? chosen.release_date.split("-")[0]: "?"}
        </span><br/>
        <span style={{fontSize:"1.01rem", color:"#fea"}}>
          Clue 2: First letter – {chosen?.title ? chosen.title.charAt(0) : ""}
        </span>
      </div>
      <input
        style={{
          fontSize: "1rem",
          padding: 6,
          margin: "10px 0",
          borderRadius: 4,
          border: "1px solid #90e2ff",
          width: "80%"
        }}
        placeholder="Type your guess"
        value={guess}
        disabled={revealed}
        onChange={e=>setGuess(e.target.value)}
      />
      <div>
        <button className="btn btn-large" style={{marginRight:8}}
          onClick={() => setRevealed(true)}
          disabled={revealed}
        >Reveal</button>
        <button className="btn btn-large"
          onClick={()=>onComplete("Done!")}
        >Done</button>
      </div>
      {revealed && (
        <div style={{marginTop:11, color:"#2ef46b", fontWeight:600}}>
          Answer: {chosen?.title || ""}
        </div>
      )}
    </div>
  );
}

export default BlurredPosterGame;
