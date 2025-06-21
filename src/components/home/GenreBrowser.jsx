import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const GenreBrowser = ({ popularMovies = [], onGenreClick }) => {
  // Genre data with TMDB genre IDs
  const genres = [
    { id: 28, name: 'Action', color: 'from-red-600 to-orange-500' },
    { id: 35, name: 'Comedy', color: 'from-yellow-500 to-pink-500' },
    { id: 18, name: 'Drama', color: 'from-purple-600 to-blue-500' },
    { id: 878, name: 'Sci-Fi', color: 'from-blue-600 to-cyan-500' },
    { id: 27, name: 'Horror', color: 'from-gray-700 to-red-600' },
    { id: 10749, name: 'Romance', color: 'from-pink-500 to-rose-500' },
    { id: 53, name: 'Thriller', color: 'from-orange-600 to-red-500' },
    { id: 16, name: 'Animation', color: 'from-green-500 to-teal-500' }
  ];

  // Get a background image for each genre from popular movies
  const getGenreBackground = (genreId) => {
    const movieWithGenre = popularMovies.find(movie => 
      movie.genre_ids && movie.genre_ids.includes(genreId)
    );
    
    if (movieWithGenre && movieWithGenre.backdrop_path) {
      return `https://image.tmdb.org/t/p/w780${movieWithGenre.backdrop_path}`;
    }
    
    return '/api/placeholder/400/300';
  };

  // Get movie count for genre (mock data - you can implement real count via API)
  const getMovieCount = (genreId) => {
    const counts = {
      28: 2547, // Action
      35: 1892, // Comedy
      18: 3421, // Drama
      878: 1234, // Sci-Fi
      27: 987,   // Horror
      10749: 1456, // Romance
      53: 1678,  // Thriller
      16: 892    // Animation
    };
    return counts[genreId] || Math.floor(Math.random() * 2000) + 500;
  };

  return (
    <section className="py-16 bg-slate-900/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Browse by Genre
            </h2>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover your next favorite movie by exploring different genres
          </p>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="group relative h-48 md:h-52 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => onGenreClick?.(genre.id)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={getGenreBackground(genre.id)}
                  alt={`${genre.name} movies`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                {/* Top Section */}
                <div className="flex items-start justify-end">
                  <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>

                {/* Bottom Section */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-lg">
                    {genre.name}
                  </h3>
                  <p className="text-sm text-white/80 font-medium">
                    {getMovieCount(genre.id).toLocaleString()} movies
                  </p>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 rounded-xl transition-colors duration-300" />
            </div>
          ))}
        </div>

       
      </div>
    </section>
  );
};

export default GenreBrowser;