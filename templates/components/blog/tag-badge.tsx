import * as React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface TagBadgeProps {
  tag: {
    slug: string;
    name: string;
  };
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link href={`/blog/tag/${tag.slug}`}>
      <Badge variant="outline">{tag.name}</Badge>
    </Link>
  );
}