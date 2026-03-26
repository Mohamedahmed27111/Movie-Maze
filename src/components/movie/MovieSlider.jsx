// components/movie/MovieSlider.jsx
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/free-mode';

import { FreeMode } from 'swiper/modules';
import MovieCard from './MovieCard';

const MovieSlider = ({ movies, title, className = '' }) => {
  const swiperRef = useRef(null);

  if (!movies || movies.length === 0) return null;

  return (
    <div className={`relative group ${className}`}>
      {title && (
        <h2 className="text-heading-md font-bold text-text-primary mb-6">
          {title}
        </h2>
      )}

      {/* Swiper wrapper — fade zones live here so they don't cover the title */}
      <div className="relative">

        {/* ── Left fade zone: gradient + prev button ─────────────────────────
             The zone is pointer-events-none by default (invisible, clicks pass
             through). On group-hover it becomes pointer-events-auto so it
             blocks accidental clicks on cards in the edge area. */}
        <div
          className="absolute inset-y-0 left-0 w-20 z-10
                     flex items-center pl-2
                     bg-gradient-to-r from-surface-primary/85 via-surface-primary/20 to-transparent
                     opacity-0 group-hover:opacity-100
                     transition-opacity duration-200
                     pointer-events-none group-hover:pointer-events-auto"
        >
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Scroll left"
            className="w-9 h-9 flex items-center justify-center rounded-full
                       bg-surface-secondary/90 backdrop-blur-sm
                       border border-surface-tertiary/40 text-text-primary
                       shadow-[0_4px_16px_rgba(0,0,0,0.45)]
                       hover:bg-brand-primary hover:text-surface-primary hover:border-brand-primary
                       hover:shadow-[0_0_16px_rgba(250,204,21,0.5)]
                       active:scale-95 transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* ── Right fade zone: gradient + next button ────────────────────── */}
        <div
          className="absolute inset-y-0 right-0 w-20 z-10
                     flex items-center justify-end pr-2
                     bg-gradient-to-l from-surface-primary/85 via-surface-primary/20 to-transparent
                     opacity-0 group-hover:opacity-100
                     transition-opacity duration-200
                     pointer-events-none group-hover:pointer-events-auto"
        >
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Scroll right"
            className="w-9 h-9 flex items-center justify-center rounded-full
                       bg-surface-secondary/90 backdrop-blur-sm
                       border border-surface-tertiary/40 text-text-primary
                       shadow-[0_4px_16px_rgba(0,0,0,0.45)]
                       hover:bg-brand-primary hover:text-surface-primary hover:border-brand-primary
                       hover:shadow-[0_0_16px_rgba(250,204,21,0.5)]
                       active:scale-95 transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <Swiper
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          modules={[FreeMode]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode={{ enabled: true, momentum: true }}
          slideToClickedSlide={false}
          className="pb-4 px-1"
        >
          {movies.map((movie, index) => (
            <SwiperSlide
              key={`${movie.id}-${index}`}
              style={{ width: '240px' }}
              className="flex-shrink-0"
            >
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MovieSlider;
