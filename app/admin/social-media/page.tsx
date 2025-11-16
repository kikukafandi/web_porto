'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SocialMedia {
    id: string;
    platform: string;
    username: string;
    url: string;
    icon?: string;
    isActive: boolean;
    order: number;
    createdAt: string;
}

export default function AdminSocialMediaPage() {
    const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        platform: '',
        username: '',
        url: '',
        icon: '',
        order: 0
    });

    const platformIcons = {
        'GitHub': 'fab fa-github',
        'LinkedIn': 'fab fa-linkedin',
        'Twitter': 'fab fa-twitter',
        'Instagram': 'fab fa-instagram',
        'Facebook': 'fab fa-facebook',
        'YouTube': 'fab fa-youtube',
        'TikTok': 'fab fa-tiktok',
        'Discord': 'fab fa-discord',
        'Telegram': 'fab fa-telegram',
        'WhatsApp': 'fab fa-whatsapp'
    };

    useEffect(() => {
        fetchSocialMedias();
    }, []);

    const fetchSocialMedias = async () => {
        try {
            const response = await fetch('/api/social-media');
            const data = await response.json();
            setSocialMedias(data);
        } catch (error) {
            console.error('Failed to fetch social media links:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `/api/social-media/${editingId}`
                : '/api/social-media';
            
            const method = editingId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchSocialMedias();
                resetForm();
                alert(editingId ? 'Social media berhasil diupdate!' : 'Social media berhasil ditambahkan!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Failed to save social media:', error);
            alert('Gagal menyimpan social media');
        }
    };

    const handleEdit = (socialMedia: SocialMedia) => {
        setFormData({
            platform: socialMedia.platform,
            username: socialMedia.username,
            url: socialMedia.url,
            icon: socialMedia.icon || '',
            order: socialMedia.order
        });
        setEditingId(socialMedia.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus social media ini?')) return;

        try {
            const response = await fetch(`/api/social-media/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchSocialMedias();
                alert('Social media berhasil dihapus!');
            } else {
                alert('Gagal menghapus social media');
            }
        } catch (error) {
            console.error('Failed to delete social media:', error);
            alert('Gagal menghapus social media');
        }
    };

    const resetForm = () => {
        setFormData({
            platform: '',
            username: '',
            url: '',
            icon: '',
            order: 0
        });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-700 rounded mb-6"></div>
                        <div className="grid gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Kelola Social Media</h1>
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {showForm ? 'Batal' : 'Tambah Social Media'}
                    </Button>
                </div>

                {showForm && (
                    <Card className="mb-6 p-6 bg-gray-800/50 border-gray-700">
                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? 'Edit Social Media' : 'Tambah Social Media Baru'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Platform *
                                    </label>
                                    <select
                                        value={formData.platform}
                                        onChange={(e) => {
                                            const platform = e.target.value;
                                            setFormData({ 
                                                ...formData, 
                                                platform,
                                                icon: platformIcons[platform as keyof typeof platformIcons] || ''
                                            });
                                        }}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Pilih Platform</option>
                                        {Object.keys(platformIcons).map(platform => (
                                            <option key={platform} value={platform}>{platform}</option>
                                        ))}
                                        <option value="Other">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Username *
                                    </label>
                                    <Input
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="kikukafandi"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        URL *
                                    </label>
                                    <Input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://github.com/kikukafandi"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Icon Class
                                    </label>
                                    <Input
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        placeholder="fab fa-github"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Urutan
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    {editingId ? 'Update' : 'Tambah'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-600 hover:bg-gray-700"
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                <div className="grid gap-4">
                    {socialMedias.length === 0 ? (
                        <Card className="p-8 bg-gray-800/50 border-gray-700 text-center">
                            <p className="text-gray-400">Belum ada social media link. Tambahkan yang pertama!</p>
                        </Card>
                    ) : (
                        socialMedias.map((socialMedia) => (
                            <Card key={socialMedia.id} className="p-6 bg-gray-800/50 border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg">
                                            {socialMedia.icon ? (
                                                <i className={`${socialMedia.icon} text-2xl text-purple-400`}></i>
                                            ) : (
                                                <span className="text-purple-400 font-bold">
                                                    {socialMedia.platform.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {socialMedia.platform}
                                            </h3>
                                            <p className="text-gray-400">@{socialMedia.username}</p>
                                            <a
                                                href={socialMedia.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-400 hover:text-purple-300 text-sm"
                                            >
                                                {socialMedia.url}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                            Order: {socialMedia.order}
                                        </span>
                                        <Button
                                            onClick={() => handleEdit(socialMedia)}
                                            className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(socialMedia.id)}
                                            className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1"
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}