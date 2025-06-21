/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Brand Colors
      colors: {
        brand: {
          primary: '#FACC15',     // Electric yellow
          secondary: '#0F172A',   // Deep slate
          accent: '#F43F5E',      // Vibrant rose
        },
        
        // Surface Colors
        surface: {
          primary: '#0F172A',     // Main background
          secondary: '#1E293B',   // Cards, modals
          tertiary: '#334155',    // Elevated surfaces
          interactive: '#475569', // Hover states
        },
        
        // Extended Text Colors
        text: {
          primary: '#FFFFFF',     // Headlines, primary text
          secondary: '#CBD5E1',   // Body text, descriptions
          tertiary: '#94A3B8',    // Meta info, timestamps
          muted: '#64748B',       // Disabled, placeholders
        },
        
        // Semantic Colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        
        // Extended Yellow Palette
        yellow: {
          50: '#FEFCE8',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FACC15',  // Primary brand
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
        },
        
        // Extended Slate Palette (for surfaces & text)
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',  // Primary background
        },
        
        // Extended Rose Palette (for accents)
        rose: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',  // Accent color
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
      },
      
      // Typography System
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'hero': ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'display': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-lg': ['clamp(1.5rem, 4vw, 2.25rem)', { lineHeight: '1.2' }],
        'heading-md': ['clamp(1.25rem, 3vw, 1.5rem)', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
      },
      
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      
      // Spacing Scale
      spacing: {
        'xs': '0.25rem',    // 4px
        'sm': '0.5rem',     // 8px
        'md': '1rem',       // 16px
        'lg': '1.5rem',     // 24px
        'xl': '2rem',       // 32px
        '2xl': '3rem',      // 48px
        '3xl': '4rem',      // 64px
        '4xl': '5rem',      // 80px
        '5xl': '6rem',      // 96px
        '6xl': '8rem',      // 128px
      },
      
      // Border Radius
      borderRadius: {
        'sm': '0.375rem',   // 6px - buttons, small elements
        'md': '0.75rem',    // 12px - cards, inputs
        'lg': '1rem',       // 16px - modals, large cards
        'xl': '1.5rem',     // 24px - hero elements
        '2xl': '2rem',      // 32px
        '3xl': '3rem',      // 48px
      },
      
      // Box Shadows
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'glow': '0 0 0 1px rgb(250 204 21 / 0.3)',
        'glow-lg': '0 0 20px rgb(250 204 21 / 0.3)',
        'glow-rose': '0 0 20px rgb(244 63 94 / 0.3)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      
      // Background Images & Gradients
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        'gradient-card': 'linear-gradient(145deg, #1E293B 0%, #334155 100%)',
        'gradient-accent': 'linear-gradient(90deg, #FACC15 0%, #F43F5E 100%)',
        'gradient-overlay': 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.6) 50%, transparent 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
      // Animation & Transitions
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
      
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      // Custom Animations
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'skeleton': 'skeleton 1.5s infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 1s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        skeleton: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(250 204 21 / 0.2)' },
          '100%': { boxShadow: '0 0 20px rgb(250 204 21 / 0.6)' },
        },
      },
      
      // Backdrop Filters
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      
      // Grid Templates
      gridTemplateColumns: {
        'movies-mobile': 'repeat(2, 1fr)',
        'movies-tablet': 'repeat(3, 1fr)',
        'movies-desktop': 'repeat(auto-fill, minmax(200px, 1fr))',
        'movies-wide': 'repeat(auto-fill, minmax(250px, 1fr))',
        'sidebar': '300px 1fr',
        'header': '1fr auto',
      },
      
      // Z-Index Scale
      zIndex: {
        'behind': '-1',
        'normal': '0',
        'tooltip': '10',
        'dropdown': '20',
        'sticky': '30',
        'modal': '40',
        'popover': '50',
        'toast': '60',
      },
      
      // Container Sizes
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2rem',
          '2xl': '2rem',
        },
      },
      
      // Max Width Scale
      maxWidth: {
        'content': '1440px',
        'prose': '65ch',
        'screen-3xl': '1920px',
      },
      
      // Aspect Ratios
      aspectRatio: {
        'poster': '2/3',
        'backdrop': '16/9',
        'square': '1/1',
        'video': '16/9',
      },
    },
  },
  plugins: [
    // Add any additional plugins here
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
  ],
}