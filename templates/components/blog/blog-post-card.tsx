import Link from 'next/link';
import { CategoryBadge } from './category-badge';
import { TagBadge } from './tag-badge';

// Expanded Post type to include more details for the card display
export type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  created_at: string;
  categories: {
    slug: string;
    name: string;
  } | null;
  tags: {
    slug: string;
    name: string;
  }[];
};

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="mb-4 flex-grow">
        <div className="flex items-center justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.categories && <CategoryBadge category={post.categories} />}
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt || 'No excerpt available.'}
        </p>
      </div>
      <div className="mt-auto">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <TagBadge key={tag.slug} tag={tag} />
            ))}
          </div>
        )}
        <Link href={`/blog/${post.slug}`} className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 group-hover:translate-x-1 transition-transform duration-300 inline-block">
          Read More &rarr;
        </Link>
      </div>
    </article>
  );
}


