import Link from 'next/link';

interface TagBadgeProps {
  tag: {
    slug: string;
    name: string;
  };
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link 
      href={`/blog/tag/${tag.slug}`}
      className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-200 dark:text-green-900 hover:bg-green-200 dark:hover:bg-green-300 transition-colors duration-300"
    >
      {tag.name}
    </Link>
  );
}