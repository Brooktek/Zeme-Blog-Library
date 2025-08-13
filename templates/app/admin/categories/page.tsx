'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCategories() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect posts using it.')) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete category');
        setCategories(categories.filter(c => c.id !== categoryId));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading categories...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Categories</h1>
        <Link href="/admin/categories/new">
          <span className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer">Create New Category</span>
        </Link>
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
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{category.name}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <p className="text-gray-900 dark:text-white whitespace-no-wrap">{category.slug}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                  <Link href={`/admin/categories/${category.id}/edit`}>
                    <span className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 cursor-pointer">Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400 ml-4">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

