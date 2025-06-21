// components/common/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import tmdbAPI from '../../api/tmdbAPI';
import { 
  Search, 
  Menu, 
  X, 
  Film,
  Home,
  Grid3X3,
  Clock,
  TrendingUp,
  Loader2
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('movieMaze_recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && 
          !searchDropdownRef.current.contains(event.target) &&
          !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowSearchDropdown(false);
  }, [location]);

  // Debounced search function
  const performSearch = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await tmdbAPI.searchMovies(query, 1);
      setSearchResults(response.results.slice(0, 6)); // Limit to 6 results
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Show dropdown when user starts typing
    if (query.length > 0) {
      setShowSearchDropdown(true);
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSearch(searchQuery.trim());
    }
  };

  // Execute search and save to recent searches
  const executeSearch = (query) => {
    // Add to recent searches
    const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('movieMaze_recentSearches', JSON.stringify(updatedRecent));
    
    // Navigate to search results
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  // Handle movie selection from dropdown
  const handleMovieSelect = (movie) => {
    navigate(`/movie/${movie.id}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  // Handle recent search selection
  const handleRecentSearchSelect = (query) => {
    setSearchQuery(query);
    executeSearch(query);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('movieMaze_recentSearches');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, className = '', ...props }) => (
    <Link
      to={to}
      className={`transition-colors duration-200 hover:text-brand-primary ${
        isActivePath(to) ? 'text-brand-primary' : 'text-text-secondary'
      } ${className}`}
      {...props}
    >
      {children}
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-primary/95 backdrop-blur-xl border-b border-surface-tertiary/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-brand-primary to-yellow-500 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-lg">
              <Film className="w-6 h-6 text-surface-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-text-primary to-brand-primary bg-clip-text text-transparent group-hover:from-brand-primary group-hover:to-yellow-500 transition-all duration-200">
              Movie Maze
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-surface-secondary/50 transition-all duration-200">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/movies" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-surface-secondary/50 transition-all duration-200">
              <Grid3X3 className="w-4 h-4" />
              <span>Movies</span>
            </NavLink>
          </nav>

          {/* Enhanced Search Bar */}
          <div className="hidden sm:block flex-1 max-w-lg mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-brand-primary transition-colors duration-200" />
                {isSearching && (
                  <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-primary animate-spin" />
                )}
                <input
                  type="text"
                  placeholder="Search movies, actors, directors..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="w-full pl-12 pr-12 py-3 bg-surface-secondary/80 border border-surface-tertiary/50 rounded-xl 
                           text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-primary 
                           focus:ring-2 focus:ring-brand-primary/20 focus:bg-surface-secondary transition-all duration-200
                           backdrop-blur-sm shadow-sm hover:shadow-md"
                />
              </div>
            </form>

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div 
                ref={searchDropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-surface-secondary/95 backdrop-blur-xl border border-surface-tertiary/50 
                         rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50 animate-fade-in"
              >
                {/* Search Results */}
                {searchQuery.length >= 2 && (
                  <div className="p-2">
                    {isSearching ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                        <span className="ml-2 text-text-secondary">Searching...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="px-3 py-2 text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                          Search Results
                        </div>
                        {searchResults.map((movie) => (
                          <button
                            key={movie.id}
                            onClick={() => handleMovieSelect(movie)}
                            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-tertiary/50 
                                     transition-colors duration-200 text-left group"
                          >
                            <div className="flex-shrink-0 w-12 h-16 bg-surface-tertiary rounded-md overflow-hidden">
                              {movie.poster_path ? (
                                <img
                                  src={tmdbAPI.getPosterUrl(movie.poster_path, 'w154')}
                                  alt={movie.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-tertiary to-surface-secondary">
                                  <Film className="w-6 h-6 text-text-tertiary" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-text-primary truncate group-hover:text-brand-primary transition-colors duration-200">
                                {movie.title}
                              </p>
                              <p className="text-sm text-text-secondary truncate">
                                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                                {movie.vote_average > 0 && (
                                  <span className="ml-2">★ {movie.vote_average.toFixed(1)}</span>
                                )}
                              </p>
                            </div>
                          </button>
                        ))}
                        <button
                          onClick={() => executeSearch(searchQuery)}
                          className="w-full mt-2 p-3 text-center text-brand-primary hover:bg-surface-tertiary/50 
                                   rounded-lg transition-colors duration-200 font-medium"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </>
                    ) : searchQuery.length >= 2 ? (
                      <div className="p-8 text-center text-text-secondary">
                        <Search className="w-12 h-12 mx-auto mb-3 text-text-tertiary" />
                        <p>No movies found for "{searchQuery}"</p>
                        <p className="text-sm mt-1">Try a different search term</p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Recent Searches */}
                {searchQuery.length < 2 && recentSearches.length > 0 && (
                  <div className="p-2 border-t border-surface-tertiary/30">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                        Recent Searches
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-text-tertiary hover:text-text-secondary transition-colors duration-200"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchSelect(search)}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-tertiary/50 
                                 transition-colors duration-200 text-left group"
                      >
                        <Clock className="w-4 h-4 text-text-tertiary group-hover:text-brand-primary transition-colors duration-200" />
                        <span className="text-text-secondary group-hover:text-text-primary transition-colors duration-200">
                          {search}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                {searchQuery.length < 2 && (
                  <div className="p-2 border-t border-surface-tertiary/30">
                    <div className="px-3 py-2 text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                      Quick Actions
                    </div>
                    <Link
                      to="/movies?sort=trending"
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-tertiary/50 
                               transition-colors duration-200 text-left group"
                      onClick={() => setShowSearchDropdown(false)}
                    >
                      <TrendingUp className="w-4 h-4 text-text-tertiary group-hover:text-brand-primary transition-colors duration-200" />
                      <span className="text-text-secondary group-hover:text-text-primary transition-colors duration-200">
                        Trending Movies
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-secondary/50 transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-brand-primary transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 bg-surface-secondary/80 border border-surface-tertiary/50 rounded-xl 
                         text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-primary 
                         focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface-secondary/95 backdrop-blur-xl border-t border-surface-tertiary/50 animate-slide-down">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <NavLink 
              to="/" 
              className="flex items-center space-x-3 py-3 px-4 rounded-xl hover:bg-surface-tertiary/50 transition-all duration-200 group"
            >
              <Home className="w-5 h-5 group-hover:text-brand-primary transition-colors duration-200" />
              <span>Home</span>
            </NavLink>
            <NavLink 
              to="/movies" 
              className="flex items-center space-x-3 py-3 px-4 rounded-xl hover:bg-surface-tertiary/50 transition-all duration-200 group"
            >
              <Grid3X3 className="w-5 h-5 group-hover:text-brand-primary transition-colors duration-200" />
              <span>Movies</span>
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;