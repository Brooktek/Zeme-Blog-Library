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
      className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-900 hover:bg-blue-200 dark:hover:bg-blue-300 transition-colors duration-300"
    >
      {category.name}
    </Link>
  );
}


