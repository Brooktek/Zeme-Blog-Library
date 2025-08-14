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

// Type for the data handled by the post form
export type PostData = {
  title: string;
  slug: string;
  content: string;
  category_id?: number;
  status: 'draft' | 'published';
  // Note: tag_ids will be handled separately after post creation/update
};

// Basic types for categories and tags used in forms and lists
export type Category = {
  id: string;
  name: string;
};

export type Tag = {
  id: string;
  name: string;
};
