'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types'; // Using the centralized Post type

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/admin/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setDeletingPostId(postId);
      try {
        const response = await fetch(`/api/admin/posts/${postId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete post');
        }

        // Refresh the list after deletion
        setPosts(posts.filter(p => p.id.toString() !== postId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setDeletingPostId(null);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading posts...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Manage Posts</h1>
          <Link href="/admin/posts/new">
            <span className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors">New Post</span>
          </Link>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"></th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                      <p className="text-gray-900 dark:text-gray-100 whitespace-no-wrap">{post.title}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                      <p className={`capitalize font-semibold ${post.published ? 'text-green-600' : 'text-yellow-600'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm">
                      <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-right">
                      <Link href={`/admin/posts/${post.id.toString()}/edit`}>
                        <span className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 cursor-pointer">Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id.toString())}
                        disabled={deletingPostId === post.id.toString()}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400 ml-4 disabled:opacity-50 disabled:cursor-not-allowed">
                        {deletingPostId === post.id.toString() ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id.toString())}
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
