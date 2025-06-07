import React, { useState } from "react";

/**
 * Movie Buff Certification - Demo (Quiz on movie facts)
 * @param {object} props
 *   @param {array} movies - TMDB movies list
 *   @param {string} column - Hollywood/Kollywood
 *   @param {function} onComplete
 */
// PUBLIC_INTERFACE
function BuffCertificationGame({ movies, column, onComplete }) {
  // For demo: 3 quiz questions - release years for 3 movies
  const questions = React.useMemo(() => {
    let used = new Set(), arr = [];
    while (arr.length < 3 && used.size < movies.length) {
      const idx = Math.floor(Math.random()*movies.length);
      if (!used.has(idx)) {
        arr.push(movies[idx]);
        used.add(idx);
      }
    }
    return arr;
  }, [movies]);

  const [answers, setAnswers] = useState(Array(3).fill(""));
  const [showResult, setShowResult] = useState(false);

  function handleSubmit() {
    setShowResult(true);
    setTimeout(()=>onComplete("Quiz done!"), 900);
  }

  return (
    <div style={{padding:8}}>
      <h3>Movie Buff Certification ({column})</h3>
      <ol>
        {questions.map((m, idx)=>(
          <li key={idx}>
            Release year for <b><u>{m.title}</u></b>?<br/>
            <input
              type="number"
              value={answers[idx]}
              onChange={e=>{
                const val=e.target.value;
                setAnswers(prev=>prev.map((a,i)=>(i===idx?val:a)));
              }}
              disabled={showResult}
              style={{margin: "5px 0 10px 0", padding:5, fontSize:"1em"}}
              placeholder="YYYY"
            />
            {showResult && (
              <span style={{marginLeft:9, color: answers[idx] === (m.release_date?m.release_date.slice(0,4):"?") ? "#27b227" : "#e12e2e"}}>
                Correct: {m.release_date ? m.release_date.slice(0,4) : "?"}
              </span>
            )}
          </li>
        ))}
      </ol>
      <button
        className="btn btn-large"
        onClick={handleSubmit}
        disabled={showResult}
      >
        {showResult ? "Done" : "Check Answers"}
      </button>
    </div>
  );
}

export default BuffCertificationGame;

