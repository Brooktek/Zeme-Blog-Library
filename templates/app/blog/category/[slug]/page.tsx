import { getPostsByCategory } from '../../../../../lib/blog-api';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const posts = await getPostsByCategory(params.slug);

  if (!posts) {
    notFound();
  }

  return (
    <div>
      <h1>Category: {params.slug}</h1>
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

const CategoryPage = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Category: {params.slug}</h1>
      <BlogPostList />
    </div>
  );
};

export default CategoryPage;
