// context/MovieContext.jsx - Fixed for proper pagination
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import tmdbAPI from '../api/tmdbAPI';

const MovieContext = createContext();

// Movie state actions
const MOVIE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TRENDING: 'SET_TRENDING',
  SET_POPULAR: 'SET_POPULAR',
  SET_TOP_RATED: 'SET_TOP_RATED',
  SET_NOW_PLAYING: 'SET_NOW_PLAYING',
  SET_UPCOMING: 'SET_UPCOMING',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_MOVIE_DETAILS: 'SET_MOVIE_DETAILS',
  SET_GENRES: 'SET_GENRES',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  // Movie lists
  trending: { movies: [], page: 1, totalPages: 0, totalResults: 0 },
  popular: { movies: [], page: 1, totalPages: 0, totalResults: 0 },
  topRated: { movies: [], page: 1, totalPages: 0, totalResults: 0 },
  nowPlaying: { movies: [], page: 1, totalPages: 0, totalResults: 0 },
  upcoming: { movies: [], page: 1, totalPages: 0, totalResults: 0 },
  
  // Search
  searchResults: { movies: [], query: '', page: 1, totalPages: 0, totalResults: 0 },
  
  // Movie details cache
  movieDetailsCache: {},
  
  // Genres
  genres: [],
  
  // Loading states
  loading: {
    trending: false,
    popular: false,
    topRated: false,
    nowPlaying: false,
    upcoming: false,
    search: false,
    movieDetails: false,
    genres: false
  },
  
  // Error states
  error: null
};

// Movie reducer - FIXED: Replace content instead of appending for pagination
function movieReducer(state, action) {
  switch (action.type) {
    case MOVIE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.isLoading
        }
      };

    case MOVIE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case MOVIE_ACTIONS.SET_TRENDING:
      return {
        ...state,
        trending: {
          movies: action.payload.results, // FIXED: Always replace, don't append
          page: action.payload.page,
          totalPages: action.payload.total_pages,
          totalResults: action.payload.total_results
        }
      };

    case MOVIE_ACTIONS.SET_POPULAR:
      return {
        ...state,
        popular: {
          movies: action.payload.results, // FIXED: Always replace, don't append
          page: action.payload.page,
          totalPages: action.payload.total_pages,
          totalResults: action.payload.total_results
        }
      };

    case MOVIE_ACTIONS.SET_TOP_RATED:
      return {
        ...state,
        topRated: {
          movies: action.payload.results, // FIXED: Always replace, don't append
          page: action.payload.page,
          totalPages: action.payload.total_pages,
          totalResults: action.payload.total_results
        }
      };

    case MOVIE_ACTIONS.SET_NOW_PLAYING:
      return {
        ...state,
        nowPlaying: {
          movies: action.payload.results, // FIXED: Always replace, don't append
          page: action.payload.page,
          totalPages: action.payload.total_pages,
          totalResults: action.payload.total_results
        }
      };

    case MOVIE_ACTIONS.SET_UPCOMING:
      return {
        ...state,
        upcoming: {
          movies: action.payload.results, // FIXED: Always replace, don't append
          page: action.payload.page,
          totalPages: action.payload.total_pages,
          totalResults: action.payload.total_results
        }
      };

    case MOVIE_ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: {
          movies: action.payload.results, // FIXED: Always replace, don't append
          query: action.payload.query,
          page: action.payload.page,
          totalPages: action.payload.total_pages,
          totalResults: action.payload.total_results
        }
      };

    case MOVIE_ACTIONS.SET_MOVIE_DETAILS:
      return {
        ...state,
        movieDetailsCache: {
          ...state.movieDetailsCache,
          [action.payload.id]: action.payload
        }
      };

    case MOVIE_ACTIONS.SET_GENRES:
      return {
        ...state,
        genres: action.payload
      };

    case MOVIE_ACTIONS.CLEAR_SEARCH:
      return {
        ...state,
        searchResults: { movies: [], query: '', page: 1, totalPages: 0, totalResults: 0 }
      };

    case MOVIE_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

