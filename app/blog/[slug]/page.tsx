import { BlogPostDetail } from "@/components/blog/blog-post-detail"
import { getBlogPost } from "@/lib/blog-api"
import { notFound } from "next/navigation"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Pass the slug directly from params
  return (
    <div className="min-h-screen bg-background">
      <BlogPostDetail slug={params.slug} />
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Deconstruct the slug from params
  const { slug } = params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
  }
}
