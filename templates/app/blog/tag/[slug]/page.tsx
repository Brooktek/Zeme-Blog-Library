import { BlogPostList, Post } from '@/components/blog/blog-post-list';
import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

interface TagPageProps {
  params: { slug: string };
}

// This function fetches the tag and its posts
async function getTagWithPosts(slug: string) {
  const supabase = createClient();
  // This is a bit more complex due to the many-to-many relationship.
  // We select the tag and then join to get the posts.
  const { data, error } = await supabase
    .from('tags')
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
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getTagWithPosts(params.slug);

  if (!tag) {
    return { title: 'Tag Not Found' };
  }

  return {
    title: `Posts tagged with: ${tag.name}`,
    description: `A collection of posts tagged with ${tag.name}.`,
  };
}

// This is the main page component
export default async function TagPage({ params }: TagPageProps) {
  const tagData = await getTagWithPosts(params.slug);

  if (!tagData) {
    notFound();
  }

  const { name, posts } = tagData;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Tag: <span className="text-purple-600">{name}</span>
      </h1>
      {posts && posts.length > 0 ? (
        <BlogPostList posts={posts as Post[]} />
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No posts found with this tag.</p>
      )}
    </div>
  );
}

