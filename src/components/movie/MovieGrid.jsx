// components/movie/MovieGrid.jsx
import React from 'react';
import MovieCard from './MovieCard';
import { Film } from 'lucide-react';

const MovieGrid = ({ 
  movies = [], 
  viewMode = 'grid', 
  loading = false, 
  emptyMessage = "No movies found",
  emptySubMessage = "Try adjusting your filters or search terms"
}) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className={`grid gap-6 ${
        viewMode === 'list' 
          ? 'grid-cols-1' 
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
      }`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <MovieGridSkeleton key={index} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-surface-secondary rounded-full flex items-center justify-center mb-6">
          <Film className="w-10 h-10 text-text-tertiary" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">
          {emptyMessage}
        </h3>
        <p className="text-text-secondary max-w-md">
          {emptySubMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === 'list' 
        ? 'grid-cols-1' 
        : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
    }`}>
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

// Loading skeleton component
const MovieGridSkeleton = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-surface-secondary rounded-lg overflow-hidden border border-surface-tertiary animate-pulse">
        <div className="flex p-4 gap-4">
          {/* Poster skeleton */}
          <div className="w-20 h-28 bg-surface-tertiary rounded-md flex-shrink-0"></div>
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-surface-tertiary rounded w-3/4"></div>
            <div className="flex items-center gap-4">
              <div className="h-4 bg-surface-tertiary rounded w-16"></div>
              <div className="h-4 bg-surface-tertiary rounded w-12"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-surface-tertiary rounded w-full"></div>
              <div className="h-3 bg-surface-tertiary rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid skeleton
  return (
    <div className="bg-surface-secondary rounded-lg overflow-hidden border border-surface-tertiary animate-pulse">
      {/* Poster skeleton */}
      <div className="aspect-poster bg-surface-tertiary"></div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 bg-surface-tertiary rounded w-full"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-surface-tertiary rounded w-16"></div>
          <div className="h-4 bg-surface-tertiary rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default MovieGrid;