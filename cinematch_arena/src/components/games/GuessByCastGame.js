import React, { useState } from "react";
import { fetchMovieCredits } from "../../tmdbApi";

/**
 * Guess the Movie by Cast: 
 * Presents a cast list from a random movie, user chooses which movie it was from among several.
 * @param {array} movies: Array of TMDB movie objects (industry filtered)
 * @param {string} column - Hollywood/Kollywood
 * @param {function} onComplete
 */
// PUBLIC_INTERFACE
function GuessByCastGame({ movies, column, onComplete }) {
  // Pick a target movie and 3 others
  const [setup, setSetup] = useState(() => {
    let used = new Set(), arr = [];
    while (arr.length < 4 && used.size < movies.length) {
      const idx = Math.floor(Math.random()*movies.length);
      if (!used.has(idx)) {
        arr.push(movies[idx]);
        used.add(idx);
      }
    }
    arr.sort(() => Math.random() - 0.5);
    return { answers: arr, correct: arr[0] };
  });
  const [cast, setCast] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetchMovieCredits(setup.correct.id)
      .then(res => {
        setCast(Array.isArray(res.cast) ? res.cast.slice(0, 5) : []);
        setLoading(false);
      })
      .catch(() => { setCast([]); setLoading(false); });
    // eslint-disable-next-line
  }, []);

  function pick(movie) {
    setPicked(movie.id);
    setTimeout(()=>setRevealed(true), 600);
    setTimeout(()=>onComplete(movie.id === setup.correct.id ? "Correct" : "Incorrect"), 1200);
  }

  return (
    <div style={{padding:10}}>
      <h3>Guess the Movie by Cast ({column})</h3>
      <div>
        <div>
          <b>Which of these movies starred:</b>
          <div style={{margin:"7px 0", color:"#fed", fontWeight:500}}>
            {loading ? <span>Loading cast...</span> : cast.map(c=>(<span key={c.id||c.name} style={{marginRight:10}}>{c.name}</span>))}
          </div>
          <div style={{marginTop:12}}>
            {setup.answers.map((movie,idx)=>(
              <button
                key={movie.id||idx}
                className="btn"
                style={{
                  margin:"5px 8px",
                  background: picked===movie.id
                    ? (movie.id===setup.correct.id ? "#16ad3e" : "#c03a49")
                    : "#4bbcff"
                }}
                disabled={!!picked}
                onClick={()=>pick(movie)}
              >
                {movie.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      {revealed && (
        <div style={{margin:"15px 0", color:"#fff", fontWeight:600}}>
          {(picked === setup.correct.id) ? "Correct!" : "Wrong! Correct: "+setup.correct.title}
        </div>
      )}
    </div>
  );
}

export default GuessByCastGame;
