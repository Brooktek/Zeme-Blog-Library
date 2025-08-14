// This file defines shared types for the Zeme Blog System.

// Defines the structure for a blog post, including relations.
export type Post = {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  created_at: string;
  status: 'published' | 'draft';
  author?: {
    name: string;
  };
  categories: {
    id: number;
    slug: string;
    name: string;
  } | null;
  tags: {
    id: number;
    slug: string;
    name: string;
  }[];
};
