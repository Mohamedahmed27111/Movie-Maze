// components/movie/MovieCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Bookmark, Play, Calendar } from 'lucide-react';

const MovieCard = ({ movie, viewMode = 'grid', showRating = true, showYear = true }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Local state for favorites and watchlist (you can replace with your preferred state management)
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  
  // You can set this to true if user is logged in, or remove user-specific features
  const user = null; // Set to your user state or remove user-dependent features

  if (!movie) return null;

  const isFavorite = favorites.includes(movie.id);
  const isInWatchlist = watchlist.includes(movie.id);
  const releaseYear = new Date(movie.release_date).getFullYear();
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    if (isFavorite) {
      setFavorites(prev => prev.filter(id => id !== movie.id));
    } else {
      setFavorites(prev => [...prev, movie.id]);
    }
  };

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    if (isInWatchlist) {
      setWatchlist(prev => prev.filter(id => id !== movie.id));
    } else {
      setWatchlist(prev => [...prev, movie.id]);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (viewMode === 'list') {
    return (
      <Link
        to={`/movie/${movie.id}`}
        className="block bg-surface-secondary rounded-lg overflow-hidden hover:bg-surface-tertiary transition-all duration-200 border border-surface-tertiary hover:border-brand-primary/30"
      >
        <div className="flex p-4 gap-4">
          {/* Poster */}
          <div className="flex-shrink-0 relative">
            <div className="w-20 h-28 bg-surface-tertiary rounded-md overflow-hidden">
              {!imageError ? (
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <Play className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-text-primary hover:text-brand-primary transition-colors truncate pr-2">
                {movie.title}
              </h3>
              
              {user && (
                <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleFavoriteToggle}
                    className={`p-2 rounded-lg transition-colors ${
                      isFavorite 
                        ? 'text-red-500 hover:text-red-400' 
                        : 'text-text-muted hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleWatchlistToggle}
                    className={`p-2 rounded-lg transition-colors ${
                      isInWatchlist 
                        ? 'text-brand-primary hover:text-yellow-500' 
                        : 'text-text-muted hover:text-brand-primary'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-2">
              {showYear && movie.release_date && (
                <div className="flex items-center gap-1 text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{releaseYear}</span>
                </div>
              )}
              
              {showRating && movie.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-text-primary">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
              {movie.overview}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default) - Fixed height for consistent card sizes
  return (
    <div
      className="relative bg-surface-secondary rounded-lg overflow-hidden  transition-all duration-300 border border-surface-tertiary hover:border-yellow-400 hover:shadow-glow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: '480px' }} // Fixed height for all cards
    >
      <Link to={`/movie/${movie.id}`} className=" h-full flex flex-col">
        {/* Poster - Fixed aspect ratio */}
        <div className="relative bg-surface-tertiary flex-shrink-0 scale-95 rounded-md  hover:scale-100 transition-transform duration-300" style={{ height: '370px' }}>
          {!imageError ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover rounded-md "
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted ">
              <Play className="w-12 h-12" />
            </div>
          )}

          {/* Overlay Actions */}
          {user && (
            <div className={`absolute top-2 right-2 flex flex-col gap-1 transition-all duration-200 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}>
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-red-500/20 border-red-500/30 text-red-500' 
                    : 'bg-black/20 border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleWatchlistToggle}
                className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-200 ${
                  isInWatchlist 
                    ? 'bg-brand-primary/20 border-brand-primary/30 text-brand-primary' 
                    : 'bg-black/20 border-white/10 text-white hover:bg-brand-primary/20 hover:border-brand-primary/30 hover:text-brand-primary'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          )}

          {/* Rating Badge */}
          {showRating && movie.vote_average > 0 && (
            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              {movie.vote_average.toFixed(1)}
            </div>
          )}

          {/* Play Button Overlay */}
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center transform scale-75 hover:scale-100 transition-transform duration-200">
              <Play className="w-6 h-6 text-surface-primary ml-1" />
            </div>
          </div>
        </div>

        {/* Movie Info - Fixed height */}
        <div className="p-4 flex flex-col justify-between" style={{ height: '140px' }}>
          <div className="flex-1">
            <h3 className={`font-bold mb-2 line-clamp-2 transition-colors leading-tight ${
              isHovered ? 'text-yellow-400' : 'text-text-primary'
            }`}>
              {movie.title}
            </h3>
          </div>
          
          <div className={`flex items-center justify-between text-sm transition-colors ${
            isHovered ? 'text-yellow-300' : 'text-text-secondary'
          }`}>
            {showYear && movie.release_date && (
              <span>{releaseYear}</span>
            )}
            
            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <span className="truncate ml-2">
                {/* You can map genre_ids to genre names if you have genres context */}
                {movie.genre_ids.length} {movie.genre_ids.length === 1 ? 'genre' : 'genres'}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;