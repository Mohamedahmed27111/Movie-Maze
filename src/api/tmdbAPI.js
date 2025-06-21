// api/tmdbAPI.js (Updated with missing functions)
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWNjY2ZjMzM5MTNkZjA1NzYwYzYxZjg0ZjEwZGE1ZiIsIm5iZiI6MTcyMzM3Nzk3My4yMTIsInN1YiI6IjY2YjhhOTM1ZDUwZDlhNjQzOTc3MGIyNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1b2FwROPl0aX1LEnSFfZ-pbUHNWFoDsrbVaNZfLv3ng";

const fetchFromTMDB = async (endpoint, params = {}) => {
  const url = new URL(BASE_URL + endpoint);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) url.searchParams.append(key, value);
  });

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
  return res.json();
};

const tmdbAPI = {
  getTrending: (mediaType = 'movie', timeWindow = 'week') =>
    fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`),

  getPopular: (page = 1) => fetchFromTMDB('/movie/popular', { page }),
  getTopRated: (page = 1) => fetchFromTMDB('/movie/top_rated', { page }),
  getNowPlaying: (page = 1) => fetchFromTMDB('/movie/now_playing', { page }),
  getUpcoming: (page = 1) => fetchFromTMDB('/movie/upcoming', { page }),

  searchMovies: (query, page = 1) =>
    fetchFromTMDB('/search/movie', { query, page }),

  getMovieDetails: (id) =>
    fetchFromTMDB(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar,recommendations',
    }),

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
      ...rest,
    };

    if (genres) params.with_genres = genres.join(',');
    if (year) params.primary_release_year = year;
    if (minRating) params['vote_average.gte'] = minRating;

    return fetchFromTMDB('/discover/movie', params);
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