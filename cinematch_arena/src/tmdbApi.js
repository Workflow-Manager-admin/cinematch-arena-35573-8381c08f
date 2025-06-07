//
// TheMovieDB API utility for CineMatch Arena
//
// This utility handles all networking to TheMovieDB using the v3 REST API.
// It expects REACT_APP_TMDB_API_KEY in the environment for API authentication.
// DO NOT hardcode the API key directly into source code or commit it to the repo.
//

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Returns the TMDB API key from the environment, or logs an error if missing.
 * @returns {string} The TMDB API key.
 */
function getApiKey() {
  // PUBLIC_INTERFACE
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey) {
    console.error("TMDB API key missing! Please set REACT_APP_TMDB_API_KEY in your environment.");
    throw new Error("TMDB API key is required");
  }
  return apiKey;
}

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
 * Core fetcher to TMDB API.
 * @param {string} endpoint - The API endpoint after /3
 * @param {object} params - Query params (object)
 * @returns {Promise<object>} The API response data
 */
async function fetchFromTMDB(endpoint, params = {}) {
  // PUBLIC_INTERFACE
  const apiKey = getApiKey();
  const url =
    `${TMDB_API_BASE_URL}${endpoint}` +
    toQueryString({ ...params, api_key: apiKey });

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
export async function fetchPopularHollywoodMovies(page = 1) {
  // PUBLIC_INTERFACE
  // US region & English language
  return fetchFromTMDB("/movie/popular", {
    page,
    region: "US",
    language: "en-US",
  });
}

/**
 * Fetches popular Kollywood movies (India region, Tamil language).
 * @param {number} page - Result page for pagination.
 * @returns {Promise<object>} List of popular Kollywood movies.
 */
export async function fetchPopularKollywoodMovies(page = 1) {
  // PUBLIC_INTERFACE
  // India region, Tamil language ("ta-IN").
  // Kollywood is mainly Tamil cinema. There is no official "Kollywood" filter,
  // but this fetches popular movies in Tamil language from India.
  return fetchFromTMDB("/movie/popular", {
    page,
    region: "IN",
    language: "ta-IN",
  });
}

/**
 * Example: Fetch movie details by TMDB movie id
 * @param {number|string} movieId - TMDB movie ID
 * @param {string} language - Language (e.g. 'en-US')
 */
export async function fetchMovieDetails(movieId, language = "en-US") {
  // PUBLIC_INTERFACE
  return fetchFromTMDB(`/movie/${movieId}`, { language });
}
