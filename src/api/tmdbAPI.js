// api/tmdbAPI.js (Updated with missing functions)
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Responses are cached in memory for 5 minutes and identical in-flight requests are shared,
// so revisiting a page / re-mounting a component never re-hits the network.
const CACHE_TTL = 5 * 60 * 1000;
const responseCache = new Map(); // url -> { time, promise }

const fetchFromTMDB = (endpoint, params = {}) => {
  if (!API_KEY || API_KEY === 'your_tmdb_read_access_token_here') {
    return Promise.reject(
      new Error('TMDB API key is missing. Please add REACT_APP_TMDB_API_KEY to your .env file.')
    );
  }

  const url = new URL(BASE_URL + endpoint);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) url.searchParams.append(key, value);
  });
  const key = url.toString();

  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL) return cached.promise;

  const promise = fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  }).then((res) => {
    if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
    return res.json();
  });

  responseCache.set(key, { time: Date.now(), promise });
  promise.catch(() => responseCache.delete(key)); // never cache failures
  return promise;
};

// ── Content safety ───────────────────────────────────────────────────────────
// This is a portfolio project, so explicit / 18+ titles are filtered out everywhere.
// Layer 1: `without_keywords` on /discover (server-side, IDs verified against TMDB).
const BLOCKED_KEYWORD_IDS = [
  281741, // nudity
  246601, // nude
  157813, // naked
  384245, // nudie
  10031,  // nudism
  213417, // nudist
  326200, // topless women
  354470, // sex scene
  379687, // hardcore sex
  347060, // explicit sex
  256466, // erotic
  325693, // erotica
  155477, // softcore
  445,    // pornography
  385955, // porn
  7344,   // porn star
  10053,  // sexploitation
  4378,   // striptease
  6593,   // stripper
  11275,  // erotic dance
  1817,   // orgy
].join('|');

// Layer 2: endpoints that can't filter by keyword (trending, popular, search, similar...)
// get each result's keywords checked and matching titles dropped.
const BLOCKED_KEYWORD_PATTERN =
  /\b(nudity|nude|nudes|naked|nudie|nudism|nudist|topless|erotic|erotica|softcore|porn|porno|pornography|sexploitation|striptease|stripper|orgy|sex scene|hardcore sex|explicit sex)\b/i;

// Layer 3: many softcore titles have no keywords at all on TMDB, so also scan title + overview.
const BLOCKED_TEXT_PATTERN =
  /\b(emmanuelle|erotic\w*|porn\w*|softcore|sexploitation|nudity|nude|sensual|steamy|saucy|sexually explicit|sex tape|sex scenes?|stripper|striptease|orgy|orgies)\b/i;

// Cheap, synchronous checks that need no extra requests.
const isBlockedByMetadata = (movie) =>
  !movie ||
  movie.adult === true ||
  BLOCKED_TEXT_PATTERN.test(`${movie.title || ''} ${movie.overview || ''}`);

const hasBlockedKeyword = (keywords = []) =>
  keywords.some((k) => BLOCKED_KEYWORD_PATTERN.test(k.name));

const filterByMetadata = (response) => ({
  ...response,
  results: (response.results || []).filter((m) => !isBlockedByMetadata(m)),
});

// Per-movie keyword lookups (search / similar only). Throttled + retried because TMDB
// answers 429 when ~20 requests fire at once.
const MAX_CONCURRENT = 4;
let running = 0;
const waiting = [];
const throttled = (task) =>
  new Promise((resolve, reject) => {
    const run = async () => {
      running += 1;
      try {
        resolve(await task());
      } catch (err) {
        reject(err);
      } finally {
        running -= 1;
        if (waiting.length) waiting.shift()();
      }
    };
    running < MAX_CONCURRENT ? run() : waiting.push(run);
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchKeywords = async (id) => {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await fetchFromTMDB(`/movie/${id}/keywords`);
    } catch (err) {
      if (!String(err.message).includes('429') || attempt === 3) throw err;
      await sleep(400 * (attempt + 1));
    }
  }
  return { keywords: [] };
};

// movieId -> Promise<boolean> (true = hide); each movie is looked up once per session.
const keywordCache = new Map();
const isBlockedByKeywords = (movie) => {
  if (!keywordCache.has(movie.id)) {
    keywordCache.set(
      movie.id,
      throttled(() => fetchKeywords(movie.id))
        .then((data) => hasBlockedKeyword(data.keywords))
        .catch(() => {
          keywordCache.delete(movie.id);
          return true; // couldn't verify -> hide rather than risk showing it
        })
    );
  }
  return keywordCache.get(movie.id);
};

