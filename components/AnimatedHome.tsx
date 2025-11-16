'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogSection } from './BlogSection';
import { Experience } from './Experience';
import { ProfileSection } from './ProfileSection';
import { containerVariants, itemVariants, badgeVariants } from '@/lib/animations';

interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    thumbnailUrl: string;
    demoUrl?: string | null;
    repoUrl?: string | null;
    createdAt: Date;
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    coverImage?: string | null;
    content: string;
    tags: string[];
    createdAt: string;
}

interface ExperienceItem {
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
    technologies: string[];
    type: 'work' | 'education' | 'project';
}

interface Profile {
    id: string;
    name: string;
    title: string;
    bio: string;
    email: string;
    phone?: string;
    location?: string;
    avatarUrl?: string;
    cvUrl?: string;
    skills: string[];
    isActive: boolean;
}

interface AnimatedHomeProps {
    projects: Project[];
    blogs?: BlogPost[];
    experiences?: ExperienceItem[];
}

export function AnimatedHome({ projects, blogs = [], experiences = [] }: AnimatedHomeProps) {
    const [mounted, setMounted] = useState(false);
    const [randomValues, setRandomValues] = useState<{ x: number; y: number; delay: number; duration: number }[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        // Generate random values on client side to avoid hydration mismatch
        const values = Array.from({ length: 12 }, () => ({
            x: Math.random() * 800,
            y: Math.random() * 400,
            delay: Math.random() * 2,
            duration: 6 + Math.random() * 4
        }));
        setRandomValues(values);
        setMounted(true);

        // Fetch profile data
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/profile');
                if (response.ok) {
                    const profileData = await response.json();
                    setProfile(profileData);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <motion.main
            className="max-w-6xl mx-auto px-6 pt-28 pb-10 grid gap-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* HERO */}
            <motion.section
                className="glass rounded-3xl soft-shadow p-8 grid md:grid-cols-2 gap-6 items-center relative overflow-hidden"
                variants={itemVariants}
            >
                {/* Animated background particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {mounted && randomValues.map((values, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
                            initial={{
                                x: values.x,
                                y: values.y,
                                scale: 0,
                            }}
                            animate={{
                                x: values.x + 100,
                                y: values.y + 100,
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: values.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: values.delay
                            }}
                        />
                    ))}
                </div>

                {/* left: identity */}
                <motion.div variants={itemVariants}>
                    {/* headline */}
                    <motion.h1
                        className="text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {profile?.name || 'Tirta "Kikuk" Afandi'}
                    </motion.h1>

                    <motion.p
                        className="mt-3 text-gray-300 max-w-xl leading-relaxed"
                        variants={itemVariants}
                    >
                        {profile?.bio || 'Backend Engineer — building reliable, clean, and scalable backend systems with Node.js, NestJS, and pragmatic architecture. Clear Flow Programming Style.'}
                    </motion.p>

                    {/* quick badges */}
                    <motion.div
                        className="mt-6 flex flex-wrap gap-3"
                        variants={containerVariants}
                    >
                        {(profile?.skills?.slice(0, 4) || ['Node.js', 'NestJS', 'JavaScript', 'SQL / Prisma']).map((tech, index) => (
                            <motion.span
                                key={tech}
                                className="glass rounded-full px-3 py-1 text-xs hover:bg-purple-500/20 transition-colors cursor-default"
                                variants={badgeVariants}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* ctas */}
                    <motion.div
                        className="mt-6 flex gap-3"
                        variants={containerVariants}
                    >
                        <motion.a
                            className="glass rounded-xl px-4 py-2 font-medium hover:bg-purple-500/20 transition-all duration-300 border border-transparent hover:border-purple-400/30"
                            href="#projects"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            variants={itemVariants}
                        >
                            See Projects
                        </motion.a>
                        <motion.a
                            className="glass rounded-xl px-4 py-2 font-medium bg-linear-to-r from-purple-600/80 to-purple-700/80 hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
                            href={`mailto:${profile?.email || 'admin@example.com'}`}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            variants={itemVariants}
                        >
                            Hire Me
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* right: profile card */}
                <motion.div
                    className="flex justify-center md:justify-end"
                    variants={itemVariants}
                >
                    <motion.div
                        className="glass rounded-3xl p-4 w-64 md:w-72 soft-shadow flex flex-col items-center relative"
                        whileHover={{ scale: 1.02, rotateY: 5 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* avatar */}
                        <motion.div
                            className="w-32 h-32 rounded-2xl bg-linear-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center mb-4 relative overflow-hidden"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {profile?.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.name || 'Profile'}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            ) : (
                                <motion.span
                                    className="text-4xl font-bold text-purple-300"
                                    animate={{
                                        textShadow: [
                                            "0 0 0 rgba(168, 85, 247, 0)",
                                            "0 0 20px rgba(168, 85, 247, 0.5)",
                                            "0 0 0 rgba(168, 85, 247, 0)"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : 'KA'}
                                </motion.span>
                            )}
                        </motion.div>

                        <motion.h3
                            className="text-lg font-semibold text-center mb-2"
                            variants={itemVariants}
                        >
                            {profile?.title || 'Backend Engineer'}
                        </motion.h3>

                        <motion.p
                            className="text-sm text-gray-400 text-center mb-4"
                            variants={itemVariants}
                        >
                            {profile?.location || 'Specialized in scalable systems and clean architecture'}
                        </motion.p>

                        <motion.div
                            className="text-xs text-purple-400 font-medium"
                            variants={itemVariants}
                        >
                            Available for projects
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>



            {/* PROJECTS SECTION */}
            <motion.section id="projects" variants={itemVariants}>
                <motion.div
                    className="text-center mb-8"
                    variants={itemVariants}
                >
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-white to-purple-300 bg-clip-text text-transparent"
                        variants={itemVariants}
                    >
                        Featured Projects
                    </motion.h2>
                    <motion.p
                        className="text-gray-400 text-lg"
                        variants={itemVariants}
                    >
                        Some of my recent work
                    </motion.p>
                </motion.div>

                {projects.length > 0 ? (
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                    >
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                                variants={itemVariants}
                                whileHover={{
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                                custom={index}
                            >
                                <motion.div
                                    className="aspect-video bg-linear-to-br from-purple-500/20 to-purple-700/20 rounded-xl mb-4 overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {project.thumbnailUrl ? (
                                        <img
                                            src={project.thumbnailUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-purple-300 text-2xl font-bold">
                                                {project.title.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>

                                <motion.h3
                                    className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors"
                                    variants={itemVariants}
                                >
                                    {project.title}
                                </motion.h3>

                                <motion.p
                                    className="text-gray-400 text-sm mb-4 line-clamp-3"
                                    variants={itemVariants}
                                >
                                    {project.description}
                                </motion.p>

                                <motion.div
                                    className="flex flex-wrap gap-2 mb-4"
                                    variants={containerVariants}
                                >
                                    {project.techStack.slice(0, 3).map((tech) => (
                                        <motion.span
                                            key={tech}
                                            className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full"
                                            variants={badgeVariants}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {tech}
                                        </motion.span>
                                    ))}
                                </motion.div>

                                <motion.div
                                    className="flex gap-2"
                                    variants={containerVariants}
                                >
                                    {project.demoUrl && (
                                        <motion.a
                                            href={project.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs bg-purple-600/80 hover:bg-purple-600 text-white px-3 py-1 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Demo
                                        </motion.a>
                                    )}
                                    {project.repoUrl && (
                                        <motion.a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs border border-purple-400/30 text-purple-300 hover:bg-purple-500/20 px-3 py-1 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Code
                                        </motion.a>
                                    )}
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="glass rounded-2xl p-12 text-center"
                        variants={itemVariants}
                    >
                        <motion.p
                            className="text-gray-400 text-lg"
                            variants={itemVariants}
                        >
                            Projects coming soon...
                        </motion.p>
                    </motion.div>
                )}

                <motion.div
                    className="text-center mt-8"
                    variants={itemVariants}
                >
                    <Link href="/projects">
                        <motion.button
                            className="glass rounded-xl px-6 py-3 font-medium hover:bg-purple-500/20 transition-all duration-300 border border-transparent hover:border-purple-400/30"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View All Projects →
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.section>


            {/* Dynamic Profile Section */}
            <ProfileSection />

            {/* Blog Section */}
            <motion.section variants={itemVariants}>
                <BlogSection posts={blogs} />
            </motion.section>

            {/* Experience Section */}
            <motion.section variants={itemVariants}>
                <Experience experiences={experiences} />
            </motion.section>
        </motion.main>
    );
}