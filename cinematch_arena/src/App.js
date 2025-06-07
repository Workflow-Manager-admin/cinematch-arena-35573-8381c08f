import React, { useEffect } from 'react';
import './App.css';
import {
  fetchPopularHollywoodMovies,
  fetchPopularKollywoodMovies
} from './tmdbApi';

// Demo: fetch sample popular movies for Hollywood and Kollywood and print to console.
function useTmdbDemo() {
  useEffect(() => {
    async function demo() {
      try {
        const hollywood = await fetchPopularHollywoodMovies();
        // Print a sample of movie titles for Hollywood
        console.log(
          "Popular Hollywood Movies:",
          hollywood.results.slice(0, 3).map(m => m.title)
        );
        const kollywood = await fetchPopularKollywoodMovies();
        // Print a sample of movie titles for Kollywood (Tamil)
        console.log(
          "Popular Kollywood Movies:",
          kollywood.results.slice(0, 3).map(m => m.title)
        );
      } catch (err) {
        console.error("TMDB API demo error:", err.message);
      }
    }
    demo();
  }, []);
}

function App() {
  useTmdbDemo();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn">Template Button</button>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="hero">
            <div className="subtitle">AI Workflow Manager Template</div>

            <h1 className="title">cinematch_arena</h1>

            <div className="description">
              Start building your application.
            </div>

            <button className="btn btn-large">Button</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;