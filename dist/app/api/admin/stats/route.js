"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const client_1 = require("@/lib/supabase/client");
async function GET() {
    try {
        const [postsResult, categoriesResult, tagsResult, draftsResult] = await Promise.all([
            client_1.supabase.from("blog_posts").select("id", { count: "exact" }).eq("status", "published"),
            client_1.supabase.from("blog_categories").select("id", { count: "exact" }),
            client_1.supabase.from("blog_tags").select("id", { count: "exact" }),
            client_1.supabase.from("blog_posts").select("id", { count: "exact" }).eq("status", "draft"),
        ]);
        const stats = {
            publishedPosts: postsResult.count || 0,
            totalCategories: categoriesResult.count || 0,
            totalTags: tagsResult.count || 0,
            draftPosts: draftsResult.count || 0,
        };
        return server_1.NextResponse.json({ data: stats });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
