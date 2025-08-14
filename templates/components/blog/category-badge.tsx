import Link from 'next/link';

interface CategoryBadgeProps {
  category: {
    slug: string;
    name: string;
  };
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Link 
      href={`/blog/category/${category.slug}`}
      className="inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent/80"
    >
      {category.name}
    </Link>
  );
}


