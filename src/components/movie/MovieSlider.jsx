// components/movie/MovieSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

import { Navigation, FreeMode } from 'swiper/modules';
import MovieCard from './MovieCard';

const MovieSlider = ({ movies, title, className = '' }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {title && (
        <h2 className="text-heading-md font-bold text-text-primary mb-6">
          {title}
        </h2>
      )}

      <Swiper
        modules={[FreeMode, Navigation]}
        spaceBetween={16}
        slidesPerView={'auto'}
        freeMode={true}
        
        className="pb-4"
      >
        {movies.map((movie, index) => (
          <SwiperSlide
            key={`${movie.id}-${index}`}
            style={{ width: '288px' }} // Width of one card (72 * 4)
            className="flex-shrink-0"
          >
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieSlider;
