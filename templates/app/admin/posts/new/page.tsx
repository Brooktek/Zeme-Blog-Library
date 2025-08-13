// Placeholder for New Post page
import React from 'react';
import PostForm from '@/components/admin/post-form';

const NewPostPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Create New Post</h1>
      <div className="mt-6">
        <PostForm />
      </div>
    </div>
  );
};

export default NewPostPage;
