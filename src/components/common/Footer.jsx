// components/common/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Mail, Film, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const currentYear = new Date().getFullYear();

const footerLinks = {
    explore: [
      { name: 'Popular Movies', path: '/movies?category=popular' },
      { name: 'Top Rated', path: '/movies?category=top-rated' },
      { name: 'Now Playing', path: '/movies?category=now-playing' },
      { name: 'Upcoming', path: '/movies?category=upcoming' },
    ],
    discover: [
      { name: 'Search Movies', path: '/search' },
      { name: 'Browse by Genre', path: '/movies?view=genres' },
      { name: 'Trending', path: '/movies?category=trending' },
      { name: 'Random Movie', path: '/movies/random' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com', color: 'hover:text-text-primary' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com', color: 'hover:text-blue-400' },
    { name: 'Email', icon: Mail, url: 'mailto:hello@moviemaze.com', color: 'hover:text-brand-primary' },
  ];

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail('');
      // You can add success message here
    }, 1500);
  };

  return (
    <footer className="bg-surface-secondary border-t border-surface-tertiary">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="mb-8">
          {/* Brand Section */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 mb-4 group"
            >
              <div className="p-2 bg-brand-primary rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Film className="w-6 h-6 text-surface-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">Movie Maze</h3>
                <p className="text-xs text-text-tertiary">Discover Amazing Movies</p>
              </div>
            </Link>
            
            <p className="text-text-secondary text-sm mb-6 max-w-sm">
              Your ultimate destination for discovering, tracking, and enjoying the best movies. 
              From trending blockbusters to hidden gems, find your next favorite film.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-surface-tertiary rounded-lg text-text-tertiary transition-all duration-200 ${social.color} hover:scale-110 hover:shadow-lg`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links - Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-text-primary font-semibold text-base mb-3 pb-2 border-b border-surface-tertiary">
                Explore
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.explore.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-text-secondary hover:text-brand-primary transition-colors duration-200 text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-text-primary font-semibold text-base mb-3 pb-2 border-b border-surface-tertiary">
                Discover
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.discover.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-text-secondary hover:text-brand-primary transition-colors duration-200 text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="text-text-primary font-semibold text-base mb-3 pb-2 border-b border-surface-tertiary">
                Support
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-text-secondary hover:text-brand-primary transition-colors duration-200 text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup - Improved Mobile Responsiveness */}
        <div className="bg-surface-tertiary rounded-xl p-4 sm:p-6 mb-8">
          <div className="text-center sm:text-left mb-4 sm:mb-6">
            <h4 className="text-text-primary font-semibold text-lg mb-2">
              Stay Updated
            </h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              Get notified about new releases and trending movies
            </p>
          </div>
          
          {/* Email Form - Mobile First Approach */}
          <form onSubmit={handleEmailSubmit} className="space-y-3 sm:space-y-0">
            {/* Mobile: Stacked Layout */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 sm:py-2.5 bg-surface-primary border border-surface-interactive rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 text-sm"
                  required
                  disabled={isSubscribing}
                />
              </div>
              
              <button 
                type="submit"
                disabled={isSubscribing || !email.trim()}
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-brand-primary text-surface-primary font-medium rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              >
                {isSubscribing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-surface-primary/30 border-t-surface-primary rounded-full animate-spin"></div>
                    <span className="text-sm">Subscribing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="text-sm">Subscribe</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Privacy Notice */}
            <p className="text-text-muted text-xs leading-relaxed">
              By subscribing, you agree to receive email notifications about new movies and updates. 
              You can unsubscribe at any time.
            </p>
          </form>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-surface-tertiary pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-text-tertiary text-sm text-center sm:text-left">
                © {currentYear} Movie Maze. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/privacy"
                  className="text-text-tertiary hover:text-text-secondary text-sm transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-text-tertiary hover:text-text-secondary text-sm transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-text-tertiary text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>for movie lovers</span>
            </div>
          </div>
        </div>

        {/* TMDB Attribution */}
        <div className="mt-6 pt-4 border-t border-surface-tertiary/50">
          <p className="text-text-muted text-xs text-center">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;