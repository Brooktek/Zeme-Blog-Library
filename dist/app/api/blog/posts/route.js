"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const client_1 = require("@/lib/supabase/client");
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get("limit");
        const category = searchParams.get("category");
        const tag = searchParams.get("tag");
        const status = searchParams.get("status") || "published";
        let query = client_1.supabase
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
            .eq("status", status)
            .order("published_at", { ascending: false });
        if (category) {
            query = query.eq("blog_categories.slug", category);
        }
        if (limit) {
            query = query.limit(Number.parseInt(limit));
        }
        const { data, error } = await query;
        if (error) {
            return server_1.NextResponse.json({ error: error.message }, { status: 500 });
        }
        return server_1.NextResponse.json({ data });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { title, slug, excerpt, content, featured_image_url, category_id, status, meta_title, meta_description, tag_ids, } = body;
        // Validate required fields
        if (!title || !slug || !content) {
            return server_1.NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
        }
        // Calculate reading time
        const wordCount = content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);
        // Insert post
        const { data: post, error: postError } = await client_1.supabase
            .from("blog_posts")
            .insert({
            title,
            slug,
            excerpt: excerpt || null,
            content,
            featured_image_url: featured_image_url || null,
            category_id: category_id || null,
            status: status || "draft",
            published_at: status === "published" ? new Date().toISOString() : null,
            meta_title: meta_title || null,
            meta_description: meta_description || null,
            reading_time: readingTime,
        })
            .select()
            .single();
        if (postError) {
            return server_1.NextResponse.json({ error: postError.message }, { status: 500 });
        }
        // Add tags if provided
        if (tag_ids && tag_ids.length > 0) {
            const tagRelations = tag_ids.map((tagId) => ({
                post_id: post.id,
                tag_id: tagId,
            }));
            const { error: tagError } = await client_1.supabase.from("blog_post_tags").insert(tagRelations);
            if (tagError) {
                console.error("Error adding tags:", tagError);
            }
        }
        return server_1.NextResponse.json({ data: post }, { status: 201 });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
