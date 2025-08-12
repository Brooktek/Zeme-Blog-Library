import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET() {
  try {
    const [postsResult, categoriesResult, tagsResult, draftsResult] = await Promise.all([
      supabase.from("blog_posts").select("id", { count: "exact" }).eq("status", "published"),
      supabase.from("blog_categories").select("id", { count: "exact" }),
      supabase.from("blog_tags").select("id", { count: "exact" }),
      supabase.from("blog_posts").select("id", { count: "exact" }).eq("status", "draft"),
    ])

    const stats = {
      publishedPosts: postsResult.count || 0,
      totalCategories: categoriesResult.count || 0,
      totalTags: tagsResult.count || 0,
      draftPosts: draftsResult.count || 0,
    }

    return NextResponse.json({ data: stats })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
