import React, { useState } from "react";
import "./GameDashboard.css";
import GameCard from "./GameCard";
import {
  fetchPopularHollywoodMovies,
  fetchPopularKollywoodMovies,
  fetchMovieDetails
} from "../tmdbApi";

// Game configuration for both columns
const GAMES = [
  {
    key: "movie_bingo",
    title: "Movie Bingo",
    desc: "Find movies that match categories – get five in a row to win!",
    demo: false,
  },
  {
    key: "six_degrees",
    title: "Six Degrees of Kevin Bacon",
    desc: "Connect any two actors through movies. Test your Hollywood logic.",
    demo: false,
  },
  {
    key: "speed_round",
    title: "Speed Round: 10 Movies in 60 Seconds",
    desc: "How many can you answer? Posters, actors, or quotes come fast!",
    demo: false,
  },
  {
    key: "buff_certification",
    title: "Movie Buff Certification",
    desc: "Take a quiz from Beginner to Ultimate. Timed rounds, track your best!",
    demo: false,
  },
  {
    key: "guess_movie_cast",
    title: "Guess the Movie by Cast",
    desc: "Identify the movie from the cast. Multiple choices, trick questions await!",
    demo: false,
  },
  {
    key: "blurred_poster",
    title: "Blurred Poster Guessing Game",
    desc: "Can you recognize movies from a fuzzy poster and two clues?",
    demo: false,
  },
];

// Helper to pick N random items (unique) from a list
function pickRandomN(arr, n) {
  let res = [];
  const used = new Set();
  while (res.length < n && used.size < arr.length) {
    let idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx)) {
      used.add(idx);
      res.push(arr[idx]);
    }
  }
  return res;
}

// PUBLIC_INTERFACE
/**
 * Main dashboard: single-row-per-game, each row contains Hollywood (left) and Kollywood (right) of the same game.
 * Modern, responsive horizontal alignment.
 */
