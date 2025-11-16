'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

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
    createdAt: string;
}

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        avatarUrl: '',
        cvUrl: '',
        skills: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setProfile(data);
                    setFormData({
                        name: data.name || '',
                        title: data.title || '',
                        bio: data.bio || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        location: data.location || '',
                        avatarUrl: data.avatarUrl || '',
                        cvUrl: data.cvUrl || '',
                        skills: data.skills?.join(', ') || ''
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
                })
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                alert('Profile berhasil disimpan!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
            alert('Gagal menyimpan profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-700 rounded mb-6"></div>
                        <div className="h-64 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Kelola Profile</h1>
                </div>

                <Card className="p-6 bg-gray-800/50 border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Nama Lengkap *
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Tirta Kikuk Afandi"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Title/Posisi *
                                </label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Backend Engineer"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Email *
                                </label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Telepon
                                </label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+62 812 3456 7890"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Lokasi
                                </label>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Jakarta, Indonesia"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    URL Avatar
                                </label>
                                <Input
                                    value={formData.avatarUrl}
                                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Bio/Deskripsi *
                            </label>
                            <Textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Ceritakan tentang diri Anda..."
                                rows={4}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Skills (pisahkan dengan koma)
                            </label>
                            <Input
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                placeholder="JavaScript, Node.js, React, PostgreSQL"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                URL CV/Resume
                            </label>
                            <Input
                                value={formData.cvUrl}
                                onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                                placeholder="https://example.com/resume.pdf"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {saving ? 'Menyimpan...' : 'Simpan Profile'}
                            </Button>
                            
                            {profile && (
                                <Button
                                    type="button"
                                    onClick={fetchProfile}
                                    className="bg-gray-600 hover:bg-gray-700"
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                {/* Preview */}
                {formData.name && (
                    <Card className="mt-6 p-6 bg-gray-800/50 border-gray-700">
                        <h3 className="text-xl font-bold mb-4">Preview Profile</h3>
                        <div className="flex items-start gap-6">
                            {formData.avatarUrl && (
                                <img
                                    src={formData.avatarUrl}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            )}
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold text-white">{formData.name}</h4>
                                <p className="text-purple-400 text-lg mb-2">{formData.title}</p>
                                <p className="text-gray-300 mb-4">{formData.bio}</p>
                                <div className="text-sm text-gray-400">
                                    <p>📧 {formData.email}</p>
                                    {formData.phone && <p>📱 {formData.phone}</p>}
                                    {formData.location && <p>📍 {formData.location}</p>}
                                </div>
                                {formData.skills && (
                                    <div className="mt-4">
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills.split(',').map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}