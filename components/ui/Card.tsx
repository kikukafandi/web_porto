/**
 * Card Component with Glassmorphism Design
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  const hoverStyles = hover 
    ? 'hover:bg-white/15 hover:scale-105 transition-all duration-300' 
    : '';

  return (
    <div className={`
      bg-white/10 backdrop-blur-md rounded-xl 
      border border-white/20 shadow-xl
      ${hoverStyles} ${className}
    `}>
      {children}
    </div>
  );
}
