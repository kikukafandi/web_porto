/**
 * ProductCard Component
 * Displays a digital product with glassmorphism design
 */

import React from 'react';
import Link from 'next/link';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string | null;
}

export function ProductCard({ 
  id,
  title, 
  description, 
  price,
  thumbnailUrl 
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

  return (
    <Card hover className="overflow-hidden">
      {thumbnailUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70 mb-4 line-clamp-3">{description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-purple-400">
            {formattedPrice}
          </span>
          <Link href={`/products/${id}`}>
            <Button variant="primary">
              Buy Now
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
