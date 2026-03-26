// components/common/LoadingSpinner.jsx
import React from 'react';
import { Film } from 'lucide-react';
import '../../App.css';

// ─── Ring size map ────────────────────────────────────────────────────────────
const RING_SIZES = {
  xs: { ring: 'w-4 h-4',    border: 'border-2',      dot: 'w-1 h-1',     text: 'text-xs',   gap: 'gap-1.5' },
  sm: { ring: 'w-5 h-5',    border: 'border-2',      dot: 'w-1.5 h-1.5', text: 'text-sm',   gap: 'gap-2'   },
  md: { ring: 'w-7 h-7',    border: 'border-2',      dot: 'w-2 h-2',     text: 'text-base', gap: 'gap-2.5' },
  lg: { ring: 'w-10 h-10',  border: 'border-[3px]',  dot: 'w-2.5 h-2.5', text: 'text-lg',   gap: 'gap-3'   },
  xl: { ring: 'w-14 h-14',  border: 'border-4',      dot: 'w-3 h-3',     text: 'text-xl',   gap: 'gap-4'   },
};

// ─── Variant colour map ───────────────────────────────────────────────────────
const VARIANT_COLORS = {
  default:   { ring: 'border-brand-primary',  dot: 'bg-brand-primary',  text: 'text-text-secondary' },
  primary:   { ring: 'border-brand-primary',  dot: 'bg-brand-primary',  text: 'text-brand-primary'  },
  secondary: { ring: 'border-text-secondary', dot: 'bg-text-secondary', text: 'text-text-secondary' },
  accent:    { ring: 'border-brand-accent',   dot: 'bg-brand-accent',   text: 'text-brand-accent'   },
  white:     { ring: 'border-white',          dot: 'bg-white',          text: 'text-white'           },
};

// ─── Core ring spinner ────────────────────────────────────────────────────────
export const RingSpinner = ({ size = 'md', variant = 'default' }) => {
  const s = RING_SIZES[size]  || RING_SIZES.md;
  const v = VARIANT_COLORS[variant] || VARIANT_COLORS.default;
  return (
    <div className={`relative flex-shrink-0 ${s.ring}`}>
      {/* Track */}
      <div className={`absolute inset-0 rounded-full ${s.border} border-surface-tertiary`} />
      {/* Spinning arc */}
      <div className={`absolute inset-0 rounded-full ${s.border} ${v.ring} border-t-transparent animate-spin`} />
      {/* Inner pulse dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`rounded-full ${s.dot} ${v.dot} animate-pulse`} />
      </div>
    </div>
  );
};

// ─── Main LoadingSpinner component ────────────────────────────────────────────
const LoadingSpinner = ({
  size = 'md',
  variant = 'default',
  className = '',
  text = '',
  centered = false,
  fullScreen = false,
}) => {
  const s = RING_SIZES[size]  || RING_SIZES.md;
  const v = VARIANT_COLORS[variant] || VARIANT_COLORS.default;

  const spinnerContent = (
    <div className={`flex items-center justify-center ${s.gap}`}>
      <RingSpinner size={size} variant={variant} />
      {text && (
        <span className={`${s.text} ${v.text} font-medium`}>{text}</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center bg-surface-primary/80 backdrop-blur-sm z-50 ${className}`}>
        {spinnerContent}
      </div>
    );
  }

  if (centered) {
    return (
      <div className={`flex justify-center items-center w-full h-full ${className}`}>
        {spinnerContent}
      </div>
    );
  }

  return <div className={`flex justify-center ${className}`}>{spinnerContent}</div>;
};

// Specialized loading components

export const PageLoader = ({ text = 'Loading...', className = '' }) => (
  <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
    <div className="text-center space-y-4">
      <div className="relative inline-flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-surface-tertiary" />
        <div className="absolute w-14 h-14 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
        <Film className="absolute w-5 h-5 text-brand-primary" />
      </div>
      <p className="text-text-secondary text-sm font-medium">{text}</p>
    </div>
  </div>
);

export const InlineLoader = ({ text = '', className = '' }) => (
  <div className={`flex items-center justify-center gap-2.5 py-4 ${className}`}>
    <RingSpinner size="sm" />
    {text && <span className="text-text-secondary text-sm font-medium">{text}</span>}
  </div>
);

export const ButtonLoader = ({ size = 'sm' }) => (
  <RingSpinner size={size} variant="white" />
);

export const FullScreenLoader = ({ text = 'Loading...', className = '' }) => (
  <LoadingSpinner size="xl" variant="primary" text={text} fullScreen className={className} />
);

export const CenteredLoader = ({ size = 'md', text = '', className = '' }) => (
  <LoadingSpinner size={size} text={text} centered className={className} />
);

export const CardLoader = () => (
  <div className="rounded-xl overflow-hidden">
    <div className="skeleton-shimmer rounded-xl mb-3" style={{ aspectRatio: '2/3' }} />
    <div className="space-y-2 px-1">
      <div className="skeleton-shimmer h-4 rounded-md" style={{ width: '75%' }} />
      <div className="skeleton-shimmer h-3 rounded-md" style={{ width: '45%' }} />
    </div>
  </div>
);

export const MovieGridLoader = ({ count = 12 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
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