const filterByKeywords = async (response) => {
  const safe = filterByMetadata(response).results;
  const flags = await Promise.all(safe.map(isBlockedByKeywords));
  return { ...response, results: safe.filter((_, i) => !flags[i]) };
};

const isoDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

// Main lists use ONE /discover request with `without_keywords` instead of one request per movie.
const discoverSafe = (params = {}, page = 1) =>
  fetchFromTMDB('/discover/movie', {
    page,
    include_adult: false,
    include_video: false,
    language: 'en-US',
    without_keywords: BLOCKED_KEYWORD_IDS,
    ...params,
  }).then(filterByMetadata);

const tmdbAPI = {
  // `mediaType` / `timeWindow` kept for call-site compatibility; trending ~= most popular recent releases.
  getTrending: (mediaType = 'movie', timeWindow = 'week', page = 1) =>
    discoverSafe(
      { sort_by: 'popularity.desc', 'primary_release_date.gte': isoDate(-180), 'vote_count.gte': 20 },
      page
    ),

  getPopular: (page = 1) => discoverSafe({ sort_by: 'popularity.desc', 'vote_count.gte': 50 }, page),

  getTopRated: (page = 1) =>
    discoverSafe({ sort_by: 'vote_average.desc', 'vote_count.gte': 3000 }, page),

  getNowPlaying: (page = 1) =>
    discoverSafe(
      {
        sort_by: 'popularity.desc',
        region: 'US',
        with_release_type: '2|3',
        'release_date.gte': isoDate(-45),
        'release_date.lte': isoDate(0),
      },
      page
    ),

  getUpcoming: (page = 1) =>
    discoverSafe(
      {
        sort_by: 'popularity.desc',
        region: 'US',
        with_release_type: '2|3',
        'release_date.gte': isoDate(1),
        'release_date.lte': isoDate(180),
      },
      page
    ),

  searchMovies: (query, page = 1) =>
    fetchFromTMDB('/search/movie', { query, page, include_adult: false }).then(filterByKeywords),

  // Rejects for hidden titles so the page shows its error state.
  getMovieDetails: async (id) => {
    const movie = await fetchFromTMDB(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar,recommendations,keywords',
    });
    if (isBlockedByMetadata(movie) || hasBlockedKeyword(movie.keywords?.keywords)) {
      throw new Error('This movie is not available.');
    }
    const similar = await filterByKeywords({
      results: (movie.similar?.results || []).slice(0, 12),
    });
    const recommendations = similar.results.length
      ? { results: [] }
      : await filterByKeywords({ results: (movie.recommendations?.results || []).slice(0, 12) });
    return { ...movie, similar, recommendations };
  },

  getGenres: () => fetchFromTMDB('/genre/movie/list'),

  discoverMovies: (filters = {}) => {
    const {
      page = 1,
      sortBy = 'popularity.desc',
      genres,
      year,
      minRating,
      ...rest
    } = filters;

    const params = {
      page,
      sort_by: sortBy,
      include_adult: false,
      include_video: false,
      language: 'en-US',
      without_keywords: BLOCKED_KEYWORD_IDS,
      ...rest,
    };

    if (genres) params.with_genres = genres.join(',');
    if (year) params.primary_release_year = year;
    if (minRating) params['vote_average.gte'] = minRating;

    return fetchFromTMDB('/discover/movie', params).then(filterByMetadata);
  },

  // Image and media utilities
  getPosterUrl: (path, size = 'w500') => (path ? `${IMAGE_BASE}/${size}${path}` : null),
  getBackdropUrl: (path, size = 'w1280') => (path ? `${IMAGE_BASE}/${size}${path}` : null),
  
  // NEW: Profile image URL for cast/crew
  getProfileUrl: (path, size = 'w185') => (path ? `${IMAGE_BASE}/${size}${path}` : null),
  
  // YouTube utilities
  getYouTubeUrl: (key) => `https://www.youtube.com/watch?v=${key}`,
  
  // NEW: YouTube embed URL for trailers
  getYouTubeEmbedUrl: (key) => `https://www.youtube.com/embed/${key}?autoplay=1&rel=0`,
  
  // Formatting utilities
  formatRuntime: (min) => min ? `${Math.floor(min / 60)}h ${min % 60}m` : 'N/A',
  formatDate: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
  formatCurrency: (amt) => amt ? `$${amt.toLocaleString()}` : 'N/A',
};

export default tmdbAPI;