function GameDashboard({ user, onScore, scoreHistory }) {
  // Store fetched movie lists by industry
  const [movieData, setMovieData] = useState({
    hollywood: [],
    kollywood: [],
    loaded: false,
    loading: false,
    error: null
  });

  // Modal state for showing a quick inline playable game per card
  const [modal, setModal] = useState({
    open: false,
    column: null,
    gameKey: null,
    movies: [],
    loading: false,
    error: null
  });

  // Preload movies when component mounts (or on refresh)
  React.useEffect(() => {
    if (movieData.loaded || movieData.loading) return;

    setMovieData(m => ({ ...m, loading: true }));
    Promise.all([
      fetchPopularHollywoodMovies(1),
      fetchPopularKollywoodMovies(1)
    ])
      .then(([holly, kolly]) => {
        setMovieData({
          hollywood: holly && holly.results ? holly.results : [],
          kollywood: kolly && kolly.results ? kolly.results : [],
          loaded: true,
          loading: false,
          error: null
        });
      })
      .catch((err) => {
        setMovieData(old => ({
          ...old,
          loaded: false,
          loading: false,
          error: err?.message || "Failed to fetch movies"
        }));
      });
  // eslint-disable-next-line
  }, []);

  // Plays the actual game with movie data (modal popover)
  const onPlay = (gameKey, column) => {
    // Determine movies per industry (Hollywood/Kollywood)
    const industry = column === "Hollywood" ? "hollywood" : "kollywood";
    const moviesArr = movieData[industry] || [];
    setModal({
      open: true,
      column,
      gameKey,
      loading: false,
      movies: moviesArr,
      error: null,
    });
  };

  // Mock game result generator for now; in prod, would use game logic
  const handleScore = (gameKey, column) => {
    // Use movies actually shown for scoring logic in future
    let demoScores = {
      movie_bingo: Math.floor(Math.random() * 100) + 40,
      six_degrees: Math.floor(Math.random() * 70) + 10,
      speed_round: Math.floor(Math.random() * 21),
      buff_certification: Math.floor(Math.random() * 100),
      guess_movie_cast: Math.floor(Math.random() * 8) + 2,
      blurred_poster: Math.floor(Math.random() * 2) ? "Correct!" : "Incorrect",
    };
    onScore(GAMES.find(game => game.key === gameKey).title, demoScores[gameKey], column);
    setModal({ ...modal, open: false });
    alert("Score saved! (Stub - In full version, your gameplay would determine score)");
  };

  // Modal game implementation (interactive stub, uses real movie data)
  function renderGameModal() {
    if (!modal.open) return null;
    const { column, gameKey, movies } = modal;
    const industry = column === "Hollywood" ? "hollywood" : "kollywood";
    let content = null;

    if (movieData.loading) {
      content = <div style={{ textAlign: "center", padding: 25 }}>Loading movies from TMDB…</div>;
    } else if (movieData.error) {
      content = <div style={{ color: "#c00", padding: 22 }}>Failed to load movies: {movieData.error}</div>;
    } else if (!movies || movies.length === 0) {
      content = <div style={{ textAlign: "center", padding: 22 }}>No movies loaded for {column}</div>;
    } else {
      // Simple data-driven playable stub per gameKey
      if (gameKey === "movie_bingo") {
        // Show a 5x5 random movie name bingo grid
        const bingoList = pickRandomN(movies, 25);
        content = (
          <>
            <h3>{column} Movie Bingo</h3>
            <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6, margin: "12px 0"}}>
              {bingoList.map((m, i) => (
                <div key={i} style={{
                  background: "#091236",
                  borderRadius: 4,
                  padding: "7px 4px",
                  fontSize: ".92rem",
                  minHeight:36,
                  color: "#25e2ff"
                }}>{m.title}</div>
              ))}
            </div>
            <button className="btn btn-large" onClick={()=>handleScore(gameKey, column)}>I'm Done – Save Score</button>
          </>
        );
      } else if (gameKey === "blurred_poster") {
        // Show blurred random poster image & 2 fake clues
        const chosen = pickRandomN(movies, 1)[0];
        content = (
          <>
            <h3>Guess the Movie</h3>
            {chosen && (
              <div style={{margin:"14px 0"}}>
                <img
                  src={chosen.poster_path ? `https://image.tmdb.org/t/p/w200${chosen.poster_path}` : ""}
                  alt="Blurred Poster"
                  style={{width:140, height:196, objectFit:"cover", filter:"blur(6px)"}}
                /><br/>
                <span style={{fontSize:"1.02rem",color:"#ccc"}}>Clue 1: Year – {chosen.release_date ? chosen.release_date.split("-")[0] : "?"}</span><br/>
                <span style={{fontSize:"1.02rem",color:"#ccc"}}>Clue 2: First letter – {chosen.title ? chosen.title[0] : ""}</span><br/>
              </div>
            )}
            <input style={{fontSize: "1rem", padding: 6, marginBottom:12, borderRadius:3, border:"1px solid #90e2ff"}} placeholder="Type your guess" disabled />
            <button className="btn btn-large" style={{marginRight:10}} onClick={()=>alert("Revealed: " + (chosen?.title||""))}>Reveal</button>
            <button className="btn btn-large" onClick={()=>handleScore(gameKey,column)}>Done</button>
          </>
        );
      } else if (gameKey === "six_degrees") {
        // Show two random actor names from two movies (placeholder, real impl needs movie credits API)
        const pickA = pickRandomN(movies, 1)[0];
        const pickB = pickRandomN(movies, 1)[0];
        content = (
          <>
            <h3>Six Degrees – {column}</h3>
            <div>
              Actor 1: <b>{pickA && pickA.original_title}</b> <br />
              Actor 2: <b>{pickB && pickB.original_title}</b> <br />
              (Stub: Connect the two actors through movies.)
            </div>
            <button className="btn btn-large" onClick={()=>handleScore(gameKey,column)}>I'm Done – Save Score</button>
          </>
        );
      } else if (gameKey === "speed_round") {
        // 10 random movie names for rapid answer
        const speedList = pickRandomN(movies, 10);
        content = (
          <>
            <h3>Speed Round: {column}</h3>
            <ul>
              {speedList.map((m,i) => (
                <li key={i}>{m.title} <span style={{color:"#999",fontSize:"0.83em"}}>({m.release_date ? m.release_date.slice(0,4) : ""})</span></li>
              ))}
            </ul>
            <div style={{fontSize:"0.92em", color:"#ada"}}>(Timed answers in full version!)</div>
            <button className="btn btn-large" onClick={()=>handleScore(gameKey,column)}>Save Score</button>
          </>
        );
      } else if (gameKey === "buff_certification") {
        // Quiz stub - 1 to 3 questions using movie titles
        const quizSet = pickRandomN(movies, 3);
        content = (
          <>
            <h3>Movie Buff Certification ({column})</h3>
            <div>
              <ol>
                {quizSet.map((q, idx) =>
                  <li key={idx}>What year was <b>{q.title}</b> released? <span style={{color:"#888"}}>(A:{q.release_date?.slice(0,4)})</span></li>
                )}
              </ol>
            </div>
            <button className="btn btn-large" onClick={()=>handleScore(gameKey,column)}>Save Score</button>
          </>
        );
      } else if (gameKey === "guess_movie_cast") {
        // Multiple choices: which movie matches this cast?
        // For stub, show random movie titles, actual implementation would require further TMDB credits API
        const [q, ...choices] = pickRandomN(movies, 4);
        content = (
          <>
            <h3>Guess the Movie by Cast ({column})</h3>
            <div>
              Which of the following released movies came out in <b>{q && q.release_date ? q.release_date.slice(0,4) : "?"}</b>?
              <div style={{marginTop:10}}>
                {[q, ...choices].map((movie, idx) => (
                  <button key={idx}
                    className="btn"
                    style={{display:"block",margin:"4px auto",minWidth:120,background:"#23afe6",color:"#fff"}}
                    onClick={()=>alert("Correct! (Stub)")}
                  >{movie?.title}</button>
                ))}
              </div>
            </div>
            <button className="btn btn-large" onClick={()=>handleScore(gameKey,column)}>Save Score</button>
          </>
        );
      }
    }

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.56)",
          zIndex: 10001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={()=>setModal({...modal, open: false})}
      >
        <div
          style={{
            background: "#101840",
            color: "#e1feff",
            borderRadius: 13,
            minWidth: 330,
            minHeight: 110,
            maxWidth: 450,
            boxShadow: "0 7px 22px 1px #25e2ff19",
            padding: 22
          }}
          onClick={(e)=>e.stopPropagation()}
        >
          <button
            style={{
              position:"absolute",
              top:16, right:28,
              color: "#bef7fe",
              background:"none",
              border:"none",
              fontSize:"1.7em",
              cursor:"pointer"
            }}
            onClick={()=>setModal({...modal, open: false})}
            aria-label="Close"
          >
            ×
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-titles-row">
        <div className="dashboard-generic-col-title hollywood-title">
          Hollywood <span role="img" aria-label="usa">🇺🇸</span>
        </div>
        <div className="dashboard-generic-col-title kollywood-title">
          Kollywood <span role="img" aria-label="india">🇮🇳</span>
        </div>
      </div>
      <div className="dashboard-desc-row">
        <div className="dashboard-generic-col-desc">
          Hollywood games with the latest from TheMovieDB.
        </div>
        <div className="dashboard-generic-col-desc">
          Kollywood games — experience Tamil cinema content!
        </div>
      </div>
      <div className="dashboard-game-pair-wrap">
        {GAMES.map((game) => (
          <div key={game.key} className="dashboard-game-pair-row">
            <GameCard
              key={"holly-" + game.key}
              column="Hollywood"
              game={game}
              // Pass only Hollywood movies for the Hollywood card
              movies={movieData.hollywood}
              onPlay={() => onPlay(game.key, "Hollywood")}
            />
            <GameCard
              key={"kolly-" + game.key}
              column="Kollywood"
              game={game}
              // Pass only Kollywood movies for the Kollywood card
              movies={movieData.kollywood}
              onPlay={() => onPlay(game.key, "Kollywood")}
            />
          </div>
        ))}
      </div>
      {renderGameModal()}
      <div className="dashboard-note">
        <span>
          All games now pull movie data for each industry live from TMDB. Try a game for Hollywood or Kollywood – see real movie content!
        </span>
      </div>
      {movieData.error && (
        <div style={{padding:"10px",color:"#c33",fontWeight:600}}>
          Error loading movies from TMDB: {movieData.error}
        </div>
      )}
    </div>
  );
}

export default GameDashboard;
