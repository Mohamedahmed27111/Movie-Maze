// components/movie/MovieCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Calendar } from 'lucide-react';
import tmdbAPI from '../../api/tmdbAPI';

const MovieCard = ({ movie, viewMode = 'grid', showRating = true, showYear = true }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!movie) return null;

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const posterUrl = tmdbAPI.getPosterUrl(movie.poster_path, 'w342');

  const handleImageError = () => setImageError(true);

  // Small srcset so the browser downloads only what it needs to paint.
  const posterSrcSet = movie.poster_path
    ? `https://image.tmdb.org/t/p/w185${movie.poster_path} 185w, https://image.tmdb.org/t/p/w342${movie.poster_path} 342w`
    : undefined;

  if (viewMode === 'list') {
    return (
      <Link
        to={`/movie/${movie.id}`}
        className="movie-list-link ui-interactive block rounded-2xl border border-[#1B2238] bg-[#131A2E]"
      >
        <div className="flex p-4 gap-4">
          <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#0E1424]">
            {!imageError && posterUrl ? (
              <img
                src={posterUrl}
                srcSet={posterSrcSet}
                sizes="80px"
                alt={movie.title}
                loading="lazy"
                decoding="async"
                className={`h-full w-full object-cover transition-opacity duration-200 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />
            ) : (
              <div className="poster-placeholder flex h-full w-full items-center justify-center p-1 text-center text-[10px] text-[#9AA4BF]">
                {movie.title}
              </div>
            )}
            {!imageLoaded && !imageError && posterUrl && (
              <div className="poster-shimmer absolute inset-0" aria-hidden="true" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="movie-card-title truncate pr-2 mb-2 text-lg font-bold text-[#F4F6FB] transition-colors">
              {movie.title}
            </h3>

            <div className="flex items-center gap-4 mb-2">
              {showYear && movie.release_date && (
                <div className="flex items-center gap-1 text-[#9AA4BF]">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{releaseYear}</span>
                </div>
              )}

              {showRating && movie.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-[#FFC933]" />
                  <span className="text-sm font-semibold text-[#F4F6FB]">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm leading-relaxed text-[#9AA4BF] line-clamp-2">
              {movie.overview}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default).
  return (
    <article className="movie-card group min-w-0">
      <Link to={`/movie/${movie.id}`} className="movie-card-link ui-interactive block rounded-2xl">
        <div className="movie-poster border border-[#1B2238]">
            {!imageError && posterUrl ? (
              <img
                src={posterUrl}
                srcSet={posterSrcSet}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 280px"
                alt={movie.title}
                loading="lazy"
                decoding="async"
                className={`movie-card-poster absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />
            ) : (
              <div className="poster-placeholder absolute inset-0 flex flex-col items-center justify-center px-3 text-center text-sm font-semibold text-[#9AA4BF]">
                <Play className="mb-2 h-7 w-7 opacity-50" aria-hidden="true" />
                <span className="line-clamp-3">{movie.title}</span>
              </div>
            )}

            {!imageLoaded && !imageError && posterUrl && (
              <div className="poster-shimmer absolute inset-0" aria-hidden="true" />
            )}

            {showRating && movie.vote_average > 0 && (
              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full border border-white/10 bg-[#0A0E1A]/90 px-2 py-1 text-xs font-bold text-[#FFC933]">
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
        </div>
        <div className="pt-2">
          <h3 className="movie-card-title line-clamp-2 text-sm font-semibold leading-snug text-[#F4F6FB]">
            {movie.title}
          </h3>
          {showYear && releaseYear && (
            <p className="mt-0.5 text-xs text-[#9AA4BF]">{releaseYear}</p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default MovieCard;
