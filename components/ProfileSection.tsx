'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProfileSkeleton } from './ProfileSkeleton';

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

interface SocialMedia {
    id: string;
    platform: string;
    username: string;
    url: string;
    icon?: string;
    isActive: boolean;
    order: number;
}

export function ProfileSection() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, socialRes] = await Promise.all([
                    fetch('/api/profile'),
                    fetch('/api/social-media')
                ]);

                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                if (socialRes.ok) {
                    const socialData = await socialRes.json();
                    setSocialMedias(socialData);
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!profile) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">Profile data not available</p>
            </div>
        );
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
            id="about"
        >
            <div className="glass rounded-2xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">About Me</h2>
                    <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
                        {profile.bio}
                    </p>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-6 mb-8 text-sm"
                >
                    <div className="flex items-center gap-2 text-gray-300">
                        <span>📧</span>
                        <a href={`mailto:${profile.email}`} className="hover:text-purple-300 transition-colors">
                            {profile.email}
                        </a>
                    </div>
                    {profile.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                            <span>📱</span>
                            <a href={`tel:${profile.phone}`} className="hover:text-purple-300 transition-colors">
                                {profile.phone}
                            </a>
                        </div>
                    )}
                    {profile.location && (
                        <div className="flex items-center gap-2 text-gray-300">
                            <span>📍</span>
                            <span>{profile.location}</span>
                        </div>
                    )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-4 mb-8"
                >
                    <Link
                        href="/cv"
                        className="glass rounded-xl px-6 py-3 font-medium bg-linear-to-r from-purple-600/80 to-purple-700/80 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 border border-white/20 hover:border-white/30 backdrop-blur-sm"
                    >
                        📄 View CV
                    </Link>
                    
                    {profile.cvUrl && (
                        <a
                            href={profile.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass rounded-xl px-6 py-3 font-medium bg-linear-to-r from-gray-600/80 to-gray-700/80 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 border border-white/20 hover:border-white/30 backdrop-blur-sm"
                        >
                            📥 Download CV
                        </a>
                    )}
                    
                    <a
                        href={`mailto:${profile.email}`}
                        className="glass rounded-xl px-6 py-3 font-medium bg-linear-to-r from-green-600/80 to-green-700/80 hover:from-green-600 hover:to-green-700 transition-all duration-300 border border-white/20 hover:border-white/30 backdrop-blur-sm"
                    >
                        💬 Get in Touch
                    </a>
                </motion.div>

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-8 pt-8 border-t border-white/10"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Skills & Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                                    className="px-3 py-1 bg-white/10 text-white/90 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Social Media Links */}
                {socialMedias.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                        className="mt-8 pt-8 border-t border-white/10"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Let's Connect</h3>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            {socialMedias.map((social, index) => (
                                <motion.a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.1 + index * 0.1, duration: 0.3 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 backdrop-blur-sm group"
                                    title={`${social.platform}: @${social.username}`}
                                >
                                    {social.icon ? (
                                        <i className={`${social.icon} text-lg text-white/80 group-hover:text-white transition-colors`}></i>
                                    ) : (
                                        <span className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-xs font-bold text-white">
                                            {social.platform.charAt(0)}
                                        </span>
                                    )}
                                    <span className="text-white/80 group-hover:text-white transition-colors text-sm font-medium">
                                        {social.platform}
                                    </span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
}