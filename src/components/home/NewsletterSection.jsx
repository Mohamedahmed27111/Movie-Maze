import React, { useState } from 'react';
import { Mail, Check, AlertCircle, Send, Film, Star, Zap } from 'lucide-react';

const NewsletterSection = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Call the parent's onSubscribe function
      await onSubscribe(email);
      
      setStatus('success');
      setMessage('Successfully subscribed! Check your inbox for confirmation.');
      setEmail('');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-surface-primary to-brand-accent/10" />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        <div className="absolute top-20 left-10 animate-bounce-subtle">
          <Film className="w-8 h-8 text-brand-primary/30" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce-subtle" style={{ animationDelay: '1s' }}>
          <Star className="w-6 h-6 text-brand-accent/30" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce-subtle" style={{ animationDelay: '2s' }}>
          <Zap className="w-7 h-7 text-brand-primary/30" />
        </div>
        <div className="absolute bottom-40 right-10 animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>
          <Film className="w-5 h-5 text-brand-accent/30" />
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-32 right-32 w-20 h-20 bg-brand-primary/5 rounded-full animate-pulse-slow" />
        <div className="absolute bottom-32 left-32 w-16 h-16 bg-brand-accent/5 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="text-5xl mb-6">📺</div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Never Miss a Blockbuster
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              Get the latest movie releases, exclusive reviews, and personalized recommendations 
              delivered straight to your inbox. Join over 50,000 movie enthusiasts!
            </p>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 bg-surface-secondary border border-surface-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                  disabled={status === 'loading'}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 min-w-[120px] ${
                  status === 'success'
                    ? 'bg-success text-white cursor-not-allowed'
                    : status === 'loading'
                    ? 'bg-surface-interactive text-text-secondary cursor-not-allowed'
                    : 'bg-brand-primary text-surface-primary hover:bg-yellow-500 active:transform active:scale-95'
                }`}
              >
                {status === 'loading' && (
                  <div className="w-4 h-4 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
                )}
                {status === 'success' && <Check className="w-4 h-4" />}
                {status === 'idle' && <Send className="w-4 h-4" />}
                {status === 'error' && <Send className="w-4 h-4" />}
                
                {status === 'loading' && 'Subscribing...'}
                {status === 'success' && 'Subscribed!'}
                {(status === 'idle' || status === 'error') && 'Subscribe'}
              </button>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`flex items-center justify-center gap-2 text-sm ${
                status === 'success' ? 'text-success' : 'text-error'
              }`}>
                {status === 'error' && <AlertCircle className="w-4 h-4" />}
                {status === 'success' && <Check className="w-4 h-4" />}
                {message}
              </div>
            )}
          </form>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Latest Releases</h3>
              <p className="text-text-secondary text-sm">
                Be the first to know about new movies and exclusive content
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Expert Reviews</h3>
              <p className="text-text-secondary text-sm">
                In-depth reviews and ratings from our movie experts
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Film className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Personalized</h3>
              <p className="text-text-secondary text-sm">
                Tailored recommendations based on your preferences
              </p>
            </div>
          </div>

          {/* Privacy Notice */}
          <p className="text-text-muted text-xs mt-6">
            We respect your privacy. Unsubscribe at any time. 
            <span className="text-brand-primary hover:text-yellow-500 cursor-pointer ml-1">
              View Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;