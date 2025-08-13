import React from 'react';

// This type should align with your data fetching logic and can be centralized
export type PostDetail = {
  title: string;
  content: string; // Assumed to be pre-sanitized HTML
  published_at?: string;
  author?: {
    name: string;
  };
};

interface BlogPostDetailProps {
  post: PostDetail;
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className="prose dark:prose-invert lg:prose-xl mx-auto py-8">
      <header className="mb-8 text-center border-b pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">{post.title}</h1>
        <div className="text-gray-600 dark:text-gray-400 mt-2">
          {post.author && <span>By {post.author.name}</span>}
          {post.author && formattedDate && ' • '}
          {formattedDate && <time dateTime={post.published_at}>{formattedDate}</time>}
        </div>
      </header>
      {/* Ensure content is sanitized before rendering */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

