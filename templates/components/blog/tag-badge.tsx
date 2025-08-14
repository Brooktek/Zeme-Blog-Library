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
      className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
    >
      {tag.name}
    </Link>
  );
}