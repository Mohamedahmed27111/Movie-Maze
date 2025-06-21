// components/common/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div className="min-h-screen bg-surface-primary flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-surface-secondary rounded-2xl p-8 shadow-xl border border-surface-tertiary">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
              </div>

              {/* Error Title */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-text-secondary">
                  We encountered an unexpected error. Don't worry, our team has been notified.
                </p>
              </div>

              {/* Error Details (Development only) */}
              {isDevelopment && error && (
                <div className="mb-6 p-4 bg-surface-tertiary rounded-lg border border-red-500/20">
                  <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Error Details (Development)
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-text-tertiary">Error:</span>
                      <p className="text-red-300 font-mono bg-surface-primary p-2 rounded mt-1">
                        {error.toString()}
                      </p>
                    </div>
                    {errorInfo && (
                      <div>
                        <span className="text-text-tertiary">Stack Trace:</span>
                        <pre className="text-red-300 font-mono bg-surface-primary p-2 rounded mt-1 overflow-x-auto text-xs">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error ID */}
              <div className="mb-6 p-3 bg-surface-tertiary rounded-lg border border-surface-interactive">
                <p className="text-xs text-text-tertiary mb-1">Error ID for support:</p>
                <code className="text-sm text-brand-primary font-mono">
                  {errorId}
                </code>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center px-6 py-3 bg-brand-primary text-surface-primary font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center px-6 py-3 bg-surface-tertiary text-text-primary font-semibold rounded-lg hover:bg-surface-interactive transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center px-6 py-3 bg-surface-tertiary text-text-primary font-semibold rounded-lg hover:bg-surface-interactive transition-colors duration-200"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 pt-6 border-t border-surface-tertiary text-center">
                <p className="text-text-tertiary text-sm">
                  If this problem persists, please{' '}
                  <a
                    href="mailto:support@moviemaze.com"
                    className="text-brand-primary hover:text-yellow-500 underline"
                  >
                    contact our support team
                  </a>
                  {' '}with the error ID above.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for hooks support
export const ErrorBoundaryWithHooks = ({ children, fallback }) => {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

// Simple error fallback component
export const SimpleErrorFallback = ({ error, retry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-text-primary mb-2">
      Something went wrong
    </h3>
    <p className="text-text-secondary mb-4">
      {error?.message || 'An unexpected error occurred'}
    </p>
    <button
      onClick={retry}
      className="px-4 py-2 bg-brand-primary text-surface-primary rounded-lg hover:bg-yellow-500 transition-colors duration-200"
    >
      Try again
    </button>
  </div>
);

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};

export default ErrorBoundary;