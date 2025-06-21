import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Star, 
  Clock, 
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const HeroSection = ({ movies = [], onWatchNow, onNavigate }) => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredMovieIndex, setHoveredMovieIndex] = useState(null);
  const carouselRef = useRef(null);
  const autoRotateRef = useRef(null);

  // Auto-rotate with smooth looping
// Auto-rotate with smooth looping (FIXED VERSION)
useEffect(() => {
  if (movies.length <= 1 || isPaused) return;

  autoRotateRef.current = setInterval(() => {
    setCurrentMovieIndex(prevIndex => (prevIndex + 1) % movies.length);
  }, 5000);

  return () => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
  };
}, [movies.length, isPaused]);

  const handleMovieChange = (newIndexOrFunction) => {
    if (isTransitioning) return;
    
    const newIndex = typeof newIndexOrFunction === 'function' 
      ? newIndexOrFunction(currentMovieIndex) 
      : newIndexOrFunction;
    
    if (newIndex === currentMovieIndex) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentMovieIndex(newIndex);
      setIsTransitioning(false);
    }, 400);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Enhanced scroll with looping logic
  const scrollCarousel = (direction) => {
    if (!carouselRef.current || movies.length === 0) return;

    const container = carouselRef.current;
    const itemWidth = 150; // Approximate width including gap
    const visibleItems = Math.floor(container.clientWidth / itemWidth);
    const maxScroll = Math.max(0, (movies.length - visibleItems) * itemWidth);
    
    let newScrollLeft;
    
    if (direction === 'left') {
      if (container.scrollLeft <= 0) {
        // Loop to end
        newScrollLeft = maxScroll;
      } else {
        newScrollLeft = Math.max(0, container.scrollLeft - itemWidth * 3);
      }
    } else {
      if (container.scrollLeft >= maxScroll) {
        // Loop to beginning
        newScrollLeft = 0;
      } else {
        newScrollLeft = Math.min(maxScroll, container.scrollLeft + itemWidth * 3);
      }
    }

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const formatYear = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getImageUrl = (path, size = 'original') => {
    if (!path) return null;
    return path.startsWith('http') ? path : `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const getPosterUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `https://image.tmdb.org/t/p/w300${path}`;
  };

  const currentMovie = movies[currentMovieIndex] || {};

  if (movies.length === 0) {
    return (
      <div className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-white/60 text-xl">No movies available</div>
          <div className="text-white/40 text-sm">Please load some movies to display</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-screen overflow-hidden bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        >
          {getImageUrl(currentMovie.backdrop_path) && (
            <img
              src={getImageUrl(currentMovie.backdrop_path)}
              alt={currentMovie.title || 'Movie backdrop'}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out"
            />
          )}
        </div>
        
        {/* Multiple gradient overlays for cinematic effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center my-12 space-y-4 sm:space-y-6">
            {/* Movie Title */}
            <div 
              className={`transition-all duration-700 ease-out ${
                isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
              }`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-2 sm:mb-4 px-2">
                {currentMovie.title || 'Movie Title'}
              </h1>
              {currentMovie.tagline && (
                <h2 className="text-lg sm:text-xl md:text-2xl text-white/80 font-light mb-4 sm:mb-6 px-2">
                  {currentMovie.tagline}
                </h2>
              )}
            </div>

            {/* Movie Metadata */}
            <div 
              className={`flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-white/90 transition-all duration-700 delay-150 mb-4 sm:mb-6 px-2 ${
                isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
              }`}
            >
              {currentMovie.vote_average && (
                <div className="flex items-center gap-1 sm:gap-2 bg-yellow-400 text-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs sm:text-sm">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                  <span>{currentMovie.vote_average.toFixed(1)}</span>
                  {currentMovie.vote_count && (
                    <span className="text-xs hidden sm:inline">
                      ({Math.floor(currentMovie.vote_count / 1000)}K)
                    </span>
                  )}
                </div>
              )}
              
              {formatYear(currentMovie.release_date) && (
                <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{formatYear(currentMovie.release_date)}</span>
                </div>
              )}
              
              {formatRuntime(currentMovie.runtime) && (
                <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{formatRuntime(currentMovie.runtime)}</span>
                </div>
              )}
              
              {currentMovie.genres?.[0]?.name && (
                <div className="text-xs sm:text-sm bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20">
                  {currentMovie.genres[0].name}
                </div>
              )}
            </div>

            {/* Movie Description */}
            {currentMovie.overview && (
              <div 
                className={`max-w-xs sm:max-w-lg md:max-w-2xl mx-auto transition-all duration-700 delay-300 mb-6 sm:mb-8 px-4 ${
                  isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                }`}
              >
                <p className="text-white/90 leading-relaxed text-sm sm:text-base line-clamp-2 sm:line-clamp-3">
                  {currentMovie.overview}
                </p>
                <button className="text-yellow-400 hover:text-yellow-300 mt-2 font-medium text-xs sm:text-sm hidden sm:block">
                  Read more
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transition-all duration-700 delay-500 px-4 ${
                isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
              }`}
            >
              <button 
                onClick={() => onWatchNow?.(currentMovie) || onNavigate?.(`/movie/${currentMovie.id}`)}
                className="bg-yellow-400 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-yellow-500 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 hover:scale-105 shadow-2xl"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                Watch now
              </button>
              
              <button 
                onClick={() => onNavigate?.(`/movie/${currentMovie.id}`)}
                className="border-2 border-white/30 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg hover:border-yellow-400 hover:bg-white/10 transition-all duration-200 shadow-xl"
              >
                Watch trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Carousel at Bottom */}
      {movies.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-6">
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => scrollCarousel('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex gap-3 px-12 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              {movies.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-500 group ${
                    index === currentMovieIndex 
                      ? 'scale-110 shadow-2xl' 
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => handleMovieChange(index)}
                  onMouseEnter={() => setHoveredMovieIndex(index)}
                  onMouseLeave={() => setHoveredMovieIndex(null)}
                  style={{
                    width: hoveredMovieIndex === index ? '180px' : '130px',
                    transition: 'width 0.3s ease'
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl border border-white/10">
                    {getPosterUrl(movie.poster_path) ? (
                      <img
                        src={getPosterUrl(movie.poster_path)}
                        alt={movie.title || 'Movie poster'}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <div className="text-white/40 text-xs text-center px-2">
                          No Image
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay with movie info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                      <h3 className="text-white text-xs font-semibold line-clamp-2 mb-1">
                        {movie.title || 'Untitled'}
                      </h3>
                      <div className="flex items-center justify-between">
                        {movie.vote_average && (
                          <span className="text-yellow-400 text-xs flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {movie.vote_average.toFixed(1)}
                          </span>
                        )}
                        {formatYear(movie.release_date) && (
                          <span className="text-white/70 text-xs">
                            {formatYear(movie.release_date)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Active indicator */}
                    {index === currentMovieIndex && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;