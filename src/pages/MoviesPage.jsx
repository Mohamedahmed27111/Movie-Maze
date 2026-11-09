// ✅ Enhanced MoviesPage.jsx - Improved Responsive Design & UX
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovies } from '../contexts/MovieContext';
import MovieGrid from '../components/movie/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { 
  Grid, 
  List, 
  ChevronDown, 
  X,
  Search,
  Sliders
} from 'lucide-react';

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    searchResults,
    popular,
    topRated,
    trending,
    nowPlaying,
    upcoming,
    genres,
    loading,
    error,
    fetchPopular,
    fetchTopRated,
    fetchTrending,
    fetchNowPlaying,
    fetchUpcoming,
    fetchGenres,
    discoverMovies
  } = useMovies();

  // Local user state (replaces Firebase auth)
  const [user, setUser] = useState(null);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'popular',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    sortBy: searchParams.get('sortBy') || 'popularity.desc',
    page: parseInt(searchParams.get('page')) || 1,
    minRating: searchParams.get('minRating') || '',
    language: searchParams.get('language') || ''
  });

  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState(new Set());
  const [watchlist, setWatchlist] = useState(new Set());
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [apiError, setApiError] = useState(null);

  const categories = [
    { value: 'popular', label: 'Popular', icon: '🔥' },
    { value: 'top_rated', label: 'Top Rated', icon: '⭐' },
    { value: 'trending', label: 'Trending', icon: '📈' },
    { value: 'now_playing', label: 'Now Playing', icon: '🎬' },
    { value: 'upcoming', label: 'Upcoming', icon: '🚀' }
  ];

  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular', icon: '🔥' },
    { value: 'vote_average.desc', label: 'Highest Rated', icon: '⭐' },
    { value: 'release_date.desc', label: 'Newest First', icon: '📅' },
    { value: 'release_date.asc', label: 'Oldest First', icon: '📜' },
    { value: 'title.asc', label: 'A to Z', icon: '🔤' },
    { value: 'title.desc', label: 'Z to A', icon: '🔤' },
    { value: 'revenue.desc', label: 'Highest Grossing', icon: '💰' }
  ];

  const languages = [
    { value: '', label: 'All Languages', flag: '🌍' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Spanish', flag: '🇪🇸' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'de', label: 'German', flag: '🇩🇪' },
    { value: 'it', label: 'Italian', flag: '🇮🇹' },
    { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
    { value: 'ko', label: 'Korean', flag: '🇰🇷' },
    { value: 'zh', label: 'Chinese', flag: '🇨🇳' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const ratings = [
    { value: '', label: 'Any Rating', stars: '✨' },
    { value: '7', label: '7+ Stars', stars: '⭐⭐⭐⭐⭐⭐⭐' },
    { value: '8', label: '8+ Stars', stars: '⭐⭐⭐⭐⭐⭐⭐⭐' },
    { value: '9', label: '9+ Stars', stars: '⭐⭐⭐⭐⭐⭐⭐⭐⭐' }
  ];

  // Load user data from localStorage (replaces Firebase)
  const loadUserData = useCallback(async () => {
    if (!user) return;
    setIsLoadingUserData(true);
    
    try {
      // Load preferences from localStorage
      const savedPreferences = localStorage.getItem(`userPreferences_${user.id}`);
      if (savedPreferences) {
        const prefs = JSON.parse(savedPreferences);
        setViewMode(prefs.viewMode || 'grid');

        if (!searchParams.toString()) {
          setFilters(prev => ({ ...prev, ...prefs.defaultFilters }));
        }
      }

      // Load favorites from localStorage
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        const favs = new Set(JSON.parse(savedFavorites));
        setFavoriteMovies(favs);
      }

      // Load watchlist from localStorage
      const savedWatchlist = localStorage.getItem(`watchlist_${user.id}`);
      if (savedWatchlist) {
        const watchlistSet = new Set(JSON.parse(savedWatchlist));
        setWatchlist(watchlistSet);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      setApiError('Failed to load user data. Please try again.');
    } finally {
      setIsLoadingUserData(false);
    }
  }, [user, searchParams]);

  // Fetch movies with filters
  const fetchMoviesWithFilters = useCallback(async () => {
    try {
      setApiError(null);
      
      if (filters.genre || filters.year || filters.minRating || filters.language || filters.sortBy !== 'popularity.desc') {
        const discoverParams = {
          page: filters.page,
          sortBy: filters.sortBy,
          year: filters.year,
          minRating: filters.minRating
        };

        if (filters.language) {
          discoverParams.with_original_language = filters.language;
        }

        if (filters.genre) {
          discoverParams.genres = [filters.genre];
        }

        await discoverMovies(discoverParams);
      } else {
        switch (filters.category) {
          case 'popular': await fetchPopular(filters.page); break;
          case 'top_rated': await fetchTopRated(filters.page); break;
          case 'trending': await fetchTrending(filters.page); break;
          case 'now_playing': await fetchNowPlaying(filters.page); break;
          case 'upcoming': await fetchUpcoming(filters.page); break;
          default: await fetchPopular(filters.page);
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setApiError('Failed to load movies. Please try again.');
    }
  }, [filters, discoverMovies, fetchPopular, fetchTopRated, fetchTrending, fetchNowPlaying, fetchUpcoming]);

  // Initialize user (simulate login - you can replace this with actual auth logic)
  useEffect(() => {
    // Simulate user login - replace with actual auth logic
    const simulateUser = {
      id: 'demo_user',
      displayName: 'Demo User',
      email: 'demo@example.com'
    };
    setUser(simulateUser);
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setFavoriteMovies(new Set());
      setWatchlist(new Set());
    }
  }, [user, loadUserData]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams);
    fetchMoviesWithFilters();
  }, [filters, setSearchParams, fetchMoviesWithFilters]);

  // Get active movies with proper error handling
  const getActiveMovies = () => {
    try {
      if (filters.genre || filters.year || filters.minRating || filters.language || filters.sortBy !== 'popularity.desc') {
        return searchResults?.movies || [];
      }

      switch (filters.category) {
        case 'popular': return popular?.movies || [];
        case 'top_rated': return topRated?.movies || [];
        case 'trending': return trending?.movies || [];
        case 'now_playing': return nowPlaying?.movies || [];
        case 'upcoming': return upcoming?.movies || [];
        default: return popular?.movies || [];
      }
    } catch (error) {
      console.error('Error getting active movies:', error);
      return [];
    }
  };

  // Get movies metadata with proper error handling
  const getMoviesMetadata = () => {
    try {
      if (filters.genre || filters.year || filters.minRating || filters.language || filters.sortBy !== 'popularity.desc') {
        return searchResults || { totalPages: 0, totalResults: 0 };
      }

      switch (filters.category) {
        case 'popular': return popular || { totalPages: 0, totalResults: 0 };
        case 'top_rated': return topRated || { totalPages: 0, totalResults: 0 };
        case 'trending': return trending || { totalPages: 0, totalResults: 0 };
        case 'now_playing': return nowPlaying || { totalPages: 0, totalResults: 0 };
        case 'upcoming': return upcoming || { totalPages: 0, totalResults: 0 };
        default: return popular || { totalPages: 0, totalResults: 0 };
      }
    } catch (error) {
      console.error('Error getting movies metadata:', error);
      return { totalPages: 0, totalResults: 0 };
    }
  };

  // Toggle favorite (using localStorage instead of Firebase)
  const toggleFavorite = useCallback(async (movie) => {
    if (!user) return;

    try {
      // Functional update so the callback identity stays stable across renders.
      setFavoriteMovies((prev) => {
        const next = new Set(prev);
        if (next.has(movie.id)) next.delete(movie.id);
        else next.add(movie.id);
        try {
          localStorage.setItem(`favorites_${user.id}`, JSON.stringify([...next]));
        } catch {
          /* storage unavailable */
        }
        return next;
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setApiError('Failed to update favorites. Please try again.');
    }
  }, [user]);

  // Toggle watchlist (using localStorage instead of Firebase)
  const toggleWatchlist = useCallback(async (movie) => {
    if (!user) return;

    try {
      setWatchlist((prev) => {
        const next = new Set(prev);
        if (next.has(movie.id)) next.delete(movie.id);
        else next.add(movie.id);
        try {
          localStorage.setItem(`watchlist_${user.id}`, JSON.stringify([...next]));
        } catch {
          /* storage unavailable */
        }
        return next;
      });
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      setApiError('Failed to update watchlist. Please try again.');
    }
  }, [user]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      page: 1,
      [key]: value
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      category: 'popular',
      genre: '',
      year: '',
      sortBy: 'popularity.desc',
      page: 1,
      minRating: '',
      language: ''
    });
  };

  // Save user preferences to localStorage
  const saveUserPreferences = async () => {
    if (!user) return;
    
    try {
      const newPrefs = {
        viewMode,
        defaultFilters: filters
      };
      
      localStorage.setItem(`userPreferences_${user.id}`, JSON.stringify(newPrefs));
      
      setApiError('Preferences saved successfully!');
      setTimeout(() => setApiError(null), 3000);
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      setApiError('Failed to save preferences. Please try again.');
    }
  };

  const activeMovies = getActiveMovies();
  const moviesMetadata = getMoviesMetadata();

  // Memoised so cards aren't re-rendered on unrelated state changes (filters, loading flags…).
  const enhancedMovies = useMemo(
    () =>
      activeMovies.map((movie) => ({
        ...movie,
        isFavorite: favoriteMovies.has(movie.id),
        isInWatchlist: watchlist.has(movie.id),
        onToggleFavorite: () => toggleFavorite(movie),
        onToggleWatchlist: () => toggleWatchlist(movie)
      })),
    [activeMovies, favoriteMovies, watchlist, toggleFavorite, toggleWatchlist]
  );

  // Get active filters count for display
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.genre) count++;
    if (filters.year) count++;
    if (filters.minRating) count++;
    if (filters.language) count++;
    if (filters.sortBy !== 'popularity.desc') count++;
    if (filters.category !== 'popular') count++;
    return count;
  };

  // Error Display Component
  const ErrorMessage = ({ message, onDismiss, type = 'error' }) => (
    <div className={`border rounded-lg p-4 mb-4 sm:mb-6 ${
      type === 'error' 
        ? 'bg-red-500/10 border-red-500/20' 
        : 'bg-green-500/10 border-green-500/20'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`flex-1 text-sm sm:text-base ${
          type === 'error' ? 'text-red-400' : 'text-green-400'
        }`}>
          {message}
        </p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={`ui-interactive flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
              type === 'error' 
                ? 'error-dismiss text-red-400'
                : 'success-dismiss text-green-400'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="movies-page min-h-screen bg-[#0A0E1A]">
      <div className="page-container py-8 sm:py-10">
        
        {/* Error Messages */}
        {(error || apiError) && (
          <ErrorMessage 
            message={error || apiError} 
            onDismiss={() => setApiError(null)}
            type={apiError?.includes('successfully') ? 'success' : 'error'}
          />
        )}

        {/* Enhanced Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-5">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#FFC933] sm:text-4xl">
              Discover Movies
            </h1>
            <p className="flex items-center gap-2 text-sm text-[#9AA4BF] sm:text-base">
              <Search className="h-4 w-4" aria-hidden="true" />
              {`${(moviesMetadata?.totalResults || 0).toLocaleString()} movies found`}
            </p>
          </div>

          <div className="filter-toolbar">
            <div className="flex items-center justify-between gap-3">
              <div className="flex rounded-full bg-[#0A0E1A] p-1" role="group" aria-label="Movie view mode">
                    <button
                      type="button"
                      onClick={() => handleViewModeChange('grid')}
                      aria-pressed={viewMode === 'grid'}
                      className={`ui-interactive ui-button flex min-h-11 items-center gap-2 rounded-full px-4 ${
                        viewMode === 'grid'
                          ? 'ui-segment-active bg-[#FFC933] text-[#0A0E1A]'
                          : 'ui-secondary-button text-[#9AA4BF]'
                      }`}
                    >
                      <Grid className="h-4 w-4" aria-hidden="true" />
                      <span className="text-sm font-semibold">Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewModeChange('list')}
                      aria-pressed={viewMode === 'list'}
                      className={`ui-interactive ui-button flex min-h-11 items-center gap-2 rounded-full px-4 ${
                        viewMode === 'list'
                          ? 'ui-segment-active bg-[#FFC933] text-[#0A0E1A]'
                          : 'ui-secondary-button text-[#9AA4BF]'
                      }`}
                    >
                      <List className="h-4 w-4" aria-hidden="true" />
                      <span className="text-sm font-semibold">List</span>
                    </button>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-controls="movie-filters"
                className="ui-interactive ui-button ui-primary-button flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FFC933] px-5 font-semibold text-[#0A0E1A]"
              >
                <Sliders className="h-4 w-4" aria-hidden="true" />
                <span>Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="rounded-full bg-[#0A0E1A]/15 px-2 py-0.5 text-xs">
                    {getActiveFiltersCount()}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

       
{/* Mobile Responsive Filters Panel */}
{showFilters && (
  <div id="movie-filters" className="filter-panel mb-6 sm:mb-8">
    {/* Filters Grid - Responsive layout */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
      {/* Category Filter */}
      <div className="col-span-1">
        <label className="block text-text-primary font-semibold mb-2 text-sm sm:text-base">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="design-select"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Genre Filter */}
      <div className="col-span-1">
        <label className="block text-text-primary font-semibold mb-2 text-sm sm:text-base">
          Genre
        </label>
        <select
          value={filters.genre}
          onChange={(e) => handleFilterChange('genre', e.target.value)}
          className="design-select"
        >
          <option value="">All Genres</option>
          {genres?.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Year Filter */}
      <div className="col-span-1">
        <label className="block text-text-primary font-semibold mb-2 text-sm sm:text-base">
          Year
        </label>
        <select
          value={filters.year}
          onChange={(e) => handleFilterChange('year', e.target.value)}
          className="design-select"
        >
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="col-span-1">
        <label className="block text-text-primary font-semibold mb-2 text-sm sm:text-base">
          Min Rating
        </label>
        <select
          value={filters.minRating}
          onChange={(e) => handleFilterChange('minRating', e.target.value)}
          className="design-select"
        >
          {ratings.map(rating => (
            <option key={rating.value} value={rating.value}>
              {rating.label}
            </option>
          ))}
        </select>
      </div>

      {/* Language Filter */}
      <div className="col-span-1">
        <label className="block text-text-primary font-semibold mb-2 text-sm sm:text-base">
          Language
        </label>
        <select
          value={filters.language}
          onChange={(e) => handleFilterChange('language', e.target.value)}
          className="design-select"
        >
          {languages.map(language => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Filter */}
      <div className="col-span-1">
        <label className="block text-text-primary font-semibold mb-2 text-sm sm:text-base">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="design-select"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Filter Actions - Stack on mobile, row on larger screens */}
    <div className="mt-4 pt-4 border-t border-surface-tertiary">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <button
          onClick={clearFilters}
          className="ui-interactive ui-text-button py-2 text-center text-sm font-semibold text-[#FFC933] sm:py-0 sm:text-left sm:text-base"
        >
          Clear All Filters
        </button>
        
        {user && (
          <button
            onClick={saveUserPreferences}
            className="ui-interactive ui-text-button py-2 text-center text-sm font-semibold text-[#FFC933] sm:py-0 sm:text-right sm:text-base"
          >
            Save as Default
          </button>
        )}
      </div>
    </div>
  </div>
)}

        {/* Movies Grid */}
        {loading?.search || isLoadingUserData ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-text-secondary">Loading movies...</p>
            </div>
          </div>
        ) : (
          <>
            {enhancedMovies.length > 0 ? (
              <MovieGrid movies={enhancedMovies} viewMode={viewMode} />
            ) : (
              <div className="text-center py-20">
                <p className="text-text-secondary text-lg">No movies found with current filters.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ui-interactive ui-text-button mt-4 font-semibold text-[#FFC933]"
                >
                  Clear Filters
                </button>
              </div>
            )}
            {/* Pagination */}
            <Pagination
              currentPage={filters.page}
              totalPages={moviesMetadata?.totalPages || 0}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;