/**
 * Input Component with Glassmorphism Design
 */
"use client";
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-white/80 mb-2 font-medium">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-lg
          bg-white/10 backdrop-blur-md
          border border-white/20
          text-white placeholder-white/50
          focus:outline-none focus:ring-2 focus:ring-purple-500/50
          transition-all duration-300
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
