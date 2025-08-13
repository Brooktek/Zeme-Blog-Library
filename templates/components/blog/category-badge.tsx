import * as React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface CategoryBadgeProps {
  category: {
    slug: string;
    name: string;
  };
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Link href={`/blog/category/${category.slug}`}>
      <Badge variant="secondary">{category.name}</Badge>
    </Link>
  );
}

