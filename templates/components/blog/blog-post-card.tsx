import Link from 'next/link';
import { CategoryBadge } from './category-badge';
import { TagBadge } from './tag-badge';
import { Post } from '@/lib/types';

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="flex-grow p-6">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.categories && <CategoryBadge category={post.categories} />}
        </div>
        <h2 className="text-2xl font-bold text-primary">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 text-muted-foreground line-clamp-3">
          {post.excerpt || 'No excerpt available.'}
        </p>
      </div>
      <div className="mt-auto border-t bg-card p-6">
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag.slug} tag={tag} />
            ))}
          </div>
        )}
        <Link href={`/blog/${post.slug}`} className="font-semibold text-primary hover:underline">
          Read More
        </Link>
      </div>
    </article>
  );
}


