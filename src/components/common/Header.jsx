import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import tmdbAPI from '../../api/tmdbAPI';
import {
  Clock,
  CornerDownLeft,
  Film,
  Grid3X3,
  Home,
  Menu,
  Search,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/movies', label: 'Movies', icon: Grid3X3 },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const isHome = location.pathname === '/';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('movieMaze_recentSearches');
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
    setShowSearchDropdown(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen) mobileInputRef.current?.focus();
  }, [isMobileSearchOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const typingInField = ['INPUT', 'TEXTAREA'].includes(event.target.tagName);
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typingInField)) {
        event.preventDefault();
        if (window.matchMedia('(max-width: 640px)').matches) {
          setIsMobileSearchOpen(true);
          setTimeout(() => mobileInputRef.current?.focus(), 0);
        } else {
          desktopInputRef.current?.focus();
        }
      }
      if (event.key === 'Escape') {
        setShowSearchDropdown(false);
        setIsMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => () => clearTimeout(searchTimeoutRef.current), []);

  const performSearch = useCallback(async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const response = await tmdbAPI.searchMovies(query, 1);
      setSearchResults(response.results.slice(0, 6));
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowSearchDropdown(true);
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => performSearch(query), 300);
  };

  const executeSearch = useCallback((query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((previous) => {
      const next = [trimmed, ...previous.filter((item) => item !== trimmed)].slice(0, 5);
      try {
        localStorage.setItem('movieMaze_recentSearches', JSON.stringify(next));
      } catch {
        return next;
      }
      return next;
    });
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  }, [navigate]);

  const handleSearch = (event) => {
    event.preventDefault();
    executeSearch(searchQuery);
  };

  const handleMovieSelect = (movie) => {
    navigate(`/movie/${movie.id}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('movieMaze_recentSearches');
    } catch {
      setRecentSearches([]);
    }
  };

  const isActivePath = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const renderSearchField = (inputRef) => (
    <form onSubmit={handleSearch} className="nav-search relative w-full">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA4BF]" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setShowSearchDropdown(true)}
        aria-label="Search movies"
        className="h-11 w-full rounded-full border border-[#232C48] bg-[#131A2E]/90 pl-10 pr-10 text-sm text-[#F4F6FB] placeholder:text-[#9AA4BF] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[#232C48] px-1.5 py-0.5 text-[10px] text-[#9AA4BF] min-[641px]:block">/</kbd>
    </form>
  );

  return (
    <header
      ref={headerRef}
      className={`${
        isHome && !isScrolled ? 'absolute' : 'fixed'
      } left-0 right-0 top-0 z-50 border-b transition-colors duration-200 ${
        isHome && !isScrolled
          ? 'border-transparent bg-gradient-to-b from-[#0A0E1A]/90 to-transparent'
          : 'border-[#1B2238] bg-[#0A0E1A]'
      }`}
    >
      <div className="page-container">
        <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-3 min-[641px]:grid-cols-[1fr_auto_1fr]">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Movie Maze home">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFC933] text-[#0A0E1A]">
              <Film className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="truncate text-lg font-bold text-[#F4F6FB]">Movie Maze</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-[#1B2238] bg-[#131A2E]/90 p-1 min-[641px]:flex" aria-label="Main navigation">
            {NAV_ITEMS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                aria-current={isActivePath(to) ? 'page' : undefined}
                className={`nav-link ui-interactive flex min-h-9 items-center rounded-full px-5 text-sm font-semibold ${
                  isActivePath(to)
                    ? 'bg-[#FFC933] text-[#0A0E1A]'
                    : 'text-[#B9C1D9]'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden w-[190px] justify-self-end min-[1025px]:w-[210px] min-[641px]:block">
            {renderSearchField(desktopInputRef)}
            {showSearchDropdown && (
              <div ref={searchDropdownRef} className="absolute right-[max(16px,calc((100vw-1280px)/2))] top-[calc(100%-2px)] z-50 mt-2 max-h-96 w-[min(360px,calc(100vw-32px))] overflow-y-auto rounded-2xl border border-[#232C48] bg-[#131A2E] p-2 shadow-2xl">
                {searchQuery.length >= 2 && (
                  isSearching ? (
                    <p className="p-5 text-center text-sm text-[#9AA4BF]">Searching...</p>
                  ) : searchResults.length ? (
                    <>
                      {searchResults.map((movie) => (
                        <button key={movie.id} type="button" onClick={() => handleMovieSelect(movie)} className="header-search-result ui-interactive flex min-h-14 w-full items-center gap-3 rounded-xl p-2 text-left">
                          <span className="flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-[#0E1424]">
                            {movie.poster_path ? (
                              <img src={tmdbAPI.getPosterUrl(movie.poster_path, 'w92')} alt="" className="h-full w-full object-cover" />
                            ) : <Film className="h-4 w-4 text-[#9AA4BF]" />}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-[#F4F6FB]">{movie.title}</span>
                            <span className="block text-xs text-[#9AA4BF]">{movie.release_date?.slice(0, 4) || 'TBA'}</span>
                          </span>
                        </button>
                      ))}
                      <button type="button" onClick={() => executeSearch(searchQuery)} className="header-search-result ui-interactive flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-[#FFC933]">
                        View all results <CornerDownLeft className="h-4 w-4" />
                      </button>
                    </>
                  ) : <p className="p-5 text-center text-sm text-[#9AA4BF]">No movies found</p>
                )}
                {searchQuery.length < 2 && recentSearches.length > 0 && (
                  <>
                    <div className="flex items-center justify-between px-3 py-2 text-xs text-[#9AA4BF]">
                      <span>Recent searches</span>
                      <button type="button" onClick={clearRecentSearches} className="header-search-clear ui-interactive min-h-8 px-2">Clear</button>
                    </div>
                    {recentSearches.map((search) => (
                      <button key={search} type="button" onClick={() => executeSearch(search)} className="header-search-result ui-interactive flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm text-[#F4F6FB]">
                        <Clock className="h-4 w-4 text-[#9AA4BF]" />{search}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 min-[641px]:hidden">
            <button
              type="button"
              onClick={() => { setIsMobileSearchOpen((open) => !open); setIsMenuOpen(false); }}
              className="mobile-nav-button ui-interactive flex h-11 w-11 items-center justify-center rounded-full border border-[#1B2238] bg-[#131A2E] text-[#F4F6FB]"
              aria-label={isMobileSearchOpen ? 'Close search' : 'Open search'}
              aria-expanded={isMobileSearchOpen}
            >
              {isMobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => { setIsMenuOpen((open) => !open); setIsMobileSearchOpen(false); }}
              className="mobile-nav-button ui-interactive flex h-11 w-11 items-center justify-center rounded-full border border-[#1B2238] bg-[#131A2E] text-[#F4F6FB]"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="border-t border-[#1B2238] bg-[#0A0E1A] px-4 py-3 min-[641px]:hidden">
          {renderSearchField(mobileInputRef)}
          {showSearchDropdown && searchQuery.length >= 2 && (
            <div className="mt-2 max-h-72 overflow-y-auto rounded-2xl border border-[#232C48] bg-[#131A2E] p-2">
              {isSearching ? <p className="p-4 text-center text-sm text-[#9AA4BF]">Searching...</p> : searchResults.map((movie) => (
                <button key={movie.id} type="button" onClick={() => handleMovieSelect(movie)} className="header-search-result ui-interactive flex min-h-14 w-full items-center gap-3 rounded-xl p-2 text-left">
                  <span className="flex h-12 w-9 items-center justify-center overflow-hidden rounded bg-[#0E1424]">
                    {movie.poster_path && <img src={tmdbAPI.getPosterUrl(movie.poster_path, 'w92')} alt="" className="h-full w-full object-cover" />}
                  </span>
                  <span className="truncate text-sm text-[#F4F6FB]">{movie.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isMenuOpen && (
        <nav className="border-t border-[#1B2238] bg-[#0A0E1A] p-3 min-[641px]:hidden" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              aria-current={isActivePath(to) ? 'page' : undefined}
              className={`mobile-menu-link ui-interactive flex min-h-11 items-center gap-3 rounded-xl px-4 font-medium ${
                isActivePath(to) ? 'bg-[#FFC933] text-[#0A0E1A]' : 'text-[#B9C1D9]'
              }`}
            >
              <Icon className="h-5 w-5" />{label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
