import { getPosts } from '../../../../lib/blog-api';
import { notFound } from 'next/navigation';

export default async function BlogPage() {
  const posts = await getPosts();

  if (!posts) {
    notFound();
  }

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>
            <a href={`/blog/posts/slug/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
import React from 'react';
import BlogPostList from '@/components/blog/blog-post-list';

const BlogPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">My Blog</h1>
      <BlogPostList />
    </div>
  );
};

export default BlogPage;
