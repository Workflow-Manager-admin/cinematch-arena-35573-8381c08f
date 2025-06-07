import React, { useState } from "react";
import "./GameDashboard.css";
import GameCard from "./GameCard";
/*
  WARNING: All TMDB API integration here uses the hardcoded demo key
  directly, as per the assignment. DO NOT use this pattern in production.
 */
import {
  fetchPopularHollywoodMovies,
  fetchPopularKollywoodMovies,
  fetchMovieDetails,
} from "../tmdbApi";

// --- GAME CARD DEFINITIONS (titles/descriptions for all games) ---
const GAMES = [
  {
    key: "movie_bingo",
    title: "Movie Bingo",
    desc: "Find movies that match categories – get five in a row to win!",
  },
  {
    key: "six_degrees",
    title: "Six Degrees of Kevin Bacon",
    desc: "Connect any two actors through movies. Test your Hollywood logic.",
  },
  {
    key: "speed_round",
    title: "Speed Round: 10 Movies in 60 Seconds",
    desc: "How many can you answer? Posters, actors, or quotes come fast!",
  },
  {
    key: "buff_certification",
    title: "Movie Buff Certification",
    desc: "Take a quiz from Beginner to Ultimate. Timed rounds, track your best!",
  },
  {
    key: "guess_movie_cast",
    title: "Guess the Movie by Cast",
    desc: "Identify the movie from the cast. Multiple choices, trick questions await!",
  },
  {
    key: "blurred_poster",
    title: "Blurred Poster Guessing Game",
    desc: "Can you recognize movies from a fuzzy poster and two clues?",
  },
];

// Utility: Pick N random unique elements
function pickRandomN(arr, n) {
  const used = new Set();
  const res = [];
  while (res.length < n && used.size < arr.length) {
    const i = Math.floor(Math.random() * arr.length);
    if (!used.has(i)) {
      res.push(arr[i]);
      used.add(i);
    }
  }
  return res;
}

// PUBLIC_INTERFACE
/**
 * GameDashboard renders two columns of per-industry game cards
 * for Hollywood and Kollywood, powering each game's demo with
 * live TMDB data (using the DEMO API key, INSECURE for prod).
 */
