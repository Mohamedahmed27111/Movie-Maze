// components/common/LoadingSpinner.jsx
import React from 'react';
import { Loader2, Film, Star } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default', 
  className = '', 
  text = '',
  centered = false 
}) => {
  // Size configurations
  const sizes = {
    xs: {
      spinner: 'w-4 h-4',
      text: 'text-xs',
      container: 'gap-1'
    },
    sm: {
      spinner: 'w-5 h-5',
      text: 'text-sm',
      container: 'gap-2'
    },
    md: {
      spinner: 'w-6 h-6',
      text: 'text-base',
      container: 'gap-2'
    },
    lg: {
      spinner: 'w-8 h-8',
      text: 'text-lg',
      container: 'gap-3'
    },
    xl: {
      spinner: 'w-12 h-12',
      text: 'text-xl',
      container: 'gap-4'
    }
  };

  const currentSize = sizes[size] || sizes.md;

  // Variant configurations
  const variants = {
    default: {
      spinner: 'text-brand-primary',
      text: 'text-text-secondary'
    },
    primary: {
      spinner: 'text-brand-primary',
      text: 'text-brand-primary'
    },
    secondary: {
      spinner: 'text-text-secondary',
      text: 'text-text-secondary'
    },
    accent: {
      spinner: 'text-brand-accent',
      text: 'text-brand-accent'
    },
    white: {
      spinner: 'text-white',
      text: 'text-white'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  // Different spinner types
  const SpinnerIcon = ({ type }) => {
    const iconClass = `${currentSize.spinner} ${currentVariant.spinner}`;
    
    switch (type) {
      case 'film':
        return <Film className={`${iconClass} animate-bounce`} />;
      case 'star':
        return <Star className={`${iconClass} animate-spin`} />;
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-current rounded-full animate-bounce ${currentVariant.spinner}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div className={`${currentSize.spinner} ${currentVariant.spinner} animate-pulse`}>
            <div className="w-full h-full bg-current rounded-full opacity-75" />
          </div>
        );
      default:
        return <Loader2 className={`${iconClass} animate-spin`} />;
    }
  };

  // Container classes
  const containerClasses = [
    'flex items-center',
    currentSize.container,
    centered ? 'justify-center' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <SpinnerIcon type={variant === 'film' ? 'film' : variant === 'dots' ? 'dots' : 'default'} />
      {text && (
        <span className={`${currentSize.text} ${currentVariant.text} font-medium`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Specialized loading components
export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <LoadingSpinner size="xl" variant="primary" />
      <p className="mt-4 text-text-secondary">{text}</p>
    </div>
  </div>
);

export const InlineLoader = ({ text = 'Loading...' }) => (
  <LoadingSpinner size="sm" text={text} className="justify-center py-4" />
);

export const ButtonLoader = ({ size = 'sm' }) => (
  <LoadingSpinner size={size} variant="white" />
);

export const CardLoader = () => (
  <div className="animate-pulse">
    <div className="bg-surface-tertiary rounded-lg aspect-poster mb-4" />
    <div className="space-y-2">
      <div className="h-4 bg-surface-tertiary rounded w-3/4" />
      <div className="h-3 bg-surface-tertiary rounded w-1/2" />
    </div>
  </div>
);

export const MovieGridLoader = ({ count = 12 }) => (
  <div className="grid grid-movies-mobile md:grid-movies-tablet lg:grid-movies-desktop gap-6">
    {Array.from({ length: count }, (_, i) => (
      <CardLoader key={i} />
    ))}
  </div>
);

// Skeleton component for more complex loading states
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '', 
  animated = true 
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <div
        key={i}
        className={`h-4 bg-surface-tertiary rounded ${
          animated ? 'animate-pulse' : ''
        }`}
        style={{
          width: i === lines - 1 ? '75%' : '100%'
        }}
      />
    ))}
  </div>
);

// Movie details skeleton loader
export const MovieDetailsLoader = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Poster skeleton */}
      <div className="lg:col-span-1">
        <div className="bg-surface-tertiary rounded-lg aspect-poster w-full" />
      </div>
      
      {/* Details skeleton */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <div className="h-8 bg-surface-tertiary rounded w-3/4" />
          <div className="h-4 bg-surface-tertiary rounded w-1/2" />
          <div className="flex space-x-4">
            <div className="h-6 bg-surface-tertiary rounded w-16" />
            <div className="h-6 bg-surface-tertiary rounded w-20" />
            <div className="h-6 bg-surface-tertiary rounded w-24" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="h-4 bg-surface-tertiary rounded w-full" />
          <div className="h-4 bg-surface-tertiary rounded w-full" />
          <div className="h-4 bg-surface-tertiary rounded w-2/3" />
        </div>
        
        <div className="flex space-x-4">
          <div className="h-10 bg-surface-tertiary rounded w-32" />
          <div className="h-10 bg-surface-tertiary rounded w-28" />
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;