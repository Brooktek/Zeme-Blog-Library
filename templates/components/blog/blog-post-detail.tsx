import React from 'react';
import { CategoryBadge } from './category-badge';
import { TagBadge } from './tag-badge';

// Expanded PostDetail type to include categories and tags
export type PostDetail = {
  title: string;
  content: string; // Assumed to be pre-sanitized HTML
  created_at: string;
  author?: {
    name: string;
  };
  categories: {
    slug: string;
    name: string;
  } | null;
  tags: {
    slug: string;
    name: string;
  }[];
};

interface BlogPostDetailProps {
  post: PostDetail;
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="prose dark:prose-invert lg:prose-xl mx-auto py-12 px-4">
      <header className="mb-10 text-center">
        {post.categories && (
          <div className="mb-4">
            <CategoryBadge category={post.categories} />
          </div>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-4">
          {post.title}
        </h1>
        <div className="text-base text-gray-500 dark:text-gray-400">
          {post.author && <span>By {post.author.name}</span>}
          {post.author && formattedDate && ' • '}
          <time dateTime={post.created_at}>{formattedDate}</time>
        </div>
      </header>

      {/* Ensure content is sanitized before rendering */}
      <div
        className="prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags && post.tags.length > 0 && (
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag.slug} tag={tag} />
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}


