'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string | null;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({
  id,
  title,
  description,
  price,
  thumbnailUrl,
  onAddToCart
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, quantity: 1 })
      });

      if (response.ok) {
        onAddToCart?.(id);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card hover className="overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-500">
        {thumbnailUrl && (
          <div className="relative aspect-video w-full overflow-hidden">
            <motion.img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700"
              animate={{
                scale: isHovered ? 1.1 : 1,
                filter: isHovered ? "brightness(1.1)" : "brightness(1)"
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20
              }}
              className="absolute top-4 right-4"
            >
              <div className="bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                Digital Product
              </div>
            </motion.div>
          </div>
        )}

        <div className="p-6 relative">
          <motion.div
            animate={{
              y: isHovered ? -2 : 0,
              transition: { duration: 0.3 }
            }}
          >
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-white/70 mb-4 line-clamp-3 group-hover:text-white/90 transition-colors duration-300">
              {description}
            </p>
          </motion.div>

          <div className="flex items-center justify-between">
            <motion.span
              className="text-3xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors duration-300"
              animate={{
                scale: isHovered ? 1.05 : 1,
                transition: { duration: 0.3 }
              }}
            >
              {formattedPrice}</motion.span>

            <div className="flex gap-2">
              <Link href={`/products/${id}`}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
                >
                  Details
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg ${isAdding
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-purple-500/25'
                  } text-white border border-purple-500/30 hover:border-purple-400/50`}
              >
                {isAdding ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  'Add to Cart'
                )}
              </motion.button>
            </div>
          </div>

          {/* Floating particles effect on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 300,
                  y: Math.random() * 200,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  y: isHovered ? Math.random() * 100 - 50 : 0,
                  scale: isHovered ? Math.random() * 0.5 + 0.5 : 0,
                  opacity: isHovered ? Math.random() * 0.7 + 0.3 : 0,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: Math.random() * 2
                }}
                className="absolute w-1 h-1 bg-purple-400/50 rounded-full"
              />
            ))}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
