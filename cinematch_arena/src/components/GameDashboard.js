import React from "react";
import "./GameDashboard.css";
import GameCard from "./GameCard";

// Game configuration for both columns
const GAMES = [
  {
    key: "movie_bingo",
    title: "Movie Bingo",
    desc: "Find movies that match categories – get five in a row to win!",
    demo: true,
  },
  {
    key: "six_degrees",
    title: "Six Degrees of Kevin Bacon",
    desc: "Connect any two actors through movies. Test your Hollywood logic.",
    demo: true,
  },
  {
    key: "speed_round",
    title: "Speed Round: 10 Movies in 60 Seconds",
    desc: "How many can you answer? Posters, actors, or quotes come fast!",
    demo: true,
  },
  {
    key: "buff_certification",
    title: "Movie Buff Certification",
    desc: "Take a quiz from Beginner to Ultimate. Timed rounds, track your best!",
    demo: true,
  },
  {
    key: "guess_movie_cast",
    title: "Guess the Movie by Cast",
    desc: "Identify the movie from the cast. Multiple choices, trick questions await!",
    demo: true,
  },
  {
    key: "blurred_poster",
    title: "Blurred Poster Guessing Game",
    desc: "Can you recognize movies from a fuzzy poster and two clues?",
    demo: true,
  },
];

// PUBLIC_INTERFACE
/**
 * Main dashboard: visual two-column split for Hollywood and Kollywood.
 * Each has same set of games; cards invoke game stubs/demos.
 */
function GameDashboard({ user, onScore, scoreHistory }) {
  const onPlay = (gameKey, column) => {
    // For now, just save a random score for demo.
    // Full game implementation is out of scope for stub feature.
    let demoScores = {
      movie_bingo: Math.floor(Math.random() * 100) + 40,
      six_degrees: Math.floor(Math.random() * 70) + 10,
      speed_round: Math.floor(Math.random() * 21),
      buff_certification: Math.floor(Math.random() * 100),
      guess_movie_cast: Math.floor(Math.random() * 8) + 2,
      blurred_poster: Math.floor(Math.random() * 2) ? "Correct!" : "Incorrect",
    };
    onScore(GAMES.find((g) => g.key === gameKey).title, demoScores[gameKey], column);
    alert("Game play stub: in a full version, you would play the game now.\nA mock score has been saved.");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-columns-wrap">
        <section className="dashboard-column hollywood">
          <h2 className="column-title hollywood-title">
            Hollywood <span role="img" aria-label="usa">🇺🇸</span>
          </h2>
          <p className="column-desc">
            Hollywood games with the latest from TheMovieDB.
          </p>
          <div className="game-cards">
            {GAMES.map((game) => (
              <GameCard
                key={"holly-" + game.key}
                column="Hollywood"
                game={game}
                onPlay={() => onPlay(game.key, "Hollywood")}
              />
            ))}
          </div>
        </section>
        <div className="columns-divider" />
        <section className="dashboard-column kollywood">
          <h2 className="column-title kollywood-title">
            Kollywood <span role="img" aria-label="india">🇮🇳</span>
          </h2>
          <p className="column-desc">
            Kollywood games — experience Tamil cinema content!
          </p>
          <div className="game-cards">
            {GAMES.map((game) => (
              <GameCard
                key={"kolly-" + game.key}
                column="Kollywood"
                game={game}
                onPlay={() => onPlay(game.key, "Kollywood")}
              />
            ))}
          </div>
        </section>
      </div>
      <div className="dashboard-note">
        <span>
          TMDB integration is ready for data-driven games. Games are demo stubs; API will power movie content.
        </span>
      </div>
    </div>
  );
}

export default GameDashboard;
