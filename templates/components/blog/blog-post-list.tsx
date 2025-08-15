"use client"

import { useState, useEffect } from 'react';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { Post } from '@/lib/types';

function BlogPostSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="bg-muted h-48 rounded-t-lg"></div>
            <div className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
            </div>
        </div>
    );
}

export function BlogPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch('/api/blog/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <BlogPostSkeleton key={i} />
            ))}
        </div>
    );
  }

  if (posts.length === 0) {
    return <p className="text-center text-muted-foreground">No posts found. Check back later!</p>;
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

