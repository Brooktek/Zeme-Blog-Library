"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.PUT = PUT;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const client_1 = require("@/lib/supabase/client");
async function GET(request, { params }) {
    try {
        const { data, error } = await client_1.supabase
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
            .single();
        if (error) {
            return server_1.NextResponse.json({ error: error.message }, { status: 500 });
        }
        if (!data) {
            return server_1.NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        return server_1.NextResponse.json({ data });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
async function PUT(request, { params }) {
    try {
        const body = await request.json();
        const { title, slug, excerpt, content, featured_image_url, category_id, status, meta_title, meta_description, tag_ids, } = body;
        // Calculate reading time
        const wordCount = content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);
        // Update post
        const { data: post, error: postError } = await client_1.supabase
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
            .single();
        if (postError) {
            return server_1.NextResponse.json({ error: postError.message }, { status: 500 });
        }
        // Update tags
        if (tag_ids !== undefined) {
            // Remove existing tags
            await client_1.supabase.from("blog_post_tags").delete().eq("post_id", params.id);
            // Add new tags
            if (tag_ids.length > 0) {
                const tagRelations = tag_ids.map((tagId) => ({
                    post_id: params.id,
                    tag_id: tagId,
                }));
                await client_1.supabase.from("blog_post_tags").insert(tagRelations);
            }
        }
        return server_1.NextResponse.json({ data: post });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
async function DELETE(request, { params }) {
    try {
        const { error } = await client_1.supabase.from("blog_posts").delete().eq("id", params.id);
        if (error) {
            return server_1.NextResponse.json({ error: error.message }, { status: 500 });
        }
        return server_1.NextResponse.json({ message: "Post deleted successfully" });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