function GameDashboard({ user, onScore, scoreHistory }) {
  // State to cache lists of movies for Hollywood & Kollywood
  const [movieData, setMovieData] = useState({
    hollywood: [],
    kollywood: [],
    loaded: false,
    loading: false,
    error: null,
  });

  // Modal state for each playable card
  const [modal, setModal] = useState({
    open: false,
    column: null, // "Hollywood" or "Kollywood"
    gameKey: null,
    movies: [],
    loading: false,
    error: null,
  });

  // Fetch movie lists on component mount (separately for each industry)
  React.useEffect(() => {
    if (movieData.loaded || movieData.loading) return;
    setMovieData((m) => ({ ...m, loading: true }));

    Promise.all([
      fetchPopularHollywoodMovies(1),
      fetchPopularKollywoodMovies(1),
    ])
      .then(([holly, kolly]) => {
        // Robust filtering for Kollywood: only Tamil originals, region=IN, no dubbed/English
        // This applies strict client-side filtering to cover any TMDB API imperfections
        const strictlyTamilKollywood = (kolly && Array.isArray(kolly.results) ? kolly.results : []).filter(
          (movie) =>
            movie &&
            movie.original_language === "ta" &&
            (movie.origin_country && movie.origin_country.includes("IN")) &&
            (!movie.title || !/dubbed/i.test(movie.title)) &&
            (!movie.overview || !/dubbed/i.test(movie.overview)) &&
            (!movie.original_title || !/english|dubbed|eng|with english/i.test(movie.original_title))
        );
        setMovieData({
          hollywood: holly && holly.results ? holly.results : [],
          kollywood: strictlyTamilKollywood,
          loaded: true,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        setMovieData((old) => ({
          ...old,
          loaded: false,
          loading: false,
          error: err?.message || "Failed to fetch movies",
        }));
      });
    // eslint-disable-next-line
  }, []);

  // Main handler: Show modal for the selected game type with its movie data
  function handlePlay(gameKey, column) {
    const industry = column === "Hollywood" ? "hollywood" : "kollywood";
    setModal({
      open: true,
      column,
      gameKey,
      loading: false,
      movies: movieData[industry] || [],
      error: null,
    });
  }

  // Demo scoring logic (stub): Calls onScore and closes the modal
  function handleScore(gameKey, column) {
    let demoScores = {
      movie_bingo: Math.floor(Math.random() * 100) + 40,
      six_degrees: Math.floor(Math.random() * 70) + 10,
      speed_round: Math.floor(Math.random() * 21),
      buff_certification: Math.floor(Math.random() * 100),
      guess_movie_cast: Math.floor(Math.random() * 8) + 2,
      blurred_poster: Math.floor(Math.random() * 2) ? "Correct!" : "Incorrect",
    };
    onScore(
      GAMES.find((g) => g.key === gameKey).title,
      demoScores[gameKey],
      column
    );
    setModal({ ...modal, open: false });
    alert(
      "Score saved! (Stub – In full version, game logic would determine your score.)"
    );
  }

  // --- Per-Game Modal Demo Playground for Each Game ---
  function renderGameModal() {
    if (!modal.open) return null;
    const { column, gameKey, movies } = modal;
    let content = null;

    if (movieData.loading) {
      content = (
        <div style={{ textAlign: "center", padding: 25 }}>
          Loading movies from TMDB&hellip;
        </div>
      );
    } else if (movieData.error) {
      content = (
        <div style={{ color: "#c00", padding: 22 }}>
          Failed to load movies: {movieData.error}
        </div>
      );
    } else if (!movies || movies.length === 0) {
      content = (
        <div style={{ textAlign: "center", padding: 22 }}>
          No movies loaded for {column}
        </div>
      );
    } else {
      // --- GAME: MOVIE BINGO (5x5 grid of movies) ---
      if (gameKey === "movie_bingo") {
        const bingoList = pickRandomN(movies, 25);
        content = (
          <>
            <h3>
              {column} Movie Bingo
              <span style={{ fontSize: 14, color: "#7df" }}>
                &nbsp;(Real TMDB movies)
              </span>
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 6,
                margin: "12px 0",
              }}
            >
              {bingoList.map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: "#081136",
                    borderRadius: 4,
                    padding: "7px 4px",
                    fontSize: ".92rem",
                    minHeight: 36,
                    color: "#25e2ff",
                  }}
                >
                  {m.title}
                </div>
              ))}
            </div>
            <button
              className="btn btn-large"
              onClick={() => handleScore(gameKey, column)}
            >
              I'm Done – Save Score
            </button>
          </>
        );
      }
      // --- GAME: SIX DEGREES (stub: just show two movie titles, real game would fetch cast/credits and show connection) ---
      else if (gameKey === "six_degrees") {
        const m1 = pickRandomN(movies, 1)[0];
        const m2 = pickRandomN(movies, 1)[0];
        content = (
          <>
            <h3>Six Degrees: {column}</h3>
            <div>
              <b>Movie 1:</b> {m1?.title} <br />
              <b>Movie 2:</b> {m2?.title}
              <div style={{ color: "#cdcdff", fontSize: "1em", marginTop: 12 }}>
                (Stub: In full version, connect cast/actor graph via credits)
              </div>
            </div>
            <button
              className="btn btn-large"
              onClick={() => handleScore(gameKey, column)}
            >
              I'm Done – Save Score
            </button>
          </>
        );
      }
      // --- GAME: SPEED ROUND (just display 10 films, real would cue Q/A/timer) ---
      else if (gameKey === "speed_round") {
        const questions = pickRandomN(movies, 10);
        content = (
          <>
            <h3>Speed Round! ({column}) [DEMO]</h3>
            <ul>
              {questions.map((m, i) => (
                <li key={i}>
                  {m.title}
                  <span style={{ color: "#999", fontSize: "0.83em" }}>
                    {m.release_date ? ` (${m.release_date.slice(0, 4)})` : ""}
                  </span>
                </li>
              ))}
            </ul>
            <div style={{ fontSize: "0.96em", color: "#ada" }}>
              (In final: answer as many as you can in 60s!)
            </div>
            <button
              className="btn btn-large"
              onClick={() => handleScore(gameKey, column)}
            >
              Save Score
            </button>
          </>
        );
      }
      // --- GAME: MOVIE BUFF CERTIFICATION (show a few release-year quiz questions) ---
      else if (gameKey === "buff_certification") {
        const questions = pickRandomN(movies, 3);
        content = (
          <>
            <h3>
              Movie Buff Certification ({column}){" "}
              <span style={{ color: "#9fe" }}>[Quiz Demo]</span>
            </h3>
            <ol>
              {questions.map((m, idx) => (
                <li key={idx}>
                  Release year for{" "}
                  <b>
                    <u>{m.title}</u>
                  </b>
                  ? &nbsp;
                  <span style={{ color: "#888" }}>
                    (A: {m.release_date ? m.release_date.slice(0, 4) : "?"})
                  </span>
                </li>
              ))}
            </ol>
            <button
              className="btn btn-large"
              onClick={() => handleScore(gameKey, column)}
            >
              Save Score
            </button>
          </>
        );
      }
      // --- GAME: GUESS THE MOVIE BY CAST (stub, as cast loading needs extra API call) ---
      else if (gameKey === "guess_movie_cast") {
        // For the demo: random movie release year, pick movie from choices
        const [correct, ...choices] = pickRandomN(movies, 4);
        const allChoices = [correct, ...choices].sort(() => Math.random() - 0.5);
        content = (
          <>
            <h3>Guess the Movie by Cast ({column})</h3>
            <div>
              Pick the movie released in{" "}
              <b>
                {correct && correct.release_date
                  ? correct.release_date.slice(0, 4)
                  : "?"}
              </b>
              :
              <div style={{ marginTop: 10 }}>
                {allChoices.map((m, idx) => (
                  <button
                    key={idx}
                    className="btn"
                    style={{
                      display: "block",
                      margin: "4px auto",
                      minWidth: 120,
                      background: "#23afe6",
                      color: "#fff",
                    }}
                    onClick={() =>
                      window.alert(
                        m?.id === correct?.id
                          ? "Correct! (stub for cast gameplay)"
                          : "Incorrect"
                      )
                    }
                  >
                    {m?.title}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="btn btn-large"
              onClick={() => handleScore(gameKey, column)}
            >
              Save Score
            </button>
          </>
        );
      }
      // --- GAME: BLURRED POSTER GUESSING GAME ---
      else if (gameKey === "blurred_poster") {
        const chosen = pickRandomN(movies, 1)[0];
        content = (
          <>
            <h3>
              Blurred Poster Guessing Game – {column}
              <span style={{ fontSize: 13, color: "#ccc" }}>
                &nbsp;(Real TMDB poster!)
              </span>
            </h3>
            {chosen && (
              <div style={{ margin: "14px 0" }}>
                <img
                  src={
                    chosen.poster_path
                      ? `https://image.tmdb.org/t/p/w200${chosen.poster_path}`
                      : ""
                  }
                  alt="Blurred Poster"
                  style={{
                    width: 140,
                    height: 196,
                    objectFit: "cover",
                    filter: "blur(8px)",
                  }}
                />
                <br />
                <span style={{ fontSize: "1.01rem", color: "#aef" }}>
                  Clue 1: Year –{" "}
                  {chosen.release_date
                    ? chosen.release_date.split("-")[0]
                    : "?"}
                </span>
                <br />
                <span style={{ fontSize: "1.01rem", color: "#fea" }}>
                  Clue 2: First letter – {chosen.title ? chosen.title[0] : ""}
                </span>
                <br />
              </div>
            )}
            <input
              style={{
                fontSize: "1rem",
                padding: 6,
                marginBottom: 12,
                borderRadius: 3,
                border: "1px solid #90e2ff",
              }}
              placeholder="Type your guess"
              disabled
            />
            <button
              className="btn btn-large"
              style={{ marginRight: 10 }}
              onClick={() => alert("Revealed: " + (chosen?.title || ""))}
            >
              Reveal
            </button>
            <button
              className="btn btn-large"
              onClick={() => handleScore(gameKey, column)}
            >
              Done
            </button>
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
          justifyContent: "center",
        }}
        onClick={() => setModal({ ...modal, open: false })}
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
            padding: 22,
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            style={{
              position: "absolute",
              top: 16,
              right: 28,
              color: "#bef7fe",
              background: "none",
              border: "none",
              fontSize: "1.7em",
              cursor: "pointer",
            }}
            onClick={() => setModal({ ...modal, open: false })}
            aria-label="Close"
          >
            ×
          </button>
          {content}
        </div>
      </div>
    );
  }

  // RENDER: All game cards in two columns, with real TMDB data per game
  return (
    <div className="dashboard-container">
      <div className="dashboard-titles-row">
        <div className="dashboard-generic-col-title hollywood-title">
          Hollywood <span role="img" aria-label="usa">
            🇺🇸
          </span>
        </div>
        <div className="dashboard-generic-col-title kollywood-title">
          Kollywood <span role="img" aria-label="india">
            🇮🇳
          </span>
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
              movies={movieData.hollywood}
              onPlay={() => handlePlay(game.key, "Hollywood")}
            />
            <GameCard
              key={"kolly-" + game.key}
              column="Kollywood"
              game={game}
              movies={movieData.kollywood}
              onPlay={() => handlePlay(game.key, "Kollywood")}
            />
          </div>
        ))}
      </div>
      {renderGameModal()}
      <div className="dashboard-note">
        <span>
          All games now pull movie data for each industry live from TMDB.
          Try a game for Hollywood or Kollywood – see real movie content!
        </span>
      </div>
      {movieData.error && (
        <div style={{ padding: "10px", color: "#c33", fontWeight: 600 }}>
          Error loading movies from TMDB: {movieData.error}
        </div>
      )}
    </div>
  );
}

export default GameDashboard;
