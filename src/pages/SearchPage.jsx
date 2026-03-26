// pages/SearchPage.js - FIXED VERSION
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useMovies } from '../contexts/MovieContext';
import useDebounce from '../hooks/useDebounce';
import MovieGrid from '../components/movie/MovieGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    searchMovies, 
    discoverMovies, 
    fetchGenres, // FIXED: Changed from getGenres to fetchGenres
    loading,
    error,
    clearError,
    genres // FIXED: Access genres from state
  } = useMovies();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [minRating, setMinRating] = useState('');
  const [releaseYear, setReleaseYear] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Load genres on component mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        await fetchGenres(); // FIXED: Use fetchGenres from context
      } catch (err) {
        console.error('Failed to load genres:', err);
        setLocalError('Failed to load movie genres');
      }
    };
    
    if (genres.length === 0) { // Only load if not already loaded
      loadGenres();
    }
  }, [fetchGenres, genres.length]);

  // Clear context errors when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search or discover movies
  const searchMoviesFn = useCallback(async (query, page = 1, filters = {}) => {
    setLocalLoading(true);
    setLocalError(null);
    
    try {
      let result;
      
      if (query.trim()) {
        // Search with query - ignore filters for text search
        result = await searchMovies(query, page);
      } else {
        // Discover with filters
        const discoverFilters = {
          page,
          sort_by: filters.sortBy || sortBy,
          with_genres: filters.genres?.length ? filters.genres.join(',') : undefined,
          'vote_average.gte': filters.minRating || undefined,
          primary_release_year: filters.releaseYear || undefined,
        };

        // Remove undefined values
        Object.keys(discoverFilters).forEach(key => {
          if (discoverFilters[key] === undefined) {
            delete discoverFilters[key];
          }
        });

        result = await discoverMovies(discoverFilters);
      }
      
      // FIXED: Handle the result structure correctly
      if (result.success && result.data) {
        const response = result.data;
        
        if (page === 1) {
          setMovies(response.results || []);
        } else {
          setMovies(prev => [...prev, ...(response.results || [])]);
        }
        
        setTotalPages(response.total_pages || 1);
        setTotalResults(response.total_results || 0);
        setCurrentPage(page);
      } else {
        throw new Error(result.error || 'Failed to load movies');
      }
    } catch (err) {
      setLocalError('Failed to load movies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLocalLoading(false);
    }
  }, [searchMovies, discoverMovies, sortBy]);

  // Effect for search query and filter changes
  useEffect(() => {
    // Update URL params
    if (debouncedSearchQuery !== searchParams.get('q')) {
      if (debouncedSearchQuery) {
        setSearchParams({ q: debouncedSearchQuery });
      } else {
        setSearchParams({});
      }
    }
    
    // Perform search/discovery
    searchMoviesFn(debouncedSearchQuery, 1, {
      sortBy,
      genres: selectedGenres,
      minRating,
      releaseYear
    });
  }, [debouncedSearchQuery, sortBy, selectedGenres, minRating, releaseYear, searchParams, setSearchParams, searchMoviesFn]);

  // Handle load more
  const handleLoadMore = () => {
    if (currentPage < totalPages && !localLoading && !loading.search) {
      searchMoviesFn(debouncedSearchQuery, currentPage + 1, {
        sortBy,
        genres: selectedGenres,
        minRating,
        releaseYear
      });
    }
  };

  // Handle genre toggle
  const toggleGenre = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('popularity.desc');
    setMinRating('');
    setReleaseYear('');
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Reset to first page when search changes
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedGenres.length > 0 || sortBy !== 'popularity.desc' || minRating || releaseYear;
  const activeFilterCount = selectedGenres.length + 
    (sortBy !== 'popularity.desc' ? 1 : 0) + 
    (minRating ? 1 : 0) + 
    (releaseYear ? 1 : 0);

  // FIXED: Combine loading states properly
  const isLoading = localLoading || loading.search;
  const displayError = localError || error;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-text-primary">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Movies'}
        </h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3.5 bg-surface-secondary border border-surface-tertiary/60 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-primary/70 focus:ring-2 focus:ring-brand-primary/15 transition-all shadow-sm hover:border-surface-interactive"
          />
        </div>

        {/* Filter Toggle and Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg text-text-secondary hover:text-text-primary hover:border-brand-primary transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-brand-primary text-surface-primary text-xs px-2 py-1 rounded-full font-medium">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}

            {/* Results count */}
            {totalResults > 0 && (
              <span className="text-sm text-text-tertiary">
                {totalResults.toLocaleString()} results
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8 p-6 bg-surface-secondary/60 backdrop-blur-sm rounded-2xl border border-surface-tertiary/50 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-surface-tertiary border border-surface-interactive rounded-md text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="popularity.asc">Least Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="vote_average.asc">Lowest Rated</option>
                <option value="release_date.desc">Newest First</option>
                <option value="release_date.asc">Oldest First</option>
                <option value="title.asc">Title A-Z</option>
                <option value="title.desc">Title Z-A</option>
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Minimum Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2 bg-surface-tertiary border border-surface-interactive rounded-md text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              >
                <option value="">Any Rating</option>
                <option value="9">9+ Excellent</option>
                <option value="8">8+ Very Good</option>
                <option value="7">7+ Good</option>
                <option value="6">6+ Decent</option>
                <option value="5">5+ Average</option>
              </select>
            </div>

            {/* Release Year */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Release Year
              </label>
              <select
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                className="w-full px-3 py-2 bg-surface-tertiary border border-surface-interactive rounded-md text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              >
                <option value="">Any Year</option>
                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Genres ({selectedGenres.length} selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedGenres.includes(genre.id)
                        ? 'bg-brand-primary text-surface-primary border-brand-primary'
                        : 'bg-surface-tertiary border-surface-interactive text-text-secondary hover:border-brand-primary hover:text-brand-primary'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {displayError && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-error mb-2">
            Something went wrong
          </h2>
          <p className="text-text-secondary mb-4">{displayError}</p>
          <button
            onClick={() => {
              setLocalError(null);
              clearError();
              searchMoviesFn(debouncedSearchQuery, 1, {
                sortBy,
                genres: selectedGenres,
                minRating,
                releaseYear
              });
            }}
            className="px-4 py-2 bg-brand-primary text-surface-primary rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!displayError && !isLoading && movies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            {searchQuery ? 'No movies found' : 'Start discovering movies'}
          </h2>
          <p className="text-text-secondary">
            {searchQuery 
              ? 'Try adjusting your search terms or filters'
              : 'Use the search bar above or apply filters to find movies'
            }
          </p>
        </div>
      )}

      {/* Results */}
      {movies.length > 0 && (
        <>
          <MovieGrid movies={movies} />
          
          {/* Load More Button */}
          {currentPage < totalPages && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-6 py-3 bg-brand-primary text-surface-primary rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : `Load More Movies (${currentPage}/${totalPages})`}
              </button>
            </div>
          )}
        </>
      )}

      {/* Loading Spinner */}
      {isLoading && movies.length === 0 && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  );
};

export default SearchPage;