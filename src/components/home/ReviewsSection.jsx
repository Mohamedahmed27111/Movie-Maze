import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const ReviewsSection = ({ topRatedMovies = [] }) => {
  const [currentReview, setCurrentReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Mock reviews data - in production, this would come from your database
  const mockReviews = [
    {
      id: 1,
      userName: "Alex Chen",
      userAvatar: "AC",
      rating: 5,
      reviewText: "Absolutely incredible cinematography and storytelling. This movie kept me on the edge of my seat from start to finish!",
      movieTitle: "The Dark Knight",
      movieId: 155,
      verified: true,
      date: "2024-01-15"
    },
    {
      id: 2,
      userName: "Sarah Johnson",
      userAvatar: "SJ",
      rating: 4,
      reviewText: "A masterclass in filmmaking. The attention to detail and character development is phenomenal. Highly recommended!",
      movieTitle: "Inception",
      movieId: 27205,
      verified: true,
      date: "2024-01-12"
    },
    {
      id: 3,
      userName: "Mike Rodriguez",
      userAvatar: "MR",
      rating: 5,
      reviewText: "One of the best movies I've ever watched. The plot twists and visual effects are absolutely mind-blowing.",
      movieTitle: "Interstellar",
      movieId: 157336,
      verified: false,
      date: "2024-01-10"
    },
    {
      id: 4,
      userName: "Emma Wilson",
      userAvatar: "EW",
      rating: 4,
      reviewText: "Fantastic storytelling with great performances. The soundtrack alone makes this worth watching multiple times.",
      movieTitle: "Pulp Fiction",
      movieId: 680,
      verified: true,
      date: "2024-01-08"
    },
    {
      id: 5,
      userName: "David Kim",
      userAvatar: "DK",
      rating: 5,
      reviewText: "A cinematic experience like no other. Every scene is perfectly crafted and the ending left me speechless.",
      movieTitle: "The Shawshank Redemption",
      movieId: 278,
      verified: true,
      date: "2024-01-05"
    }
  ];

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying || mockReviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % mockReviews.length);
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, mockReviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % mockReviews.length);
    setIsAutoPlaying(false);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + mockReviews.length) % mockReviews.length);
    setIsAutoPlaying(false);
  };

  const goToReview = (index) => {
    setCurrentReview(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-brand-primary fill-current'
            : 'text-text-tertiary'
        }`}
      />
    ));
  };

  const getMoviePoster = (movieId) => {
    const movie = topRatedMovies.find(m => m.id === movieId);
    return movie?.poster_path 
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : null;
  };

  if (mockReviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-surface-primary to-surface-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">💬</div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            What People Are Saying
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Discover what our community thinks about the latest blockbusters and hidden gems
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Review Card */}
          <div className="bg-surface-secondary rounded-xl p-6 md:p-8 shadow-lg border border-surface-tertiary">
            <div className="flex flex-col md:flex-row gap-6">
              {/* User Info */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-4 mb-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center font-bold text-surface-primary">
                    {mockReviews[currentReview].userAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-text-primary">
                        {mockReviews[currentReview].userName}
                      </h4>
                      {mockReviews[currentReview].verified && (
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(mockReviews[currentReview].rating)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-grow">
                <blockquote className="text-text-primary text-lg leading-relaxed mb-4">
                  "{mockReviews[currentReview].reviewText}"
                </blockquote>
                
                {/* Movie Info */}
                <div className="flex items-center gap-3">
                  {getMoviePoster(mockReviews[currentReview].movieId) && (
                    <img
                      src={getMoviePoster(mockReviews[currentReview].movieId)}
                      alt={mockReviews[currentReview].movieTitle}
                      className="w-8 h-12 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-text-primary">
                      {mockReviews[currentReview].movieTitle}
                    </p>
                    <p className="text-text-tertiary text-sm">
                      Reviewed on {new Date(mockReviews[currentReview].date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Previous Button */}
            <button
              onClick={prevReview}
              className="flex items-center justify-center w-10 h-10 bg-surface-tertiary hover:bg-surface-interactive rounded-full text-text-primary transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {mockReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToReview(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentReview
                      ? 'bg-brand-primary'
                      : 'bg-surface-tertiary hover:bg-surface-interactive'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextReview}
              className="flex items-center justify-center w-10 h-10 bg-surface-tertiary hover:bg-surface-interactive rounded-full text-text-primary transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Auto-play indicator */}
          {isAutoPlaying && (
            <div className="text-center mt-4">
              <p className="text-text-tertiary text-sm">
                Reviews auto-rotate every 5 seconds
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;