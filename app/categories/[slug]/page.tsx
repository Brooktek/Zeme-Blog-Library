import { getBlogPosts, getBlogCategory, type BlogPost, type BlogCategory } from "@/lib/blog-api"
import { BlogPostList } from "@/components/blog/blog-post-list"

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category: BlogCategory | null = await getBlogCategory(params.slug)
  const posts: BlogPost[] = await getBlogPosts({ category: params.slug })

  if (!category) {
    return <div>Category not found</div>
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-4 text-4xl font-bold">{category.name}</h1>
      <p className="mb-8 text-lg text-gray-600">{category.description}</p>
      <BlogPostList initialPosts={posts} />
    </div>
  )
}
