import { BlogPostList, Post } from '@/components/blog/blog-post-list';
import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

interface CategoryPageProps {
  params: { slug: string };
}

// This function fetches the category and its posts
async function getCategoryWithPosts(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select(`
      name,
      posts ( * )
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// This function generates the dynamic metadata for the page
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryWithPosts(params.slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `Posts in: ${category.name}`,
    description: `A collection of posts in the ${category.name} category.`,
  };
}

// This is the main page component
export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryData = await getCategoryWithPosts(params.slug);

  if (!categoryData) {
    notFound();
  }

  const { name, posts } = categoryData;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Category: <span className="text-indigo-600">{name}</span>
      </h1>
      {posts && posts.length > 0 ? (
        <BlogPostList posts={posts as Post[]} />
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No posts found in this category.</p>
      )}
    </div>
  );
}

