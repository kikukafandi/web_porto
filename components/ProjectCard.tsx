/**
 * ProjectCard Component
 * Displays a project with glassmorphism design
 */

import React from 'react';
import Link from 'next/link';
import { Card } from './ui/Card';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  thumbnailUrl: string;
  demoUrl?: string | null;
  repoUrl?: string | null;
}

export function ProjectCard({ 
  id, 
  title, 
  description, 
  techStack, 
  thumbnailUrl,
  demoUrl,
  repoUrl 
}: ProjectCardProps) {
  return (
    <Card hover className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70 mb-4 line-clamp-3">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech) => (
            <span 
              key={tech}
              className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90 border border-white/20"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Demo →
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors"
            >
              Code →
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
