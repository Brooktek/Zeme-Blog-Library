import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import type { BlogPost } from "@/lib/supabase/client"

interface BlogPostCardProps {
  post: BlogPost
  variant?: "default" | "featured"
}

export function BlogPostCard({ post, variant = "default" }: BlogPostCardProps) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border ${
        variant === "featured" ? "md:col-span-2 lg:col-span-3" : ""
      }`}
    >
      {post.featured_image_url && (
        <div className={`overflow-hidden ${variant === "featured" ? "h-64" : "h-48"}`}>
          <img
            src={post.featured_image_url || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {publishedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{publishedDate}</span>
            </div>
          )}
          {post.reading_time > 0 && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.reading_time} min read</span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Link href={`/blog/${post.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className={`font-bold leading-tight ${variant === "featured" ? "text-2xl md:text-3xl" : "text-xl"}`}>
              {post.title}
            </h3>
          </Link>

          {post.excerpt && (
            <p className={`text-muted-foreground leading-relaxed ${variant === "featured" ? "text-lg" : "text-base"}`}>
              {post.excerpt}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {post.blog_categories && (
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {post.blog_categories.name}
            </Badge>
          )}

          {post.blog_post_tags?.slice(0, 3).map((tagRelation) => (
            <Badge key={tagRelation.blog_tags.id} variant="outline" className="text-xs">
              {tagRelation.blog_tags.name}
            </Badge>
          ))}

          {post.blog_post_tags && post.blog_post_tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{post.blog_post_tags.length - 3} more
            </Badge>
          )}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Read more →
        </Link>
      </CardContent>
    </Card>
  )
}