// Movie Provider Component
export function MovieProvider({ children }) {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // Generic API call handler
  const handleApiCall = useCallback(async (apiCall, actionType, loadingType) => {
    try {
      dispatch({ 
        type: MOVIE_ACTIONS.SET_LOADING, 
        payload: { type: loadingType, isLoading: true } 
      });
      
      const data = await apiCall();
      dispatch({ type: actionType, payload: data });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.message || 'An error occurred while fetching data';
      dispatch({ type: MOVIE_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ 
        type: MOVIE_ACTIONS.SET_LOADING, 
        payload: { type: loadingType, isLoading: false } 
      });
    }
  }, []);

  // Fetch trending movies
  const fetchTrending = useCallback(async (page = 1) => {
    return handleApiCall(
      () => tmdbAPI.getTrending('movie', 'week').then(data => ({ ...data, page })),
      MOVIE_ACTIONS.SET_TRENDING,
      'trending'
    );
  }, [handleApiCall]);

  // Fetch popular movies
  const fetchPopular = useCallback(async (page = 1) => {
    return handleApiCall(
      () => tmdbAPI.getPopular(page),
      MOVIE_ACTIONS.SET_POPULAR,
      'popular'
    );
  }, [handleApiCall]);

  // Fetch top rated movies
  const fetchTopRated = useCallback(async (page = 1) => {
    return handleApiCall(
      () => tmdbAPI.getTopRated(page),
      MOVIE_ACTIONS.SET_TOP_RATED,
      'topRated'
    );
  }, [handleApiCall]);

  // Fetch now playing movies
  const fetchNowPlaying = useCallback(async (page = 1) => {
    return handleApiCall(
      () => tmdbAPI.getNowPlaying(page),
      MOVIE_ACTIONS.SET_NOW_PLAYING,
      'nowPlaying'
    );
  }, [handleApiCall]);

  // Fetch upcoming movies
  const fetchUpcoming = useCallback(async (page = 1) => {
    return handleApiCall(
      () => tmdbAPI.getUpcoming(page),
      MOVIE_ACTIONS.SET_UPCOMING,
      'upcoming'
    );
  }, [handleApiCall]);

  // Search movies
  const searchMovies = useCallback(async (query, page = 1) => {
    if (!query.trim()) {
      dispatch({ type: MOVIE_ACTIONS.CLEAR_SEARCH });
      return { success: true, data: null };
    }

    return handleApiCall(
      () => tmdbAPI.searchMovies(query, page).then(data => ({ ...data, query, page })),
      MOVIE_ACTIONS.SET_SEARCH_RESULTS,
      'search'
    );
  }, [handleApiCall]);

  // Fetch movie details
  const fetchMovieDetails = useCallback(async (movieId) => {
    // Check cache first
    if (state.movieDetailsCache[movieId]) {
      return { success: true, data: state.movieDetailsCache[movieId] };
    }

    return handleApiCall(
      () => tmdbAPI.getMovieDetails(movieId),
      MOVIE_ACTIONS.SET_MOVIE_DETAILS,
      'movieDetails'
    );
  }, [handleApiCall, state.movieDetailsCache]);

  // Fetch genres
  const fetchGenres = useCallback(async () => {
    if (state.genres.length > 0) {
      return { success: true, data: state.genres };
    }

    return handleApiCall(
      () => tmdbAPI.getGenres().then(data => data.genres),
      MOVIE_ACTIONS.SET_GENRES,
      'genres'
    );
  }, [handleApiCall, state.genres]);

  // Discover movies with filters
  const discoverMovies = useCallback(async (filters = {}) => {
    try {
      dispatch({ 
        type: MOVIE_ACTIONS.SET_LOADING, 
        payload: { type: 'search', isLoading: true } 
      });
      
      const data = await tmdbAPI.discoverMovies(filters);
      dispatch({ 
        type: MOVIE_ACTIONS.SET_SEARCH_RESULTS, 
        payload: { ...data, query: 'discover', page: filters.page || 1 } 
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.message || 'An error occurred while discovering movies';
      dispatch({ type: MOVIE_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ 
        type: MOVIE_ACTIONS.SET_LOADING, 
        payload: { type: 'search', isLoading: false } 
      });
    }
  }, []);

  // Clear search results
  const clearSearch = useCallback(() => {
    dispatch({ type: MOVIE_ACTIONS.CLEAR_SEARCH });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: MOVIE_ACTIONS.CLEAR_ERROR });
  }, []);

  // Get movie from cache
  const getMovieFromCache = useCallback((movieId) => {
    return state.movieDetailsCache[movieId] || null;
  }, [state.movieDetailsCache]);

  const value = {
    // State
    ...state,
    
    // Actions
    fetchTrending,
    fetchPopular,
    fetchTopRated,
    fetchNowPlaying,
    fetchUpcoming,
    searchMovies,
    fetchMovieDetails,
    fetchGenres,
    discoverMovies,
    clearSearch,
    clearError,
    getMovieFromCache
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}

// Custom hook to use movie context
export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
}

export default MovieContext;