'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PostForm } from '@/components/admin/post-form';
import { PostData, Category, Tag } from '@/lib/types';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const [postRes, catRes, tagRes] = await Promise.all([
          fetch(`/api/admin/posts/${id}`),
          fetch('/api/admin/categories'),
          fetch('/api/admin/tags'),
        ]);

        if (!postRes.ok || !catRes.ok || !tagRes.ok) {
          throw new Error('Failed to fetch required data');
        }

        const postData = await postRes.json();
        const catData = await catRes.json();
        const tagData = await tagRes.json();

        setPost(postData);
        setCategories(catData);
        setTags(tagData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSave = async (formData: PostData, selectedTags: string[], coverImageFile?: File) => {
    try {
      let coverImageUrl = formData.cover_image_url; // Keep existing image by default

      if (coverImageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', coverImageFile);

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload cover image');
        }

        const uploadResult = await uploadResponse.json();
        coverImageUrl = uploadResult.url;
      }

      const postDataWithImage = {
        ...formData,
        tag_ids: selectedTags,
        cover_image_url: coverImageUrl,
      };

      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postDataWithImage),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post');
      }

      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  if (loading) return <div className="text-center py-10">Loading post data...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!post) return <div className="text-center py-10">Post not found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Edit Post</h1>
      <PostForm
        post={post}
        categories={categories}
        tags={tags}
        onSave={handleSave}
      />
    </div>
  );
}
