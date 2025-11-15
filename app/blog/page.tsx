/**
 * Blog List Page
 * Shows all published blog posts
 */

import { prisma } from '@/lib/prisma';
import { BlogCard } from '@/components/BlogCard';
import Link from 'next/link';

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-white/70 text-lg">
            Thoughts, tutorials, and insights on backend development
          </p>
        </div>

        {blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard 
                key={blog.id} 
                {...blog} 
                createdAt={blog.createdAt.toISOString()}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
            <p className="text-white/60 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
