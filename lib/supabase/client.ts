import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  status: "draft" | "published" | "archived"
  published_at: string | null
  created_at: string
  updated_at: string
  reading_time: number
  meta_title: string | null
  meta_description: string | null
  categories: {
    id: string
    name: string
    slug: string
    description: string | null
  } | null
  post_tags: Array<{
    tags: {
      id: string
      name: string
      slug: string
    }
  }>
}

export type BlogCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export type BlogTag = {
  id: string
  name: string
  slug: string
  created_at: string
}
