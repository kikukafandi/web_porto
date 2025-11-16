'use client';

import React, { useState, useEffect } from 'react';
import { motion,easeOut } from 'framer-motion';
import Link from 'next/link';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    coverImage?: string | null;
    content: string;
    tags: string[];
    createdAt: string;
}

interface BlogSectionProps {
    posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <section className="mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Latest Blog Posts
                    </h2>
                    <p className="text-white/60 text-lg">
                        Thoughts, tutorials, and insights about development
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                            <div className="h-4 bg-white/20 rounded mb-4"></div>
                            <div className="h-20 bg-white/10 rounded mb-4"></div>
                            <div className="flex gap-2">
                                <div className="h-6 w-16 bg-white/10 rounded"></div>
                                <div className="h-6 w-20 bg-white/10 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: easeOut
            }
        }
    };

    return (
        <section className="mb-16">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <motion.div className="text-center mb-12" variants={itemVariants}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Latest Blog Posts
                    </h2>
                    <p className="text-white/60 text-lg">
                        Thoughts, tutorials, and insights about development
                    </p>
                </motion.div>

                {posts.length > 0 ? (
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                    >
                        {posts.slice(0, 6).map((post) => (
                            <motion.article
                                key={post.id}
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="glass rounded-2xl p-6 soft-shadow hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                                        {post.coverImage && (
                                            <div className="mb-4 rounded-xl overflow-hidden">
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}

                                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-purple-300 transition-colors">
                                            {post.title}
                                        </h3>

                                        <p className="text-white/70 mb-4 line-clamp-3 flex-grow text-sm leading-relaxed">
                                            {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="text-xs text-white/50 mt-auto">
                                            {new Date(post.createdAt).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-16"
                        variants={itemVariants}
                    >
                        <div className="glass rounded-2xl p-8">
                            <div className="text-6xl mb-4">✍️</div>
                            <h3 className="text-2xl font-bold text-white mb-4">No Blog Posts Yet</h3>
                            <p className="text-white/60">
                                Stay tuned for upcoming articles and tutorials!
                            </p>
                        </div>
                    </motion.div>
                )}

                {posts.length > 6 && (
                    <motion.div className="text-center mt-8" variants={itemVariants}>
                        <Link
                            href="/blog"
                            className="inline-flex items-center px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            View All Posts
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}