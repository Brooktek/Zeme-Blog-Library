// Placeholder for Single Post page
import React from 'react';
import BlogPostDetail from '@/components/blog/blog-post-detail';

const SinglePostPage = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="container mx-auto p-4">
      <BlogPostDetail />
    </div>
  );
};

export default SinglePostPage;
