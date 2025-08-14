'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<Partial<Tag> | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/tags');
        if (!response.ok) throw new Error('Failed to fetch tags');
        const data: Tag[] = await response.json();
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleDelete = async (tagId: number) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        const response = await fetch(`/api/admin/tags/${tagId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete tag');
        setTags(tags.filter((t: Tag) => t.id !== tagId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };

  const handleSave = async (data: Partial<Tag>, id?: number) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/tags/${id}` : '/api/admin/tags';
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save tag');

      if (id) {
        const updatedTag: Tag = await response.json();
        setTags(tags.map((t: Tag) => (t.id === id ? updatedTag : t)));
      } else {
        const newTag: Tag = await response.json();
        setTags([...tags, newTag]);
      }
      setEditingTag(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Tags</h1>
      <div className="mb-6">
        <button onClick={() => setEditingTag({ name: '', slug: '', description: '' })} className="bg-blue-500 text-white px-4 py-2 rounded">
          New Tag
        </button>
      </div>

      {editingTag && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">{editingTag.id ? 'Edit Tag' : 'New Tag'}</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(editingTag, editingTag.id); }}>
            <div className="mb-2">
              <label className="block">Name</label>
              <input
                type="text"
                value={editingTag.name || ''}
                onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block">Slug</label>
              <input
                type="text"
                value={editingTag.slug || ''}
                onChange={(e) => setEditingTag({ ...editingTag, slug: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block">Description</label>
              <textarea
                value={editingTag.description || ''}
                onChange={(e) => setEditingTag({ ...editingTag, description: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setEditingTag(null)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
          </form>
        </div>
      )}

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Slug</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag: Tag) => (
            <tr key={tag.id}>
              <td className="py-2 px-4 border-b">{tag.name}</td>
              <td className="py-2 px-4 border-b">{tag.slug}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => setEditingTag(tag)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDelete(tag.id)} className="text-red-500 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
