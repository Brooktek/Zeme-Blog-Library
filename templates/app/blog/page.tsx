import { BlogPostList } from '@/components/blog/blog-post-list';

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Our Blog</h1>
      <BlogPostList />
    </div>
  );
}

