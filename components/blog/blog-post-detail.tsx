"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"
import { BlogPostCard } from "./blog-post-card"
import { getBlogPost, getRelatedPosts, type BlogPost } from "@/lib/blog-api"

interface BlogPostDetailProps {
  slug: string
}

export function BlogPostDetail({ slug }: BlogPostDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [slug])

  const loadPost = async () => {
    setLoading(true)
    try {
      const fetchedPost = await getBlogPost(slug)
      setPost(fetchedPost)
      if (fetchedPost) {
        loadRelatedPosts(fetchedPost)
      }
    } catch (error) {
      console.error("Error loading post:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedPosts = async (currentPost: BlogPost) => {
    try {
      const related = await getRelatedPosts(currentPost.id, currentPost.categories?.id)
      setRelatedPosts(related)
    } catch (error) {
      console.error("Error loading related posts:", error)
    }
  }

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || "",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-12 bg-muted rounded w-3/4"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>
    )
  }

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {publishedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{publishedDate}</span>
              </div>
            )}
            {post.reading_time > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.reading_time} min read</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>

          {post.excerpt && <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>}

          <div className="flex flex-wrap gap-2">
            {post.categories && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {post.categories.name}
              </Badge>
            )}

            {post.post_tags?.map((tagRelation) => (
              <Badge key={tagRelation.tags.id} variant="outline">
                {tagRelation.tags.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.cover_image_url && (
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src={post.cover_image_url || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }} />
      </div>

      <Separator className="my-12" />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <BlogPostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
