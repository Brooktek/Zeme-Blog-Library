// Placeholder for Category page
import React from 'react';
import BlogPostList from '@/components/blog/blog-post-list';

const CategoryPage = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Category: {params.slug}</h1>
      <BlogPostList />
    </div>
  );
};

export default CategoryPage;
