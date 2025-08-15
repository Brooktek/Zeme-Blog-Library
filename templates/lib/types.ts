// This file defines shared types for the Zeme Blog System.

// Defines the structure for a blog post, including relations.
export type Post = {
  id: string; // Changed to string for UUID
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  created_at: string;
  status: 'published' | 'draft';
  author?: {
    name: string;
  };
  category: {
    id: string; // Changed to string for UUID
    name: string;
  } | null;
  tags: {
    id: string; // Changed to string for UUID
    name: string;
  }[];
};

// Type for the data handled by the post form
export type PostData = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  category_id?: string; // Changed to string for UUID
  status: 'draft' | 'published';
  tags?: { id: string; name: string }[]; // Added tags to pre-populate form
};

// Basic types for categories and tags used in forms and lists
export type Category = {
  id: string;
  name: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};
