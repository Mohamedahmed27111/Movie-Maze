import React, { useState, useEffect } from 'react';
import { Home, Search, ArrowLeft, Film, Heart, Bookmark, Star, Play } from 'lucide-react';

const NotFoundPage = () => {
  const [glitchText, setGlitchText] = useState('404');
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Fun glitch effect for 404 text
  useEffect(() => {
    const glitchChars = ['4', '0', '4', '█', '▓', '▒', '░'];
    let glitchInterval;

    const startGlitch = () => {
      glitchInterval = setInterval(() => {
        const randomChars = Array.from({length: 3}, () => 
          glitchChars[Math.floor(Math.random() * glitchChars.length)]
        ).join('');
        setGlitchText(randomChars);
        
        setTimeout(() => setGlitchText('404'), 100);
      }, 3000);
    };

    const timer = setTimeout(startGlitch, 2000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(glitchInterval);
    };
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const movieFacts = [
    "The first '404 error' was named after room 404 at CERN, where the World Wide Web was born!",
    "The longest movie ever made is 87 hours long - 'Logistics' (2012).",
    "The shortest Oscar-nominated film was only 1 minute and 42 seconds long.",
    "Movies are typically filmed at 24 frames per second, creating the illusion of motion."
  ];

  const randomFact = movieFacts[Math.floor(Math.random() * movieFacts.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-rose-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-30"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main 404 Section */}
        <div className="mb-12">
          <div className="relative mb-8">
            {/* Glowing 404 Text */}
            <div className="text-8xl md:text-9xl lg:text-[12rem] font-black text-transparent bg-gradient-to-b from-slate-600 to-slate-800 bg-clip-text select-none relative">
              {glitchText}
              <div className="absolute inset-0 text-8xl md:text-9xl lg:text-[12rem] font-black text-yellow-400 opacity-20 blur-sm animate-pulse">
                404
              </div>
            </div>
            
            {/* Floating Film Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Film className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 animate-bounce" />
                <div className="absolute inset-0 w-16 h-16 md:w-24 md:h-24">
                  <Film className="w-full h-full text-yellow-400 opacity-30 blur-sm animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6">
              Scene Not Found
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light">
              This page seems to have been left on the cutting room floor
            </p>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for might have been moved, deleted, or perhaps it never existed in the first place. 
              Don't worry though – every great story has its plot twists!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={() => window.location.href = '/'}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-yellow-400/25"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={handleGoBack}
            className="group flex items-center space-x-3 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => window.location.href = '/search'}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-400 hover:to-rose-500 transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-rose-500/25"
          >
            <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Search Movies</span>
          </button>
        </div>

        {/* Quick Links Grid */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Maybe you were looking for:
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl hover:bg-slate-700/50 transition-all duration-300 cursor-pointer border border-slate-700/50 hover:border-slate-600 transform hover:scale-105">
              <div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Film className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-white font-semibold mb-2">All Movies</div>
              <div className="text-slate-400 text-sm">Browse our catalog</div>
            </div>

            <div className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl hover:bg-slate-700/50 transition-all duration-300 cursor-pointer border border-slate-700/50 hover:border-slate-600 transform hover:scale-105">
              <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-white font-semibold mb-2">Search</div>
              <div className="text-slate-400 text-sm">Find your movie</div>
            </div>

            <div className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl hover:bg-slate-700/50 transition-all duration-300 cursor-pointer border border-slate-700/50 hover:border-slate-600 transform hover:scale-105">
              <div className="text-rose-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 mx-auto fill-current" />
              </div>
              <div className="text-white font-semibold mb-2">Favorites</div>
              <div className="text-slate-400 text-sm">Your top picks</div>
            </div>

            <div className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl hover:bg-slate-700/50 transition-all duration-300 cursor-pointer border border-slate-700/50 hover:border-slate-600 transform hover:scale-105">
              <div className="text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bookmark className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-white font-semibold mb-2">Watchlist</div>
              <div className="text-slate-400 text-sm">Coming up next</div>
            </div>
          </div>
        </div>

        {/* Easter Egg Section */}
        <div 
          className="relative p-8 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-3xl border border-slate-600/50 cursor-pointer hover:border-yellow-400/50 transition-all duration-500 group"
          onClick={() => setShowEasterEgg(!showEasterEgg)}
        >
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Star className="w-5 h-5 text-yellow-400 animate-spin" />
          </div>
          
          <div className="text-6xl mb-4 animate-bounce">🎬</div>
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
            {showEasterEgg ? "🎉 You found the secret!" : "Movie Trivia"}
          </h3>
          <p className="text-slate-300 leading-relaxed max-w-3xl mx-auto">
            {showEasterEgg 
              ? "Congratulations! You've discovered our hidden easter egg. In the spirit of movies, here's a bonus fact: The Wilhelm Scream, a famous stock scream effect, has been used in over 400 films since 1951!"
              : randomFact
            }
          </p>
          
          {!showEasterEgg && (
            <div className="mt-4 text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
              Click for a surprise! 🎭
            </div>
          )}
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-slate-500 text-sm font-light py-7">
          "Even the greatest filmmakers know that not every scene makes it to the final cut."
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;