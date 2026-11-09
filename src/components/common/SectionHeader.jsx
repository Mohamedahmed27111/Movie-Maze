import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SectionHeader = ({ title, to, className = '' }) => (
  <div className={`mb-4 flex items-center justify-between gap-4 ${className}`}>
    <h2 className="section-heading">{title}</h2>
    {to && (
      <Link
        to={to}
        className="section-view-all ui-interactive inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full text-sm font-semibold text-[#FFC933]"
      >
        View all <ArrowRight className="section-view-all-arrow h-4 w-4" aria-hidden="true" />
      </Link>
    )}
  </div>
);

export default SectionHeader;
