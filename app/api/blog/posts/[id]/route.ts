import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image_url,
      category_id,
      status,
      meta_title,
      meta_description,
      tag_ids,
    } = body

    // Calculate reading time
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Update post
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .update({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featured_image_url: featured_image_url || null,
        category_id: category_id || null,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        reading_time: readingTime,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 500 })
    }

    // Update tags
    if (tag_ids !== undefined) {
      // Remove existing tags
      await supabase.from("blog_post_tags").delete().eq("post_id", params.id)

      // Add new tags
      if (tag_ids.length > 0) {
        const tagRelations = tag_ids.map((tagId: string) => ({
          post_id: params.id,
          tag_id: tagId,
        }))

        await supabase.from("blog_post_tags").insert(tagRelations)
      }
    }

    return NextResponse.json({ data: post })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("blog_posts").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
