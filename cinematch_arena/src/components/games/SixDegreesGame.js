import React, { useState } from "react";
import {
  searchPersonByName,
  fetchPersonCredits,
  fetchMovieCredits,
} from "../../tmdbApi";

/**
 * Six Degrees of Kevin Bacon - Minimal Demo
 * Shows a live TMDB actor lookup and a (stub) movie connection path
 * @param {object} props
 *   @param {string} column: Hollywood or Kollywood
 *   @param {function} onComplete
 */
 // PUBLIC_INTERFACE
function SixDegreesGame({ column, onComplete }) {
  const [actorA, setActorA] = useState("");
  const [actorB, setActorB] = useState("");
  const [state, setState] = useState({ loading: false, result: null, error: null });

  // For real: would compute a true link chain. Here, simply shows random shared movie if any.
  async function findConnection() {
    setState({ loading: true, result: null, error: null });
    try {
      const [resA, resB] = await Promise.all([
        searchPersonByName(actorA),
        searchPersonByName(actorB),
      ]);
      if (!resA.results || !resA.results[0] || !resB.results || !resB.results[0])
        throw new Error("Could not find one or both actors.");
      const idA = resA.results[0].id, idB = resB.results[0].id;
      const [creditsA, creditsB] = await Promise.all([
        fetchPersonCredits(idA),
        fetchPersonCredits(idB),
      ]);
      const moviesA = creditsA.cast || [];
      const moviesB = creditsB.cast || [];
      // Find shared movie if any (demo only, real "six degrees" would path-find)
      const shared = moviesA.find(ma => moviesB.some(mb => mb.id === ma.id));
      let connection = null;
      if (shared) {
        connection = {
          type: "shared_movie",
          movie: shared.title,
          movieId: shared.id,
        };
      } else {
        connection = { type: "no_direct", msg: "No direct shared movie found (would need indirect search...)" };
      }
      setState({ loading: false, result: { ...connection, actors: [
        { name: resA.results[0].name, id: idA },
        { name: resB.results[0].name, id: idB }
      ] }, error: null });
    } catch (e) {
      setState({ loading: false, result: null, error: e.message });
    }
  }

  return (
    <div style={{padding: 8}}>
      <h3>Six Degrees of {column === "Hollywood" ? <>Kevin Bacon</> : <>TMDB Star</>}</h3>
      <div>
        <p style={{fontSize:".95em", color:"#aef"}}>Type names of 2 actors ({column}) to check their connection.<br />(Live TMDB data: works best with well-known English/Tamil actors!)</p>
        <input value={actorA} placeholder="Actor 1 name"
          onChange={e=>setActorA(e.target.value)} style={{margin:4,padding:5}} />
        <input value={actorB} placeholder="Actor 2 name"
          onChange={e=>setActorB(e.target.value)} style={{margin:4,padding:5}} />
        <button className="btn btn-large" onClick={findConnection}
          disabled={state.loading || !actorA.trim() || !actorB.trim()}>Find Connection</button>
      </div>
      {state.loading && <div style={{margin:12}}>Loading…</div>}
      {state.error && <div style={{color:"#f44"}}>Error: {state.error}</div>}
      {state.result && (
        <div style={{marginTop: 14, color: "#dff"}}>
          <div>
            <b>{state.result.actors[0].name}</b> ↔ <b>{state.result.actors[1].name}</b>
          </div>
          {state.result.type === "shared_movie" ? (
            <div>Both appeared in <b>{state.result.movie}</b></div>
          ) : (
            <div>{state.result.msg}</div>
          )}
        </div>
      )}
      <button className="btn btn-large" style={{marginTop:10}}
        onClick={()=>onComplete("Done")}>End Game</button>
    </div>
  );
}

export default SixDegreesGame;

