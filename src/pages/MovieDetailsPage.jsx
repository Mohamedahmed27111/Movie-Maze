// pages/MovieDetailsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import tmdbAPI from '../api/tmdbAPI';
import { MovieDetailsLoader } from '../components/common/LoadingSpinner';
import MovieGrid from '../components/movie/MovieGrid';
import { 
  HeartIcon, 
  BookmarkIcon, 
  PlayIcon, 
  StarIcon,
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  ShareIcon,
  XIcon,
  LanguagesIcon,
} from 'lucide-react';

const formatVotes = (count = 0) =>
  count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(count);

const Avatar = ({ person, className }) => {
  const url = tmdbAPI.getProfileUrl(person.profile_path);
  const initials = person.name
    ?.split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
  return url ? (
    <img src={url} alt={person.name} loading="lazy" className={className} />
  ) : (
    <div
      role="img"
      aria-label={`${person.name} photo unavailable`}
      className={`${className} cast-fallback flex items-center justify-center text-xl font-bold`}
    >
      {initials}
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState('cast');

  const isFavorite = favorites.includes(parseInt(id));
  const isInWatchlist = watchlist.includes(parseInt(id));

  // Load user preferences from localStorage on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    const savedWatchlist = JSON.parse(localStorage.getItem('movieWatchlist') || '[]');
    setFavorites(savedFavorites);
    setWatchlist(savedWatchlist);
  }, []);

  // Use useCallback to memoize the fetchMovieDetails function
  const fetchMovieDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const movieData = await tmdbAPI.getMovieDetails(id);
      setMovie(movieData);
      
      // Similar movies (already safety-filtered in tmdbAPI); fall back to recommendations
      const related = movieData.similar?.results?.length
        ? movieData.similar.results
        : movieData.recommendations?.results || [];
      setSimilarMovies(related.slice(0, 12));
    } catch (err) {
      setError('Failed to load movie details. Please try again.');
      console.error('Error fetching movie details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

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
      <div className="page-container py-8">
        <MovieDetailsLoader />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="page-container py-8">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-bold text-[#F4F6FB] sm:text-2xl">
            {error || 'Movie not found'}
          </h2>
          <button 
            onClick={() => navigate(-1)}
            className="ui-interactive ui-button ui-primary-button min-h-11 rounded-full bg-[#FFC933] px-6 font-semibold text-[#0A0E1A]"
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
    <div className="details-page min-h-screen bg-[#0A0E1A]">
      <section className="details-backdrop relative overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-25 blur-2xl"
          />
        )}
        <div className="relative z-10 page-container py-6 sm:py-8 lg:py-12">
          <button 
            onClick={() => navigate(-1)}
            className="ui-interactive ui-text-button mb-6 inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm font-medium text-[#9AA4BF]"
          >
            <ArrowLeftIcon size={18} />
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 items-start gap-6 min-[641px]:grid-cols-[216px_minmax(0,1fr)] min-[641px]:gap-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
            {/* Poster Section */}
            <div className="flex justify-center min-[641px]:justify-start">
                <div className="relative w-40 max-w-full overflow-hidden rounded-2xl border border-[#1B2238] bg-[#131A2E] min-[641px]:w-full">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      loading="eager"
                      className="block h-auto w-full object-cover"
                    />
                  ) : (
                    <div className="poster-placeholder flex aspect-[2/3] w-full items-center justify-center p-4 text-center text-sm font-semibold text-[#9AA4BF]">
                      {movie.title}
                    </div>
                  )}
                </div>
            </div>

            {/* Movie Info Section */}
            <div className="min-w-0 space-y-5 text-center min-[641px]:text-left">
              {/* Title and Tagline */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#F4F6FB] sm:text-4xl lg:text-5xl">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-base italic text-[#9AA4BF] sm:text-lg">
                    "{movie.tagline}"
                  </p>
                )}
              </div>

              {/* Rating and Quick Stats */}
              <div className="flex flex-wrap items-center justify-center gap-2 min-[641px]:justify-start">
                {/* Rating */}
                <div className="flex min-h-10 items-center gap-1.5 rounded-full border border-[#232C48] bg-[#131A2E] px-3 text-sm">
                  <StarIcon size={15} className="text-[#FFC933]" fill="currentColor" />
                  <span className="font-semibold text-[#FFC933]">{movie.vote_average?.toFixed(1)}</span>
                  <span className="text-[#9AA4BF]">
                    ({formatVotes(movie.vote_count)})
                  </span>
                </div>
                
                {/* Release Date */}
                <div className="flex min-h-10 items-center gap-1.5 rounded-full border border-[#232C48] bg-[#131A2E] px-3 text-xs text-[#F4F6FB] sm:text-sm">
                  <CalendarIcon size={15} className="text-[#9AA4BF]" />
                  <span className="font-medium">{tmdbAPI.formatDate(movie.release_date)}</span>
                </div>
                
                {/* Runtime */}
                {movie.runtime && (
                  <div className="flex min-h-10 items-center gap-1.5 rounded-full border border-[#232C48] bg-[#131A2E] px-3 text-sm text-[#F4F6FB]">
                    <ClockIcon size={15} className="text-[#9AA4BF]" />
                    <span className="font-medium">{tmdbAPI.formatRuntime(movie.runtime)}</span>
                  </div>
                )}

                {/* Language */}
                {movie.original_language && (
                  <div className="flex min-h-10 items-center gap-1.5 rounded-full border border-[#232C48] bg-[#131A2E] px-3 text-sm text-[#F4F6FB]">
                    <LanguagesIcon size={15} className="text-[#9AA4BF]" />
                    <span className="font-medium uppercase">{movie.original_language}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap justify-center gap-2 min-[641px]:justify-start">
                {movie.genres?.map(genre => (
                  <Link
                    key={genre.id}
                    to={`/movies?genre=${genre.id}`}
                    className="details-genre ui-interactive flex min-h-9 items-center rounded-full border border-[#6A5424] bg-[#3A2E14] px-3.5 text-sm font-medium text-[#F4D98A]"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 min-[641px]:flex min-[641px]:flex-wrap">
                {trailer && (
                  <button
                    type="button"
                    onClick={() => setShowTrailer(true)}
                    className="ui-interactive ui-button ui-primary-button col-span-3 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FFC933] px-4 font-bold text-[#0A0E1A] min-[641px]:col-span-1 min-[641px]:px-6"
                  >
                    <PlayIcon size={19} />
                    <span>Watch Trailer</span>
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleShare}
                  className="ui-interactive ui-button ui-secondary-button flex min-h-12 items-center justify-center gap-1 rounded-full border border-[#232C48] bg-[#131A2E] px-2 text-xs font-semibold text-[#F4F6FB] sm:gap-2 sm:px-4 sm:text-sm"
                >
                  <ShareIcon size={16} />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  className={`ui-interactive ui-button ui-secondary-button flex min-h-12 items-center justify-center gap-1 rounded-full border px-2 text-xs font-semibold sm:gap-2 sm:px-4 sm:text-sm ${
                    isFavorite
                      ? 'is-selected is-favorite border-red-500/50 bg-red-500/15 text-red-300'
                      : 'border-[#232C48] bg-[#131A2E] text-[#F4F6FB]'
                  }`}
                >
                  <HeartIcon size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                  <span>Favorite</span>
                </button>

                <button
                  type="button"
                  onClick={handleWatchlistClick}
                  className={`ui-interactive ui-button ui-secondary-button flex min-h-12 items-center justify-center gap-1 rounded-full border px-2 text-xs font-semibold sm:gap-2 sm:px-4 sm:text-sm ${
                    isInWatchlist
                      ? 'is-selected border-[#FFC933]/60 bg-[#FFC933]/10 text-[#FFC933]'
                      : 'border-[#232C48] bg-[#131A2E] text-[#F4F6FB]'
                  }`}
                >
                  <BookmarkIcon size={16} fill={isInWatchlist ? 'currentColor' : 'none'} />
                  <span>Watchlist</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <section>
              <h2 className="mb-2 text-xl font-bold text-[#F4F6FB]">Synopsis</h2>
              <p className="max-w-5xl text-sm leading-[1.7] text-[#9AA4BF] sm:text-base">
                {movie.overview || 'No overview available for this movie.'}
              </p>
            </section>

            {(movie.budget > 0 || movie.revenue > 0) && (
              <div className="grid grid-cols-1 gap-3 min-[641px]:grid-cols-2">
                {movie.budget > 0 && (
                  <div className="rounded-2xl border border-[#1B2238] bg-[#131A2E] p-5">
                    <p className="text-sm text-[#9AA4BF]">Production Budget</p>
                    <p className="mt-1 text-xl font-bold text-[#F4F6FB]">{tmdbAPI.formatCurrency(movie.budget)}</p>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="rounded-2xl border border-[#1B2238] bg-[#131A2E] p-5">
                    <p className="text-sm text-[#9AA4BF]">Box Office Revenue</p>
                    <p className="mt-1 text-xl font-bold text-[#F4F6FB]">{tmdbAPI.formatCurrency(movie.revenue)}</p>
                    {movie.budget > 0 && (
                      <p className="mt-1 text-sm font-semibold text-[#4ADE80]">
                        {(((movie.revenue - movie.budget) / movie.budget) * 100).toFixed(0)}% ROI
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {movie.production_companies?.length > 0 && (
              <section>
                <h3 className="mb-3 text-base font-bold text-[#F4F6FB]">Production Companies</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.production_companies.slice(0, 4).map((company) => (
                    <div key={company.id} className="flex min-h-10 items-center gap-2 rounded-full border border-[#1B2238] bg-[#131A2E] px-3 text-xs font-medium text-[#9AA4BF]">
                      {company.logo_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${company.logo_path}`}
                          alt=""
                          className="h-6 w-auto max-w-16 object-contain"
                        />
                      )}
                      <span>{company.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <div className="page-container py-8 lg:py-12">
        <div className="mb-6 border-b border-[#1B2238]">
          <nav className="flex gap-6" aria-label="Movie credits">
            {['cast', 'crew'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-selected={activeTab === tab}
                role="tab"
                className={`details-tab ui-interactive min-h-11 border-b-2 px-1 text-sm font-semibold capitalize ${
                  activeTab === tab
                    ? 'border-[#FFC933] text-[#FFC933]'
                    : 'border-transparent text-[#9AA4BF]'
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
            <h3 className="mb-5 text-xl font-bold text-[#F4F6FB]">Cast</h3>
            <div className="cast-grid">
              {movie.credits?.cast?.slice(0, 12).map((person) => (
                <div key={person.id} className="cast-card group min-w-0">
                  <div className="cast-photo relative mb-2 aspect-square overflow-hidden rounded-xl border border-[#1B2238] bg-[#131A2E]">
                    <Avatar
                      person={person}
                      className="cast-photo-image h-full w-full object-cover"
                    />
                  </div>
                  <h4 className="cast-name mb-0.5 line-clamp-2 text-xs font-semibold text-[#F4F6FB] sm:text-sm">{person.name}</h4>
                  <p className="line-clamp-2 text-[11px] text-[#9AA4BF] sm:text-xs">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'crew' && (
          <div>
            <h3 className="mb-5 text-xl font-bold text-[#F4F6FB]">Crew</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {movie.credits?.crew?.slice(0, 12).map((person) => (
                <div key={`${person.id}-${person.job}`} className="crew-card flex items-center gap-4 rounded-2xl border border-[#1B2238] bg-[#131A2E] p-4">
                  <Avatar
                    person={person}
                    className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 truncate text-sm font-semibold text-[#F4F6FB]">{person.name}</h4>
                    <p className="truncate text-xs text-[#9AA4BF]">{person.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="page-container py-8 lg:py-12">
          <h3 className="section-heading mb-5">You Might Also Like</h3>
          <MovieGrid movies={similarMovies} columns="four" />
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-[#232C48] bg-[#131A2E] p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-text-primary">Watch Trailer</h3>
              <button
                type="button"
                onClick={() => setShowTrailer(false)}
                aria-label="Close trailer"
                className="ui-interactive ui-secondary-button flex h-11 w-11 items-center justify-center rounded-full border border-[#232C48] bg-[#0E1424] text-[#9AA4BF]"
              >
                <XIcon size={24} />
              </button>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src={tmdbAPI.getYouTubeEmbedUrl(trailer.key)}
                title={trailer.name}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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