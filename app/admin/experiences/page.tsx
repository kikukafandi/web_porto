'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface Experience {
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
    technologies: string[];
    type: 'WORK' | 'EDUCATION' | 'PROJECT';
    order: number;
    isActive: boolean;
    createdAt: string;
}

export default function AdminExperiencesPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<{
        company: string;
        position: string;
        duration: string;
        description: string;
        technologies: string;
        type: 'WORK' | 'EDUCATION' | 'PROJECT';
        order: number;
    }>({
        company: '',
        position: '',
        duration: '',
        description: '',
        technologies: '',
        type: 'WORK',
        order: 0
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await fetch('/api/experiences');
            const data = await response.json();
            setExperiences(data);
        } catch (error) {
            console.error('Failed to fetch experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            technologies: formData.technologies.split(',').map(s => s.trim()).filter(Boolean)
        };

        try {
            const url = editingId ? `/api/experiences/${editingId}` : '/api/experiences';
            const method = editingId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchExperiences();
                resetForm();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || 'Failed to save experience'}`);
            }
        } catch (error) {
            console.error('Failed to save experience:', error);
            alert('Failed to save experience');
        }
    };

    const handleEdit = (experience: Experience) => {
        setFormData({
            company: experience.company,
            position: experience.position,
            duration: experience.duration,
            description: experience.description,
            technologies: experience.technologies.join(', '),
            type: experience.type,
            order: experience.order
        });
        setEditingId(experience.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            const response = await fetch(`/api/experiences/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchExperiences();
            } else {
                alert('Failed to delete experience');
            }
        } catch (error) {
            console.error('Failed to delete experience:', error);
            alert('Failed to delete experience');
        }
    };

    const resetForm = () => {
        setFormData({
            company: '',
            position: '',
            duration: '',
            description: '',
            technologies: '',
            type: 'WORK',
            order: 0
        });
        setEditingId(null);
        setShowForm(false);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'WORK': return 'bg-green-500/20 text-green-300';
            case 'EDUCATION': return 'bg-blue-500/20 text-blue-300';
            case 'PROJECT': return 'bg-purple-500/20 text-purple-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-white">Loading experiences...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold text-white">Manage Experiences</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add Experience'}
                </Button>
            </div>

            {showForm && (
                <Card className="p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {editingId ? 'Edit Experience' : 'New Experience'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Company/Institution"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                required
                            />
                            <Input
                                label="Position/Role"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <Input
                                label="Duration"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="2020 - 2023"
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'WORK' | 'EDUCATION' | 'PROJECT' })}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="WORK">Work</option>
                                    <option value="EDUCATION">Education</option>
                                    <option value="PROJECT">Project</option>
                                </select>
                            </div>
                            <Input
                                label="Order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <Textarea
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            required
                        />

                        <Input
                            label="Technologies (comma-separated)"
                            value={formData.technologies}
                            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                            placeholder="React, Node.js, TypeScript"
                            required
                        />

                        <div className="flex gap-4">
                            <Button type="submit">
                                {editingId ? 'Update Experience' : 'Create Experience'}
                            </Button>
                            <Button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-700">
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid gap-6">
                {experiences.length > 0 ? (
                    experiences.map((experience) => (
                        <Card key={experience.id} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{experience.position}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(experience.type)}`}>
                                            {experience.type}
                                        </span>
                                        <span className="text-sm text-gray-400">Order: {experience.order}</span>
                                    </div>
                                    <h4 className="text-lg text-purple-300 mb-2">{experience.company}</h4>
                                    <p className="text-sm text-gray-400 mb-3">{experience.duration}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleEdit(experience)} className="text-sm">
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(experience.id)}
                                        className="text-sm bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-4">{experience.description}</p>

                            <div className="flex flex-wrap gap-2">
                                {experience.technologies.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm border border-white/20"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-8 text-center">
                        <p className="text-gray-400">No experiences found. Create your first experience!</p>
                    </Card>
                )}
            </div>
        </div>
    );
}