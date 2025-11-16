/**
 * Individual Blog Post Page
 * Displays full blog post content
 */

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!blog) {
    notFound();
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen py-20 px-4">
      <article className="max-w-4xl mx-auto">
        <Link href="/blog" className="text-purple-400 hover:text-purple-300 transition-colors mb-8 inline-block">
          ← Back to Blog
        </Link>

        {blog.coverImage && (
          <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
            <img 
              src={blog.coverImage} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Card className="p-8 md:p-12">
          <p className="text-white/60 mb-4">{formattedDate}</p>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag: string) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-purple-500/20 backdrop-blur-sm rounded-full text-sm text-purple-300 border border-purple-400/20"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>
        </Card>
      </article>
    </div>
  );
}

// Remove generateStaticParams to avoid database connection during build
// This will make the page render dynamically instead of statically
export const dynamic = 'force-dynamic';
