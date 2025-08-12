import { supabase, type BlogPost, type BlogCategory, type BlogTag } from "./supabase/client"

export async function getBlogPosts(options?: {
  limit?: number
  category?: string
  tag?: string
  status?: "draft" | "published" | "archived"
}) {
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories (
        id,
        name,
        slug,
        description
      ),
      blog_post_tags (
        blog_tags (
          id,
          name,
          slug
        )
      )
    `)
    .order("published_at", { ascending: false })

  if (options?.status) {
    query = query.eq("status", options.status)
  } else {
    query = query.eq("status", "published")
  }

  if (options?.category) {
    query = query.eq("blog_categories.slug", options.category)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data as BlogPost[]
}

export async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories (
        id,
        name,
        slug,
        description
      ),
      blog_post_tags (
        blog_tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error) {
    console.error("Error fetching blog post:", error)
    return null
  }

  return data as BlogPost
}

export async function getBlogCategories() {
  const { data, error } = await supabase.from("blog_categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data as BlogCategory[]
}

export async function getBlogTags() {
  const { data, error } = await supabase.from("blog_tags").select("*").order("name")

  if (error) {
    console.error("Error fetching tags:", error)
    return []
  }

  return data as BlogTag[]
}

export async function getRelatedPosts(currentPostId: string, categoryId?: string, limit = 3) {
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories (
        id,
        name,
        slug,
        description
      ),
      blog_post_tags (
        blog_tags (
          id,
          name,
          slug
        )
      )
    `)
    .eq("status", "published")
    .neq("id", currentPostId)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching related posts:", error)
    return []
  }

  return data as BlogPost[]
}

// Re-export types for convenience
export type { BlogPost, BlogCategory, BlogTag } from "./supabase/client"
