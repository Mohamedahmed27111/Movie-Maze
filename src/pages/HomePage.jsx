import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MovieSlider from '../components/movie/MovieSlider';
import LoadingSpinner from '../components/common/LoadingSpinner';
import GenreBrowser from '../components/home/GenreBrowser';
import ReviewsSection from '../components/home/ReviewsSection';
import NewsletterSection from '../components/home/NewsletterSection';
import HeroSection from '../components/home/HeroSection';
import { 
  Star, 
  Plus, 
} from 'lucide-react';
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
      
      // Fetch all movie categories concurrently
      const [trendingData, popularData, topRatedData] = await Promise.all([
        tmdbAPI.getTrending('movie', 'week'),
        tmdbAPI.getPopular(1),
        tmdbAPI.getTopRated(1)
      ]);

      // Update state with fetched data
      setTrendingMovies(trendingData.results || []);
      setPopularMovies(popularData.results || []);
      setTopRatedMovies(topRatedData.results || []);

      // Set hero movies from trending (first 10 for rotation)
      if (trendingData.results && trendingData.results.length > 0) {
        setHeroMovies(trendingData.results);
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-white/60">Loading amazing movies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !trendingMovies.length) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            Try Again
          </button> 
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
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
      <div className="bg-slate-900 pt-16">
        {/* Trending Movies Section */}
        {trendingMovies.length > 0 && (
          <section className="mb-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Trending Movies
                  </h2>
                </div>
                <Link
                  to="/movies?category=trending"
                  className="text-yellow-400 hover:text-yellow-500 font-semibold transition-colors text-sm md:text-base"
                >
                  View All
                </Link>
              </div>
              <MovieSlider movies={trendingMovies} />
            </div>
          </section>
        )}

        {/* Popular Movies */}
        {popularMovies.length > 0 && (
          <section className="mb-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Popular Movies
                  </h2>
                </div>
                <Link
                  to="/movies?category=popular"
                  className="text-yellow-400 hover:text-yellow-500 font-semibold transition-colors text-sm md:text-base"
                >
                  View All
                </Link>
              </div>
              <MovieSlider movies={popularMovies} />
            </div>
          </section>
        )}

        {/* Top Rated Movies */}
        {topRatedMovies.length > 0 && (
          <section className="mb-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Top Rated
                  </h2>
                </div>
                <Link
                  to="/movies?category=top_rated"
                  className="text-yellow-400 hover:text-yellow-500 font-semibold transition-colors text-sm md:text-base"
                >
                  View All
                </Link>
              </div>
              <MovieSlider movies={topRatedMovies} />
            </div>
          </section>
        )}

        {/* Genre Browser Section */}
        <GenreBrowser 
          popularMovies={popularMovies}
          onGenreClick={(genreId) => {
            navigate(`/movies?genre=${genreId}`);
          }}
        />

        {/* Reviews Section */}
        <ReviewsSection 
          topRatedMovies={topRatedMovies}
        />

        {/* Newsletter Section */}
        <NewsletterSection 
          onSubscribe={(email) => {
            console.log('Newsletter subscription:', email);
            // TODO: Implement newsletter subscription logic with your chosen backend
            // You could use an API call to your server, a service like Mailchimp, etc.
          }}
        />


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
          <div className="bg-slate-800 p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">Sign In</h3>
            <p className="text-white/60 mb-6">
              Sign in to create watchlists and mark your favorite movies.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                Mock Sign In (Demo)
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full bg-transparent border border-white/20 text-white py-3 rounded-lg hover:bg-white/10 transition-colors"
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