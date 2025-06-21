// ✅ Enhanced MoviesPage.jsx - Improved Responsive Design & UX
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovies } from '../contexts/MovieContext';
import MovieGrid from '../components/movie/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  Heart, 
  Bookmark, 
  User, 
  X,
  Search,
  Sliders,
  Star,
  Calendar,
  Globe
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
  const [authLoading, setAuthLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'popular',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    sortBy: searchParams.get('sortBy') || 'popularity.desc',
    page: parseInt(searchParams.get('page')) || 1,
    minRating: searchParams.get('minRating') || '',
    language: searchParams.get('language') || 'en'
  });

  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState(new Set());
  const [watchlist, setWatchlist] = useState(new Set());
  const [userPreferences, setUserPreferences] = useState(null);
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
        setUserPreferences(prefs);
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
      
      if (filters.genre || filters.year || filters.minRating || filters.language !== 'en' || filters.sortBy !== 'popularity.desc') {
        const discoverParams = {
          page: filters.page,
          sortBy: filters.sortBy,
          year: filters.year,
          language: filters.language,
          minRating: filters.minRating
        };

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
    if (user && !authLoading) {
      loadUserData();
    } else if (!user) {
      setUserPreferences(null);
      setFavoriteMovies(new Set());
      setWatchlist(new Set());
    }
  }, [user, authLoading, loadUserData]);

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
      if (filters.genre || filters.year || filters.minRating || filters.language !== 'en' || filters.sortBy !== 'popularity.desc') {
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
      if (filters.genre || filters.year || filters.minRating || filters.language !== 'en' || filters.sortBy !== 'popularity.desc') {
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
  const toggleFavorite = async (movie) => {
    if (!user) return;
    
    try {
      const newFavorites = new Set(favoriteMovies);
      
      if (favoriteMovies.has(movie.id)) {
        newFavorites.delete(movie.id);
      } else {
        newFavorites.add(movie.id);
      }
      
      setFavoriteMovies(newFavorites);
      
      // Save to localStorage
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify([...newFavorites]));
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setApiError('Failed to update favorites. Please try again.');
    }
  };

  // Toggle watchlist (using localStorage instead of Firebase)
  const toggleWatchlist = async (movie) => {
    if (!user) return;
    
    try {
      const newWatchlist = new Set(watchlist);
      
      if (watchlist.has(movie.id)) {
        newWatchlist.delete(movie.id);
      } else {
        newWatchlist.add(movie.id);
      }
      
      setWatchlist(newWatchlist);
      
      // Save to localStorage
      localStorage.setItem(`watchlist_${user.id}`, JSON.stringify([...newWatchlist]));
      
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      setApiError('Failed to update watchlist. Please try again.');
    }
  };

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
      language: 'en'
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
      
      setUserPreferences(newPrefs);
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

  const enhancedMovies = activeMovies.map(movie => ({
    ...movie,
    isFavorite: favoriteMovies.has(movie.id),
    isInWatchlist: watchlist.has(movie.id),
    onToggleFavorite: () => toggleFavorite(movie),
    onToggleWatchlist: () => toggleWatchlist(movie)
  }));

  // Get active filters count for display
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.genre) count++;
    if (filters.year) count++;
    if (filters.minRating) count++;
    if (filters.language !== 'en') count++;
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
            onClick={onDismiss}
            className={`flex-shrink-0 p-1 rounded-full hover:bg-opacity-20 transition-colors ${
              type === 'error' 
                ? 'text-red-400 hover:bg-red-500' 
                : 'text-green-400 hover:bg-green-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-primary via-surface-primary to-surface-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* Error Messages */}
        {(error || apiError) && (
          <ErrorMessage 
            message={error || apiError} 
            onDismiss={() => setApiError(null)}
            type={apiError?.includes('successfully') ? 'success' : 'error'}
          />
        )}

        {/* Enhanced Header Section */}
        <div className="mb-8 sm:mb-12">
          {/* Main Header */}
          <div className="text-center sm:text-left mb-6 sm:mb-8">
            <div className="relative">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-brand-primary via-yellow-400 to-orange-500 bg-clip-text text-transparent mb-3 sm:mb-4">
                Discover Movies
              </h1>
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 text-2xl sm:text-4xl animate-pulse">
                🎬
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 sm:gap-6 text-text-secondary">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-sm sm:text-base lg:text-lg">
                  {moviesMetadata?.totalResults ? 
                    `${moviesMetadata.totalResults.toLocaleString()} movies found` : 
                    'Explore our vast collection'
                  }
                </p>
              </div>
              
              {user && (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-text-secondary/80">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base truncate max-w-48">
                    Welcome, {user.displayName || user.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Control Bar */}
          <div className="bg-surface-secondary/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-surface-interactive/20">
            <div className="flex flex-col lg:flex-row  lg:justify-between gap-4 lg:gap-6">
              
              {/* User Stats & View Mode - Mobile: Stack, Desktop: Row */}
              <div className="flex flex-col sm:flex-row  gap-4 sm:gap-6">
                {/* User Stats */}
                {user && !isLoadingUserData && (
                  <div className="flex sm:justify-start gap-4 sm:gap-6">
                    <div className="flex items-center gap-2 bg-red-500/10 rounded-full px-3 py-1.5 border border-red-500/20">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-semibold text-red-400">{favoriteMovies.size}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/10 rounded-full px-3 py-1.5 border border-blue-500/20">
                      <Bookmark className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-blue-400">{watchlist.size}</span>
                    </div>
                  </div>
                )}

                {/* View Mode Toggle */}
                <div className="flex  justify-start">
                  <div className="flex bg-surface-tertiary rounded-xl p-1 border border-surface-interactive/30">
                    <button
                      onClick={() => handleViewModeChange('grid')}
                      className={`flex  gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-brand-primary text-surface-primary shadow-lg scale-105' 
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:inline">Grid</span>
                    </button>
                    <button
                      onClick={() => handleViewModeChange('list')}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-brand-primary text-surface-primary shadow-lg scale-105' 
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      <List className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:inline">List</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-brand-primary to-yellow-500 hover:from-yellow-500 hover:to-brand-primary text-surface-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <Sliders className="w-5 h-5" />
                <span>Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

       
{/* Mobile Responsive Filters Panel */}
{showFilters && (
  <div className="bg-surface-secondary rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
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
          className="w-full bg-surface-tertiary text-text-primary border border-surface-interactive rounded-lg px-3 py-2.5 sm:py-2 focus:outline-none focus:border-brand-primary text-sm sm:text-base"
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
          className="w-full bg-surface-tertiary text-text-primary border border-surface-interactive rounded-lg px-3 py-2.5 sm:py-2 focus:outline-none focus:border-brand-primary text-sm sm:text-base"
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
          className="w-full bg-surface-tertiary text-text-primary border border-surface-interactive rounded-lg px-3 py-2.5 sm:py-2 focus:outline-none focus:border-brand-primary text-sm sm:text-base"
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
          className="w-full bg-surface-tertiary text-text-primary border border-surface-interactive rounded-lg px-3 py-2.5 sm:py-2 focus:outline-none focus:border-brand-primary text-sm sm:text-base"
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
          className="w-full bg-surface-tertiary text-text-primary border border-surface-interactive rounded-lg px-3 py-2.5 sm:py-2 focus:outline-none focus:border-brand-primary text-sm sm:text-base"
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
          className="w-full bg-surface-tertiary text-text-primary border border-surface-interactive rounded-lg px-3 py-2.5 sm:py-2 focus:outline-none focus:border-brand-primary text-sm sm:text-base"
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
          className="text-brand-primary hover:text-yellow-500 font-semibold transition-colors text-center sm:text-left text-sm sm:text-base py-2 sm:py-0"
        >
          Clear All Filters
        </button>
        
        {user && (
          <button
            onClick={saveUserPreferences}
            className="text-blue-500 hover:text-blue-400 font-semibold transition-colors text-center sm:text-right text-sm sm:text-base py-2 sm:py-0"
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
                  onClick={clearFilters}
                  className="mt-4 text-brand-primary hover:text-yellow-500 font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {moviesMetadata?.totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-4 py-2 rounded-lg bg-surface-secondary text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-tertiary transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, moviesMetadata.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(
                      moviesMetadata.totalPages - 4,
                      filters.page - 2
                    )) + i;
                    
                    if (pageNum > moviesMetadata.totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          pageNum === filters.page
                            ? 'bg-brand-primary text-surface-primary'
                            : 'bg-surface-secondary text-text-primary hover:bg-surface-tertiary'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === moviesMetadata.totalPages}
                  className="px-4 py-2 rounded-lg bg-surface-secondary text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-tertiary transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;