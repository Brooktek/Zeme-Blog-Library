import { supabase, type BlogPost, type BlogCategory, type BlogTag } from "./supabase/client"

export async function getBlogPosts(options: { category?: string; limit?: number } = {}) {
  let query = supabase.from("blog_posts").select(`
    *,
    blog_categories (*),
    blog_tags (*)
  `)

  if (options.category) {
    const { data: category, error: categoryError } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("slug", options.category)
      .single()

    if (categoryError) {
      console.error("Error fetching category for filtering:", categoryError.message)
      return []
    }

    if (category) {
      query = query.eq("category_id", category.id)
    } else {
      return []
    }
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data: posts, error } = await query

  if (error) {
    console.error("Error fetching blog posts:", error.message)
    throw new Error(error.message)
  }

  return (posts as BlogPost[]) || []
}

export async function getBlogPost(slug: string) {
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories (*),
      blog_tags (*)
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error.message)
    return null
  }

  return post as BlogPost
}

export async function getBlogCategories() {
  const { data: categories, error } = await supabase.from("blog_categories").select("*")

  if (error) {
    console.error("Error fetching blog categories:", error.message)
    throw new Error(error.message)
  }

  return (categories as BlogCategory[]) || []
}

export async function getBlogCategory(slug: string) {
  const { data: category, error } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) {
    console.error(`Error fetching blog category with slug ${slug}:`, error.message)
    return null
  }

  return category as BlogCategory
}

export async function createBlogCategory(category: Partial<BlogCategory>) {
  const { data, error } = await supabase.from("blog_categories").insert([category]).select().single()

  if (error) {
    console.error("Error creating blog category:", error.message)
    throw new Error(error.message)
  }

  return data as BlogCategory
}

export async function updateBlogCategory(id: string, updates: Partial<BlogCategory>) {
  const { data, error } = await supabase.from("blog_categories").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating blog category with id ${id}:`, error.message)
    throw new Error(error.message)
  }

  return data as BlogCategory
}

export async function deleteBlogCategory(id: string) {
  const { error } = await supabase.from("blog_categories").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting blog category with id ${id}:`, error.message)
    throw new Error(error.message)
  }

  return true
}

export async function getBlogTags() {
  const { data: tags, error } = await supabase.from("blog_tags").select("*")

  if (error) {
    console.error("Error fetching blog tags:", error.message)
    throw new Error(error.message)
  }

  return (tags as BlogTag[]) || []
}

export async function getBlogTag(id: string) {
  const { data: tag, error } = await supabase
    .from("blog_tags")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching blog tag with id ${id}:`, error.message)
    return null
  }

  return tag as BlogTag
}

export async function createBlogTag(tag: Partial<BlogTag>) {
  const { data, error } = await supabase.from("blog_tags").insert([tag]).select().single()

  if (error) {
    console.error("Error creating blog tag:", error.message)
    throw new Error(error.message)
  }

  return data as BlogTag
}

export async function updateBlogTag(id: string, updates: Partial<BlogTag>) {
  const { data, error } = await supabase.from("blog_tags").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating blog tag with id ${id}:`, error.message)
    throw new Error(error.message)
  }

  return data as BlogTag
}

export async function deleteBlogTag(id: string) {
  const { error } = await supabase.from("blog_tags").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting blog tag with id ${id}:`, error.message)
    throw new Error(error.message)
  }

  return true
}

export async function getBlogPostsByCategory(category: string, options?: {
  limit?: number
  status?: "draft" | "published" | "archived"
}) {
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories (id, name, slug, description),
      blog_post_tags (blog_tags (id, name, slug))
    `)
    .eq("blog_categories.slug", category)
    .order("published_at", { ascending: false })

  if (options?.status) {
    query = query.eq("status", options.status)
  } else {
    query = query.eq("status", "published")
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching blog posts by category:", error)
    return []
  }

  return data as BlogPost[]
}

export async function getBlogPostsByTag(tag: string, options?: {
  limit?: number
  status?: "draft" | "published" | "archived"
}) {
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories (id, name, slug, description),
      blog_post_tags (blog_tags (id, name, slug))
    `)
    .eq("blog_post_tags.blog_tags.slug", tag)
    .order("published_at", { ascending: false })

  if (options?.status) {
    query = query.eq("status", options.status)
  } else {
    query = query.eq("status", "published")
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching blog posts by tag:", error)
    return []
  }

  return data as BlogPost[]
}

export async function getRelatedPosts(currentPostId: string, categoryId?: string, limit = 3) {
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories (id, name, slug, description),
      blog_post_tags (blog_tags (id, name, slug))
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
