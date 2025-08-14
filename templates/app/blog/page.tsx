import { BlogPostList } from '@/components/blog/blog-post-list';
import { Post } from '@/lib/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import React from 'react';

async function getPosts(): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      categories ( id, name ),
      tags ( id, name )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data as Post[];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Our Blog</h1>
      {posts.length > 0 ? (
        <BlogPostList posts={posts} />
      ) : (
        <p className="text-center text-muted-foreground">No posts found. Check back later!</p>
      )}
    </div>
  );
}

