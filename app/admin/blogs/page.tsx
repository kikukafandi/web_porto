/**
 * Admin Blogs Management Page
 * CRUD interface for blog posts
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/FileUpload';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    coverImage: '',
    tags: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(s => s.trim()),
      coverImage: formData.coverImage || null,
    };

    try {
      const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchBlogs();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      coverImage: blog.coverImage || '',
      tags: blog.tags.join(', '),
    });
    setEditingId(blog.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchBlogs();
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      coverImage: '',
      tags: '',
    });
    setEditingId(null);
    setShowForm(false);
    setSelectedFile(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Manage Blogs</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Blog Post'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId ? 'Edit Blog Post' : 'New Blog Post'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({ 
                  ...formData, 
                  title,
                  slug: formData.slug || generateSlug(title)
                });
              }}
              required
            />
            <Input
              label="Slug (URL-friendly)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Cover Image
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                placeholder="Upload cover image"
                currentImage={formData.coverImage}
              />
              {uploadingImage && (
                <p className="text-sm text-purple-400 mt-2">Uploading image...</p>
              )}
            </div>
            <Textarea
              label="Content (Markdown supported)"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              required
            />
            <Input
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="nextjs, typescript, tutorial"
              required
            />
            <div className="flex gap-4">
              <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {blogs.map((blog) => (
          <Card key={blog.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{blog.title}</h3>
                <p className="text-white/60 text-sm mb-2">Slug: /{blog.slug}</p>
                <p className="text-white/70 mb-2 line-clamp-2">{blog.content.substring(0, 200)}...</p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-purple-500/20 rounded text-sm text-purple-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(blog)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(blog.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
