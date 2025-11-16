'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

interface Experience {
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
    technologies: string[];
    type: string;
    order: number;
    isActive: boolean;
}

interface SocialMedia {
    id: string;
    platform: string;
    username: string;
    url: string;
    icon?: string;
    order: number;
    isActive: boolean;
}

export function CVClient() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, experiencesRes, socialRes] = await Promise.all([
                    fetch('/api/profile'),
                    fetch('/api/experiences'),
                    fetch('/api/social-media')
                ]);

                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                if (experiencesRes.ok) {
                    const experiencesData = await experiencesRes.json();
                    setExperiences(experiencesData);
                }

                if (socialRes.ok) {
                    const socialData = await socialRes.json();
                    setSocialMedias(socialData);
                }
            } catch (error) {
                console.error('Failed to fetch CV data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading CV...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">CV Not Found</h1>
                    <p className="text-gray-600 mb-4">Profile data is not available</p>
                    <Link href="/" className="text-blue-600 hover:underline">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const workExperiences = experiences.filter(exp => exp.type === 'WORK');
    const education = experiences.filter(exp => exp.type === 'EDUCATION');
    const projects = experiences.filter(exp => exp.type === 'PROJECT');

    return (
        <div className="min-h-screen bg-white text-gray-900 print:bg-white print:text-xs print:leading-tight">

            {/* Header Actions - Hidden in Print */}
            <div className="print:hidden bg-gray-50 border-b border-gray-200 py-4 px-6">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                    >
                        ← Back to Portfolio
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        🖨️ Print CV
                    </button>
                </div>
            </div>

            {/* CV Content */}
            <div className="max-w-4xl mx-auto p-6 print:p-0 print:max-w-none">
                {/* Header Section */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                    <h2 className="text-xl text-gray-600 mb-4">{profile.title}</h2>

                    {/* Contact Information */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                            <span>📧</span>
                            <a href={`mailto:${profile.email}`} className="hover:text-blue-600">
                                {profile.email}
                            </a>
                        </div>
                        {profile.phone && (
                            <div className="flex items-center gap-1">
                                <span>📱</span>
                                <a href={`tel:${profile.phone}`} className="hover:text-blue-600">
                                    {profile.phone}
                                </a>
                            </div>
                        )}
                        {profile.location && (
                            <div className="flex items-center gap-1">
                                <span>📍</span>
                                <span>{profile.location}</span>
                            </div>
                        )}
                    </div>

                    {/* Social Media Links */}
                    {socialMedias.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            {socialMedias.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    {social.icon && <i className={social.icon}></i>}
                                    <span>{social.platform}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </header>

                {/* Professional Summary */}
                <section className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-4">
                        Professional Summary
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </section>

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-4">
                            Skills & Technologies
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {profile.skills.map((skill, index) => (
                                <div key={index} className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-800">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Work Experience */}
                {workExperiences.length > 0 && (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-4">
                            Work Experience
                        </h3>
                        <div className="space-y-6">
                            {workExperiences.map((exp) => (
                                <div key={exp.id} className="print-page">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                                            <p className="text-gray-600 font-medium">{exp.company}</p>
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium">{exp.duration}</span>
                                    </div>
                                    <p className="text-gray-700 mb-3 leading-relaxed">{exp.description}</p>
                                    {exp.technologies && exp.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {exp.technologies.map((tech, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-4">
                            Education
                        </h3>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="print-page">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">{edu.position}</h4>
                                            <p className="text-gray-600 font-medium">{edu.company}</p>
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium">{edu.duration}</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <section className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-4">
                            Notable Projects
                        </h3>
                        <div className="space-y-6">
                            {projects.map((project) => (
                                <div key={project.id} className="print-page">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">{project.position}</h4>
                                            <p className="text-gray-600 font-medium">{project.company}</p>
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium">{project.duration}</span>
                                    </div>
                                    <p className="text-gray-700 mb-3 leading-relaxed">{project.description}</p>
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, index) => (
                                                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="text-center text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200">
                    <p>Generated on {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                </footer>
            </div>
        </div>
    );
}