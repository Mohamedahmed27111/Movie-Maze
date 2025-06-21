// App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MovieProvider } from './contexts/MovieContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
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

// Loading fallback component
const AppLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-text-secondary">Loading Movie Maze...</p>
    </div>
  </div>
);

export default App;