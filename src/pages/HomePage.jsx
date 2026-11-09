import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SectionHeader from '../components/common/SectionHeader';
import MovieCard from '../components/movie/MovieCard';
import GenreBrowser from '../components/home/GenreBrowser';
import HeroSection from '../components/home/HeroSection';
import tmdbAPI from '../api/tmdbAPI';

const HomePage = () => {
  const navigate = useNavigate();
  
  // State management
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [heroMovies, setHeroMovies] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
  // Mock user state (replace with your actual auth solution)
  const [user, setUser] = useState(null);

  // Fetch movies data
  const fetchMoviesData = async () => {
    try {
      setError(null);
      
      // Fetch all movie categories + genre list concurrently
      const [trendingData, popularData, topRatedData, genreData] = await Promise.all([
        tmdbAPI.getTrending("movie", "week"),
        tmdbAPI.getPopular(1),
        tmdbAPI.getTopRated(1),
        tmdbAPI.getGenres(),
      ]);

      // Build a quick id→name map for genres
      const genreMap = {};
      (genreData.genres || []).forEach(g => { genreMap[g.id] = g.name; });

      // Update state with fetched data
      setTrendingMovies(trendingData.results || []);
      setPopularMovies(popularData.results || []);
      setTopRatedMovies(topRatedData.results || []);

      // Set hero movies from trending — enrich with genres objects
      if (trendingData.results && trendingData.results.length > 0) {
        const enriched = trendingData.results.map(movie => ({
          ...movie,
          genres: (movie.genre_ids || []).map(id => ({ id, name: genreMap[id] })).filter(g => g.name),
        }));
        setHeroMovies(enriched);
      }

    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
      setIsLoadingInitial(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMoviesData();
  }, []);

  // Handle authentication required actions
  const handleAuthRequired = () => {
    if (!user) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  // Handle add to watchlist/favorites
  const handleAddToList = async (movieId) => {
    if (!handleAuthRequired()) return;
    
    try {
      // TODO: Implement add to watchlist functionality with your chosen backend
      console.log('Adding movie to watchlist:', movieId);
      // You can implement localStorage, API calls, or other storage here
      
      // Example with localStorage:
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      if (!watchlist.includes(movieId)) {
        watchlist.push(movieId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        console.log('Movie added to watchlist successfully');
      }
    } catch (err) {
      console.error('Error adding movie to list:', err);
    }
  };

  // Handle add to favorites
  const handleAddToFavorites = async (movieId) => {
    if (!handleAuthRequired()) return;
    
    try {
      // TODO: Implement add to favorites functionality with your chosen backend
      console.log('Adding movie to favorites:', movieId);
      // You can implement localStorage, API calls, or other storage here
      
      // Example with localStorage:
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (!favorites.includes(movieId)) {
        favorites.push(movieId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log('Movie added to favorites successfully');
      }
    } catch (err) {
      console.error('Error adding movie to favorites:', err);
    }
  };

  // Handle watch now action
  const handleWatchNow = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  // Handle navigation
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Retry loading movies
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchMoviesData();
  };

  // Mock login function (replace with your actual auth implementation)
  const handleLogin = () => {
    // This is just a mock - implement your actual authentication here
    setUser({ id: 'mock-user', email: 'user@example.com' });
    setShowAuthModal(false);
  };

  // Loading state
  if (isLoadingInitial && loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface-primary flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-text-secondary">Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !trendingMovies.length) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface-primary flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button 
            onClick={handleRetry}
            className="ui-interactive ui-button ui-primary-button rounded-full bg-[#FFC933] px-6 py-3 font-semibold text-[#0A0E1A]"
          >
            Try Again
          </button> 
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Hero Section */}
      {heroMovies.length > 0 && (
        <HeroSection 
          movies={heroMovies}
          onWatchNow={handleWatchNow}
          onAddToWatchlist={handleAddToList}
          onAddToFavorites={handleAddToFavorites}
          onNavigate={handleNavigate}
        />
      )}

      {/* Movie Sections */}
      <div className="home-sections page-container space-y-10 py-8 sm:py-10">
        {trendingMovies.length > 0 && (
          <section>
            <SectionHeader title="Top 5 Today" to="/movies?category=trending" />
            <div className="top-five-grid">
              {trendingMovies.slice(0, 5).map((movie, index) => (
                <div key={movie.id} className="top-five-item">
                  <span className="rank-outline" aria-hidden="true">{index + 1}</span>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </section>
        )}

        {popularMovies.length > 0 && (
          <section>
            <SectionHeader title="Popular Right Now" to="/movies?category=popular" />
            <div className="popular-grid">
              {popularMovies.slice(0, 5).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        <div className="home-discovery-grid">
          {topRatedMovies.length > 0 && (
            <section className="min-w-0">
              <SectionHeader title="Top Rated" to="/movies?category=top_rated" />
              <ol className="leaderboard-panel">
                {topRatedMovies.slice(0, 5).map((movie, index) => (
                  <li key={movie.id} className="leaderboard-list-item">
                    <Link to={`/movie/${movie.id}`} className="leaderboard-row ui-interactive">
                    <span className="leaderboard-rank">{index + 1}</span>
                    <span className="leaderboard-poster">
                      {movie.poster_path ? (
                        <img
                          src={tmdbAPI.getPosterUrl(movie.poster_path, 'w92')}
                          alt={`${movie.title} poster`}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="poster-placeholder flex h-full items-center justify-center px-1 text-center text-[8px] text-[#9AA4BF]">{movie.title}</span>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="leaderboard-row-title truncate text-sm font-semibold text-[#F4F6FB]">{movie.title}</p>
                      <p className="text-xs text-[#9AA4BF]">{movie.release_date?.slice(0, 4) || 'TBA'}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-[#FFC933]">★ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <GenreBrowser
            onGenreClick={(genreId) => navigate(`/movies?genre=${genreId}`)}
          />
        </div>

        {/* Loading indicator for additional content */}
        {loading && trendingMovies.length > 0 && (
          <div className="text-center py-8">
            <LoadingSpinner size="md" />
          </div>
        )}
      </div>

      {/* Simple Auth Modal (replace AuthModal component) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-secondary p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-text-primary mb-4">Sign In</h3>
            <p className="text-text-secondary mb-6">
              Sign in to create watchlists and mark your favorite movies.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="ui-interactive ui-button ui-primary-button w-full rounded-full bg-[#FFC933] py-3 font-semibold text-[#0A0E1A]"
              >
                Mock Sign In (Demo)
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="ui-interactive ui-button ui-secondary-button w-full rounded-full border border-[#232C48] bg-[#131A2E] py-3 text-[#F4F6FB]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;