import { BlogPostList } from "@/components/blog/blog-post-list"
import { getBlogPosts, getBlogCategories } from "@/lib/blog-api"

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getBlogPosts(), getBlogCategories()])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our latest articles, tutorials, and insights.
          </p>
        </div>

        <BlogPostList initialPosts={posts} initialCategories={categories} showFilters={true} />
      </div>
    </div>
  )
}
