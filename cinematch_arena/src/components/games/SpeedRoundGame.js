import React, { useState } from "react";

/**
 * Speed Round: 10 Movies in 60 Seconds – Demo plug-in
 * Shows a "quick-fire" list of random movies, asks user to answer if they know each.
 * In real version, would have a timer and score for correct.
 * @param {object} props
 *   @param {array} movies - TMDB movies (industry filtered)
 *   @param {string} column - Hollywood/Kollywood
 *   @param {function} onComplete
 */
// PUBLIC_INTERFACE
function SpeedRoundGame({ movies, column, onComplete }) {
  // Shuffle and present exactly 10 movies
  const [questions] = useState(() => {
    let used = new Set(), arr = [];
    while (arr.length < 10 && used.size < movies.length) {
      const idx = Math.floor(Math.random()*movies.length);
      if (!used.has(idx)) {
        arr.push(movies[idx]);
        used.add(idx);
      }
    }
    // Pad with nulls for demo if not enough
    while (arr.length < 10) arr.push({ title: "---", release_date: "" });
    return arr;
  });
  const [curr, setCurr] = useState(0);
  const [answered, setAnswered] = useState(Array(10).fill(false));
  const [done, setDone] = useState(false);

  function next(q) {
    setAnswered(a => {
      let b = [...a]; b[q]=true; return b;
    });
    if (q+1 >= questions.length) setDone(true);
    else setCurr(q+1);
  }

  return (
    <div style={{padding:10}}>
      <h3>Speed Round! ({column})</h3>
      <p style={{color:"#aef"}}>10 real movies, answer whether you can identify them fast!</p>
      {!done ? (
        <div style={{marginTop:10}}>
          <div style={{fontSize:"1.09em"}}>
            #{curr+1}: <b>{questions[curr].title}</b> <span style={{color:"#88f"}}>({questions[curr].release_date?questions[curr].release_date.slice(0,4):""})</span>
          </div>
          <button className="btn" onClick={()=>next(curr)} style={{margin:"12px 5px"}}>Next</button>
        </div>
      ) : (
        <div>
          <div style={{margin:10,color:"#5fc857"}}>Speed round done!</div>
          <button className="btn btn-large" onClick={()=>onComplete("Done!")}>Save Score</button>
        </div>
      )}
    </div>
  );
}

export default SpeedRoundGame;
