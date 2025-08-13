import { getPostsByTag } from '../../../../../lib/blog-api';
import { notFound } from 'next/navigation';

export default async function TagPage({ params }: { params: { slug: string } }) {
  const posts = await getPostsByTag(params.slug);

  if (!posts) {
    notFound();
  }

  return (
    <div>
      <h1>Tag: {params.slug}</h1>
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

const TagPage = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Tag: {params.slug}</h1>
      <BlogPostList />
    </div>
  );
};

export default TagPage;
