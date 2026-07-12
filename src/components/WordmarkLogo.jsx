import React from 'react';

export default function WordmarkLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-8 h-8 flex items-center justify-center bg-brand-glow/10 border border-brand/20 rounded-lg">
        {/* Stylized abstract "V" chevron mark suggesting perspective and dimension */}
        <svg
          className="w-5 h-5 text-brand drop-shadow-[0_0_6px_rgba(230,160,40,0.4)]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 8L12 18L20 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 8L12 13L16 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-display text-base font-bold tracking-[0.2em] text-text-primary uppercase">
          VESPER<span className="text-brand">.</span>
        </span>
        <span className="font-mono text-[8px] tracking-[0.3em] text-text-secondary uppercase -mt-0.5">
          ATELIER
        </span>
      </div>
    </div>
  );
}
