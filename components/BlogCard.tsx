/**
 * BlogCard Component
 * Displays a blog post with glassmorphism design
 */

import React from 'react';
import Link from 'next/link';
import { Card } from './ui/Card';

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  content: string;
  tags: string[];
  createdAt: string;
}

export function BlogCard({ 
  id,
  title, 
  slug,
  coverImage,
  content,
  tags,
  createdAt 
}: BlogCardProps) {
  // Extract first 150 characters as excerpt
  const excerpt = content.substring(0, 150).replace(/[#*`]/g, '') + '...';
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Link href={`/blog/${slug}`}>
      <Card hover className="overflow-hidden cursor-pointer">
        {coverImage && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={coverImage} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <p className="text-white/60 text-sm mb-2">{formattedDate}</p>
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-white/70 mb-4">{excerpt}</p>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-purple-500/20 backdrop-blur-sm rounded-full text-sm text-purple-300 border border-purple-400/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
