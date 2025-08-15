import React, { useState, useEffect } from 'react';
import { PostData, Category, Tag } from '@/lib/types';

interface PostFormProps {
  post?: PostData;
  categories: Category[];
  tags: Tag[];
  onSave: (data: PostData, selectedTags: string[], coverImageFile?: File) => void;
  isSubmitting?: boolean;
}

export function PostForm({ post, categories, tags, onSave, isSubmitting }: PostFormProps) {
  const [formData, setFormData] = useState<PostData>(
    post || { title: '', slug: '', content: '', status: 'draft', category_id: undefined, cover_image_url: '' }
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [fileError, setFileError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        category_id: post.category_id || '',
      });
      if (post.tags) {
        setSelectedTags(post.tags.map(t => t.id));
      }
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedTags(values);
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.';
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File too large. Maximum size is 5MB.';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setFileError(validationError);
        setCoverImageFile(undefined);
        e.target.value = '';
        return;
      }
      
      setCoverImageFile(file);
      console.log('File selected:', { name: file.name, size: file.size, type: file.type });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (fileError) {
      return; // Don't submit if there's a file error
    }
    
    setIsUploading(true);
    try {
      await onSave(formData, selectedTags, coverImageFile);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
        <input
          type="text"
          name="slug"
          id="slug"
          value={formData.slug}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Cover Image
          <span className="text-xs text-gray-500 ml-2">(JPEG, PNG, GIF, WebP, max 5MB)</span>
        </label>
        <input
          type="file"
          name="cover_image"
          id="cover_image"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        
        {fileError && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
            {fileError}
          </div>
        )}
        
        {coverImageFile && (
          <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
            File selected: {coverImageFile.name} ({(coverImageFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
        
        {formData.cover_image_url && !coverImageFile && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Current image:</p>
            <img src={formData.cover_image_url} alt="Current cover" className="mt-2 w-full max-w-xs h-auto rounded-md" />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
        <textarea
          name="content"
          id="content"
          rows={15}
          value={formData.content}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <select
          name="category_id"
          id="category_id"
          value={formData.category_id || ''}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
        <select
          multiple
          name="tags"
          id="tags"
          value={selectedTags}
          onChange={handleTagChange}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-32"
        >
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
        <select
          name="status"
          id="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting || isUploading ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </form>
  );
}
