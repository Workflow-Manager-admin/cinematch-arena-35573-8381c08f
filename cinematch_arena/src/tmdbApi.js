//
// TheMovieDB API utility for CineMatch Arena
//
// WARNING: The TMDB API key is hardcoded below per explicit user/demo instructions.
// DO NOT use this approach in production: expose API keys only via secured backend/services!
// ------------------------------------------------------
//
// This utility handles all networking to TheMovieDB using the v3 REST API.
// This is for DEMO/POC purposes ONLY. In real apps, always store secrets securely.
//

// !!! DEMO ONLY: API key directly embedded as required by assignment.
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const DEMO_TMDB_API_KEY = "5bc67d3b06aecbd18121a3cbbc16eb59";

/**
 * Builds a query string from params object.
 * @param {object} params - Object of key-value pairs.
 * @returns {string} Query string for URL.
 */
function toQueryString(params) {
  return (
    "?" +
    Object.entries(params)
      .map(
        ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
      )
      .join("&")
  );
}

/**
 * Core fetcher to TMDB API using the explicit DEMO API key.
 * @param {string} endpoint - The API endpoint after /3
 * @param {object} params - Query params (object)
 * @returns {Promise<object>} The API response data
 */
// PUBLIC_INTERFACE
async function fetchFromTMDB(endpoint, params = {}) {
  // Key is injected into all requests (demo only!)
  const url =
    `${TMDB_API_BASE_URL}${endpoint}` +
    toQueryString({ ...params, api_key: DEMO_TMDB_API_KEY });

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

/**
 * Fetches popular Hollywood movies (US region, English language).
 * @param {number} page - Result page for pagination.
 * @returns {Promise<object>} List of popular Hollywood movies.
 */
// PUBLIC_INTERFACE
export async function fetchPopularHollywoodMovies(page = 1) {
  // US region & English language
  return fetchFromTMDB("/movie/popular", {
    page,
    region: "US",
    language: "en-US",
  });
}

/**
 * Fetches popular Kollywood movies (India region, ONLY authentic Tamil originals).
 * Uses TMDB's discover API to strictly ensure original_language=ta.
 * Double-filters to prevent accidental inclusion of English/dubbed content.
 * @param {number} page - Result page for pagination.
 * @returns {Promise<object>} List of authentic Kollywood (Tamil) movies.
 */
// PUBLIC_INTERFACE
export async function fetchPopularKollywoodMovies(page = 1) {
  // Use /discover/movie: original_language=ta, region=IN, sort by popularity, lang ta-IN for metadata
  const data = await fetchFromTMDB("/discover/movie", {
    page,
    region: "IN",
    sort_by: "popularity.desc",
    with_original_language: "ta",
    // TMDB's behavior: language parameter affects result metadata NOT filtering
    language: "ta-IN",
  });
  // Robust client-side filter:
  // 1. Only original_language === "ta"
  // 2. Not "dubbed" in title or overview
  // 3. origin_country must include "IN"
  // 4. Exclude English/dubbed/otherwise inappropriate results
  const authenticTamil = {
    ...data,
    results: (data.results || []).filter(
      (movie) =>
        movie &&
        movie.original_language === "ta" &&
        (movie.origin_country && movie.origin_country.includes("IN")) &&
        // Exclude "dubbed" keyword (case-insensitive) in title or overview
        (!movie.title || !/dubbed/i.test(movie.title)) &&
        (!movie.overview || !/dubbed/i.test(movie.overview)) &&
        // Exclude if there is obvious sign of non-Tamil/English, as a safeguard:
        (!movie.original_title || !/english|dubbed|eng|with english/i.test(movie.original_title))
    ),
  };
  return authenticTamil;
}

/**
 * Example: Fetch movie details by TMDB movie id
 * @param {number|string} movieId - TMDB movie ID
 * @param {string} language - Language (e.g. 'en-US')
 */
// PUBLIC_INTERFACE
export async function fetchMovieDetails(movieId, language = "en-US") {
  return fetchFromTMDB(`/movie/${movieId}`, { language });
}
