// pages/MovieDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tmdbAPI from '../api/tmdbAPI';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MovieGrid from '../components/movie/MovieGrid';
import { 
  HeartIcon, 
  BookmarkIcon, 
  PlayIcon, 
  StarIcon,
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  UsersIcon,
  ArrowLeftIcon,
  ShareIcon,
  ExternalLinkIcon,
  XIcon,
  MapPinIcon,
  LanguagesIcon,
  TrendingUpIcon
} from 'lucide-react';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Local state for user preferences (replaces Firebase)
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const isFavorite = favorites.includes(parseInt(id));
  const isInWatchlist = watchlist.includes(parseInt(id));

  // Load user preferences from localStorage on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    const savedWatchlist = JSON.parse(localStorage.getItem('movieWatchlist') || '[]');
    setFavorites(savedFavorites);
    setWatchlist(savedWatchlist);
  }, []);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const movieData = await tmdbAPI.getMovieDetails(id);
      setMovie(movieData);
      
      // Fetch similar movies
      if (movieData.similar?.results) {
        setSimilarMovies(movieData.similar.results.slice(0, 12));
      }
    } catch (err) {
      setError('Failed to load movie details. Please try again.');
      console.error('Error fetching movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    const movieId = parseInt(id);
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(favId => favId !== movieId);
    } else {
      updatedFavorites = [...favorites, movieId];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
  };

  const handleWatchlistClick = () => {
    const movieId = parseInt(id);
    let updatedWatchlist;
    
    if (isInWatchlist) {
      updatedWatchlist = watchlist.filter(watchId => watchId !== movieId);
    } else {
      updatedWatchlist = [...watchlist, movieId];
    }
    
    setWatchlist(updatedWatchlist);
    localStorage.setItem('movieWatchlist', JSON.stringify(updatedWatchlist));
  };

  const getTrailerVideo = () => {
    if (!movie?.videos?.results) return null;
    return movie.videos.results.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    ) || movie.videos.results[0];
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on Movie Maze!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Could add a toast notification here
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">
            {error || 'Movie not found'}
          </h2>
          <button 
            onClick={() => navigate(-1)}
            className="bg-brand-primary text-surface-primary px-4 sm:px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const trailer = getTrailerVideo();
  const backdropUrl = tmdbAPI.getBackdropUrl(movie.backdrop_path, 'w1280');
  const posterUrl = tmdbAPI.getPosterUrl(movie.poster_path, 'w500');

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Backdrop Image */}
        {backdropUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-surface-primary via-surface-primary/90 to-surface-primary/60 md:bg-gradient-to-r md:from-surface-primary md:via-surface-primary/95 md:to-surface-primary/70"></div>
          </div>
        )}
        
        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 sm:mb-8 flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group"
          >
            <ArrowLeftIcon size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-medium">Back to results</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Poster Section */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="flex flex-col items-center lg:items-start">
                {/* Poster Image */}
                <div className="relative group">
                  <img
                    src={posterUrl || '/placeholder-poster.jpg'}
                    alt={movie.title}
                    className="w-64 sm:w-72 md:w-80 lg:w-full rounded-xl shadow-2xl transition-transform group-hover:scale-105"
                  />
                  {/* Overlay for actions on mobile */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center lg:hidden">
                    <div className="text-white text-center">
                      <PlayIcon size={48} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">View Details</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-6 w-full max-w-sm lg:max-w-none">
                  <button
                    onClick={handleFavoriteClick}
                    className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isFavorite 
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600' 
                        : 'bg-surface-secondary text-text-secondary hover:bg-surface-interactive hover:text-text-primary border border-surface-tertiary'
                    }`}
                  >
                    <HeartIcon size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                    <span className="text-sm">{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </button>
                  
                  <button
                    onClick={handleWatchlistClick}
                    className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isInWatchlist 
                        ? 'bg-brand-primary text-surface-primary shadow-lg shadow-brand-primary/25 hover:bg-yellow-500' 
                        : 'bg-surface-secondary text-text-secondary hover:bg-surface-interactive hover:text-text-primary border border-surface-tertiary'
                    }`}
                  >
                    <BookmarkIcon size={18} fill={isInWatchlist ? 'currentColor' : 'none'} />
                    <span className="text-sm">{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Movie Info Section */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6 lg:space-y-8">
              {/* Title and Tagline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary leading-tight">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary font-light italic">
                    "{movie.tagline}"
                  </p>
                )}
              </div>

              {/* Rating and Quick Stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Rating */}
                <div className="flex items-center gap-2 bg-surface-secondary/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <StarIcon size={20} className="text-brand-primary" fill="currentColor" />
                  <span className="font-bold text-text-primary text-lg">{movie.vote_average?.toFixed(1)}</span>
                  <span className="text-text-tertiary text-sm">
                    ({movie.vote_count ? `${Math.round(movie.vote_count / 1000)}k` : '0'})
                  </span>
                </div>
                
                {/* Release Date */}
                <div className="flex items-center gap-2 text-text-secondary">
                  <CalendarIcon size={18} />
                  <span className="font-medium">{tmdbAPI.formatDate(movie.release_date)}</span>
                </div>
                
                {/* Runtime */}
                {movie.runtime && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <ClockIcon size={18} />
                    <span className="font-medium">{tmdbAPI.formatRuntime(movie.runtime)}</span>
                  </div>
                )}

                {/* Language */}
                {movie.original_language && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <LanguagesIcon size={18} />
                    <span className="font-medium uppercase">{movie.original_language}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map(genre => (
                  <span 
                    key={genre.id}
                    className="px-4 py-2 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 border border-brand-primary/30 rounded-full text-sm font-medium text-text-primary hover:from-brand-primary/30 hover:to-brand-accent/30 transition-all cursor-pointer"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-brand-primary to-yellow-500 text-surface-primary px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-brand-primary transition-all duration-300 shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-105"
                  >
                    <PlayIcon size={24} />
                    <span>Watch Trailer</span>
                  </button>
                )}
                
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-3 bg-surface-secondary/80 backdrop-blur-sm text-text-primary px-8 py-4 rounded-xl font-semibold border border-surface-tertiary hover:bg-surface-interactive transition-all duration-200 hover:scale-105"
                >
                  <ShareIcon size={20} />
                  <span>Share Movie</span>
                </button>
              </div>

              {/* Overview */}
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Synopsis</h2>
                <p className="text-text-secondary leading-relaxed text-base sm:text-lg lg:text-xl font-light">
                  {movie.overview || 'No overview available for this movie.'}
                </p>
              </div>

              {/* Financial Info */}
              {(movie.budget > 0 || movie.revenue > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {movie.budget > 0 && (
                    <div className="bg-surface-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-surface-tertiary">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <DollarSignIcon size={24} className="text-red-500" />
                        </div>
                        <div>
                          <p className="text-text-tertiary text-sm font-medium">Production Budget</p>
                          <p className="text-text-primary text-xl font-bold">
                            {tmdbAPI.formatCurrency(movie.budget)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {movie.revenue > 0 && (
                    <div className="bg-surface-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-surface-tertiary">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <TrendingUpIcon size={24} className="text-green-500" />
                        </div>
                        <div>
                          <p className="text-text-tertiary text-sm font-medium">Box Office Revenue</p>
                          <p className="text-text-primary text-xl font-bold">
                            {tmdbAPI.formatCurrency(movie.revenue)}
                          </p>
                          {movie.budget > 0 && (
                            <p className="text-green-500 text-sm font-medium">
                              {((movie.revenue / movie.budget) * 100).toFixed(0)}% ROI
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Production Companies */}
              {movie.production_companies?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-text-primary">Production Companies</h3>
                  <div className="flex flex-wrap gap-4">
                    {movie.production_companies.slice(0, 4).map(company => (
                      <div key={company.id} className="flex items-center gap-3 bg-surface-secondary/50 backdrop-blur-sm rounded-lg p-3 border border-surface-tertiary">
                        {company.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${company.logo_path}`}
                            alt={company.name}
                            className="h-8 w-auto object-contain"
                          />
                        )}
                        <span className="text-text-secondary text-sm font-medium">{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="border-b border-surface-tertiary mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {['overview', 'cast', 'crew'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-semibold text-base capitalize transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-surface-tertiary'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'cast' && (
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">Cast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {movie.credits?.cast?.slice(0, 12).map((person) => (
                <div key={person.id} className="group">
                  <div className="relative overflow-hidden rounded-xl mb-3">
                    <img
                      src={tmdbAPI.getProfileUrl(person.profile_path) || '/placeholder-person.jpg'}
                      alt={person.name}
                      className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 className="font-semibold text-text-primary text-sm mb-1 line-clamp-2">{person.name}</h4>
                  <p className="text-text-tertiary text-xs line-clamp-2">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'crew' && (
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">Crew</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {movie.credits?.crew?.slice(0, 12).map((person) => (
                <div key={`${person.id}-${person.job}`} className="flex items-center gap-4 bg-surface-secondary/50 rounded-xl p-4 border border-surface-tertiary hover:bg-surface-interactive transition-colors">
                  <img
                    src={tmdbAPI.getProfileUrl(person.profile_path) || '/placeholder-person.jpg'}
                    alt={person.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-text-primary text-sm mb-1 truncate">{person.name}</h4>
                    <p className="text-text-tertiary text-xs truncate">{person.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">You Might Also Like</h3>
          <MovieGrid movies={similarMovies} />
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-secondary rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-text-primary">Watch Trailer</h3>
              <button
                onClick={() => setShowTrailer(false)}
                className="text-text-secondary hover:text-text-primary bg-surface-tertiary hover:bg-surface-interactive rounded-full p-2 transition-colors"
              >
                <XIcon size={24} />
              </button>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src={tmdbAPI.getYouTubeEmbedUrl(trailer.key)}
                title={trailer.name}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;