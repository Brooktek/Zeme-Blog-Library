import { BlogPostCard, Post } from '@/components/blog/blog-post-card';

interface BlogPostListProps {
  posts: Post[];
}

export function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogPostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

