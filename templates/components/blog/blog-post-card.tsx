import Link from 'next/link';

// This type can be expanded or moved to a central types file (e.g., @/lib/types)
export type Post = {
  slug: string;
  title: string;
  excerpt?: string;
};

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-2xl font-bold mb-2">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      {post.excerpt && <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>}
      <Link href={`/blog/${post.slug}`} className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
        Read More &rarr;
      </Link>
    </article>
  );
}

