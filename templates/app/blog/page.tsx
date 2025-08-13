// Placeholder for Blog page
import React from 'react';
import BlogPostList from '@/components/blog/blog-post-list';

const BlogPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">My Blog</h1>
      <BlogPostList />
    </div>
  );
};

export default BlogPage;
