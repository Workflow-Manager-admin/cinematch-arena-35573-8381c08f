import React, { useState } from "react";

/**
 * Movie Bingo Game - Demo plug-in for CineMatch Arena
 * @param {object} props
 *   @param {array} movies - Array of real TMDB movies (already filtered for the industry/column)
 *   @param {string} column - Hollywood or Kollywood
 *   @param {function} onComplete - Called when bingo is completed manually
 */
 // PUBLIC_INTERFACE
function MovieBingoGame({ movies, column, onComplete }) {
  // 5x5 grid with unique movies
  const [selected, setSelected] = useState(Array(25).fill(false));
  const [completed, setCompleted] = useState(false);

  // Pick the movies deterministically (for the session/launch) so re-renders do not change grid
  const bingoList = React.useMemo(() => {
    let res = [];
    const used = new Set();
    while (res.length < 25 && used.size < movies.length) {
      const i = Math.floor((Math.sin(res.length * 17 + movies.length * 13) * 10000) % movies.length);
      const idx = Math.abs(i % movies.length);
      if (!used.has(idx)) {
        res.push(movies[idx]);
        used.add(idx);
      }
    }
    // Fallback for insufficient movies
    while (res.length < 25) {
      res.push({ title: "???" });
    }
    return res;
  }, [movies]);

  // Simple row/col/diag check for bingo, but in demo we just allow click through
  function toggleCell(idx) {
    if (completed) return;
    const newSel = [...selected];
    newSel[idx] = !newSel[idx];
    setSelected(newSel);

    // Dummy win trigger: five in a row (any row/col/diag)
    for (let r = 0; r < 5; r++) {
      // Row
      if (newSel.slice(r * 5, r * 5 + 5).every(Boolean)) {
        setCompleted(true); onComplete("Bingo! Congrats!");
        return;
      }
      // Col
      if ([0,1,2,3,4].every(i => newSel[r + 5*i])) {
        setCompleted(true); onComplete("Bingo! Congrats!");
        return;
      }
    }
    // Diagonals
    if ([0,6,12,18,24].every(i => newSel[i]) || [4,8,12,16,20].every(i => newSel[i])) {
      setCompleted(true); onComplete("Bingo! Congrats!");
      return;
    }
  }

  return (
    <div style={{ padding: 10 }}>
      <h3>
        {column} Movie Bingo
        <span style={{ fontSize: 14, color: "#7df" }}> (Real TMDB movies)</span>
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 5,
          margin: "12px 0",
        }}
      >
        {bingoList.map((movie, idx) => (
          <div
            key={idx}
            onClick={() => toggleCell(idx)}
            style={{
              background: selected[idx] ? "#1bab18" : "#081136",
              borderRadius: 4,
              padding: "7px 4px",
              fontSize: ".92rem",
              minHeight: 36,
              color: "#25e2ff",
              cursor: completed ? "not-allowed" : "pointer",
              border: completed && selected[idx] ? "2px solid gold" : "1px solid #444",
              opacity: completed && !selected[idx] ? 0.6 : 1,
              transition: "background .12s"
            }}
          >
            {movie.title}
          </div>
        ))}
      </div>
      <button
        className="btn btn-large"
        style={{ marginTop: 12 }}
        onClick={() => { setCompleted(true); onComplete("Game completed (manual)!"); }}
        disabled={completed}
      >
        {completed ? "Bingo!" : "Done"}
      </button>
    </div>
  );
}

export default MovieBingoGame;
