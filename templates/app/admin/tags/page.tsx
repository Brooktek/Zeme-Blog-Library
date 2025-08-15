'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchTags();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchTags();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleDelete = async (tagId: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      setDeletingTagId(tagId);
      try {
        const response = await fetch(`/api/admin/tags/${tagId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete tag');
        setTags(tags.filter(t => t.id !== tagId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setDeletingTagId(null);
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading tags...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Tags</h1>
        <Button asChild>
          <Link href="/admin/tags/new">Create New Tag</Link>
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"></th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{tag.name}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{tag.slug}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm text-right space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/tags/${tag.id}/edit`}>Edit</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(tag.id)}
                    disabled={deletingTagId === tag.id}
                  >
                    {deletingTagId === tag.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
