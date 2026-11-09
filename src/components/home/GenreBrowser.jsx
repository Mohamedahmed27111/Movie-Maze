import React from 'react';
import SectionHeader from '../common/SectionHeader';

const genres = [
  { id: 28, name: 'Action', color: 'from-[#A94313] to-[#6D2B0D]' },
  { id: 35, name: 'Comedy', color: 'from-[#8B6816] to-[#5C430C]' },
  { id: 18, name: 'Drama', color: 'from-[#6332A3] to-[#35186D]' },
  { id: 878, name: 'Sci-Fi', color: 'from-[#2475B9] to-[#16426F]' },
  { id: 27, name: 'Horror', color: 'from-[#A41E32] to-[#68111F]' },
  { id: 10749, name: 'Romance', color: 'from-[#AC3471] to-[#6F1F4A]' },
  { id: 53, name: 'Thriller', color: 'from-[#B5481D] to-[#71290F]' },
  { id: 16, name: 'Animation', color: 'from-[#25834F] to-[#14532F]' },
];

const GenreBrowser = ({ onGenreClick }) => (
  <section className="min-w-0">
    <SectionHeader title="Browse by Genre" to="/movies" />
    <div className="genre-browser">
      {genres.map((genre) => (
        <button
          key={genre.id}
          type="button"
          onClick={() => onGenreClick?.(genre.id)}
          className={`genre-tile ui-interactive bg-gradient-to-br ${genre.color}`}
          aria-label={`Browse ${genre.name} movies`}
        >
          <span>{genre.name}</span>
          <span className="genre-arrow" aria-hidden="true">→</span>
        </button>
      ))}
    </div>
  </section>
);

export default GenreBrowser;
