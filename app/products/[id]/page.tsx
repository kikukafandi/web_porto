/**
 * Product Detail Page
 * Shows product details and checkout form
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string | null;
}

export default function ProductDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPurchasing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: params.id,
          buyerEmail,
          buyerName: buyerName || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to payment page
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error || 'Failed to create checkout');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60 text-lg">Loading...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/products">
            <Button variant="secondary">Back to Products</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="text-purple-400 hover:text-purple-300 transition-colors mb-8 inline-block">
          ← Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Info */}
          <div>
            {product.thumbnailUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-xl mb-6">
                <img 
                  src={product.thumbnailUrl} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <Card className="p-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                {product.title}
              </h1>
              <p className="text-white/70 text-lg mb-6 whitespace-pre-wrap">
                {product.description}
              </p>
              <div className="text-5xl font-bold text-purple-400">
                {formattedPrice}
              </div>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Purchase Now
              </h2>

              <form onSubmit={handleCheckout} className="space-y-6">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="your@email.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  required
                />

                <Input
                  type="text"
                  label="Name (Optional)"
                  placeholder="Your Name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                />

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={purchasing}
                >
                  {purchasing ? 'Processing...' : 'Proceed to Payment'}
                </Button>

                <p className="text-white/40 text-sm text-center">
                  Secure payment via OY! Indonesia
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
