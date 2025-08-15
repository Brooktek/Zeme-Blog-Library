'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostForm } from '@/components/admin/post-form';
import { PostData, Category, Tag } from '@/lib/types';

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/tags'),
        ]);

        if (!catRes.ok || !tagRes.ok) {
          throw new Error('Failed to fetch categories or tags');
        }

        const catData = await catRes.json();
        const tagData = await tagRes.json();

        setCategories(catData);
        setTags(tagData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSave = async (formData: PostData, selectedTags: string[], coverImageFile?: File) => {
    try {
      let coverImageUrl = '';

      if (coverImageFile) {
        console.log('Uploading cover image...', { fileName: coverImageFile.name, size: coverImageFile.size });
        
        const uploadFormData = new FormData();
        uploadFormData.append('file', coverImageFile);

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          const errorMessage = errorData.message || 'Failed to upload cover image';
          console.error('Upload failed:', errorData);
          throw new Error(errorMessage);
        }

        const uploadResult = await uploadResponse.json();
        coverImageUrl = uploadResult.url;
        console.log('Cover image uploaded successfully:', coverImageUrl);
      }

      const postDataWithImage = {
        ...formData,
        tag_ids: selectedTags,
        cover_image_url: coverImageUrl,
      };

      console.log('Creating post with data:', postDataWithImage);

      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postDataWithImage),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      console.log('Post created successfully');
      router.push('/admin/posts');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error in handleSave:', err);
      setError(errorMessage);
      // Don't re-throw the error, just set it in state
    }
  };

  if (loading) return <div className="text-center py-10">Loading form...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Create New Post</h1>
      <PostForm
        categories={categories}
        tags={tags}
        onSave={handleSave}
      />
    </div>
  );
}
