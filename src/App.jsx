// App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MovieProvider } from './contexts/MovieContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ErrorBoundary>
      <div className="App bg-surface-primary min-h-screen text-text-primary">
        <Router>
              <ScrollToTop />
              <MovieProvider>
                <div className="flex flex-col min-h-screen">
                  {/* Header */}
                  <Header />
                  
                  {/* Main Content */}
                  <main className="flex-1 pt-16">
                    <Suspense fallback={<AppLoadingFallback />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/movies" element={<MoviesPage />} />
                        <Route path="/movie/:id" element={<MovieDetailsPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        
                                              
                        
                        {/* 404 Route */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </Suspense>
                  </main>
                  
                  {/* Footer */}
                  <Footer />
                </div>
              </MovieProvider>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

// Loading fallback component — no external imports needed
const AppLoadingFallback = () => (
  <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-surface-primary gap-6">
    {/* Ring spinner */}
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-surface-tertiary" />
      <div className="absolute inset-0 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
      {/* Inner dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-brand-primary animate-pulse" />
      </div>
    </div>
    <div className="text-center space-y-1">
      <p className="text-text-primary font-bold text-xl tracking-wide">Movie Maze</p>
      <p className="text-text-muted text-sm animate-pulse">Loading your cinema experience...</p>
    </div>
  </div>
);

export default App;

// Scrolls to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}