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
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

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
              {!imageError && posterUrl ? (
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
      className="relative bg-surface-secondary rounded-xl overflow-hidden transition-all duration-300 border border-surface-tertiary/60 hover:border-brand-primary/60 hover:shadow-[0_0_24px_rgba(250,204,21,0.15)] group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: '480px' }}
    >
      <Link to={`/movie/${movie.id}`} className=" h-full flex flex-col">
        {/* Poster - Fixed aspect ratio */}
        <div className="relative bg-surface-tertiary flex-shrink-0 overflow-hidden" style={{ height: '370px' }}>
          {!imageError && posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-muted gap-2 bg-gradient-to-b from-surface-tertiary to-surface-secondary">
              <Play className="w-10 h-10 opacity-30" />
              <span className="text-xs opacity-40 text-center px-4 leading-relaxed line-clamp-2">{movie.title}</span>
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
            <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-yellow-400/20 shadow-lg">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-yellow-300">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Play Button Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-transform duration-300 hover:scale-110 scale-90 group-hover:scale-100">
              <Play className="w-6 h-6 text-surface-primary ml-1" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Movie Info - Fixed height */}
        <div className="p-4 flex flex-col justify-between bg-gradient-to-b from-surface-secondary to-surface-secondary/80" style={{ height: '110px' }}>
          <div className="flex-1">
            <h3 className={`font-bold text-sm mb-1.5 line-clamp-2 transition-colors leading-tight ${
              isHovered ? 'text-brand-primary' : 'text-text-primary'
            }`}>
              {movie.title}
            </h3>
          </div>
          
          <div className={`flex items-center justify-between text-xs transition-colors ${
            isHovered ? 'text-brand-primary/80' : 'text-text-muted'
          }`}>
            {showYear && releaseYear && (
              <span className="font-medium">{releaseYear}</span>
            )}
            
            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <span className="bg-surface-tertiary px-2 py-0.5 rounded-full text-text-tertiary">
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