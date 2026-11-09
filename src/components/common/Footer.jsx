import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Twitter } from 'lucide-react';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com', Icon: Github },
  { label: 'Twitter', href: 'https://twitter.com', Icon: Twitter },
  { label: 'Email', href: 'mailto:hello@moviemaze.com', Icon: Mail },
];

const footerLinks = {
  Explore: [
    { name: 'Popular', path: '/movies?category=popular' },
    { name: 'Top Rated', path: '/movies?category=top_rated' },
    { name: 'Upcoming', path: '/movies?category=upcoming' },
  ],
  Discover: [
    { name: 'Search', path: '/search' },
    { name: 'Genres', path: '/movies' },
    { name: 'Trending', path: '/movies?category=trending' },
  ],
  Support: [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
  ],
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }, 1000);
  };

  return (
    <footer className="mt-16 border-t border-[#1B2238] bg-[#080B15]">
      <div className="page-container py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <section aria-labelledby="newsletter-title">
            <h2 id="newsletter-title" className="text-xl font-bold text-[#F4F6FB]">
              Never miss a release
            </h2>
            <p className="mt-1 text-sm text-[#9AA4BF]">
              New movies and trending picks, in your inbox.
            </p>
            <form onSubmit={handleEmailSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubscribing}
                className="h-11 min-w-0 flex-1 rounded-full border border-[#232C48] bg-[#131A2E] px-4 text-sm text-[#F4F6FB] placeholder:text-[#9AA4BF] focus:border-[#FFC933] focus:outline-none focus:ring-2 focus:ring-[#FFC933]/25"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="ui-interactive ui-button ui-primary-button min-h-11 rounded-full bg-[#FFC933] px-6 text-sm font-bold text-[#0A0E1A] disabled:cursor-wait disabled:opacity-70"
              >
                {subscribed ? 'Subscribed' : isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            <div className="mt-4 flex gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="social-link ui-interactive flex h-10 w-10 items-center justify-center rounded-full border border-[#232C48] bg-[#131A2E] text-[#9AA4BF]"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-3 gap-4">
            {Object.entries(footerLinks).map(([title, links]) => (
              <nav key={title} aria-label={title}>
                <h3 className="mb-3 text-sm font-semibold text-[#F4F6FB]">{title}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="footer-link ui-interactive text-sm text-[#9AA4BF]"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-[#1B2238] pt-5 text-xs leading-relaxed text-[#9AA4BF] sm:flex sm:items-center sm:justify-between sm:gap-4">
          <p>© {currentYear} Movie Maze. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
