import { BlogPostDetail } from '@/components/blog/blog-post-detail';
import { Post } from '@/lib/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

// This function fetches the data
async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories ( id, name ),
      tags ( id, name )
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  // The query returns categories and tags as objects, which is fine.
  // If they were single values, you might need to map them.
  return data as Post;
}

// This function generates the dynamic metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160), // Use a snippet for description
  };
}

// This is the main page component
export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostDetail post={post} />;
}
