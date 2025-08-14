"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
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
            .eq("slug", params.slug)
            .eq("status", "published")
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
