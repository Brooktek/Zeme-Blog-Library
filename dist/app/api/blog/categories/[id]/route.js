"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.PUT = PUT;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const client_1 = require("@/lib/supabase/client");
async function GET(request, { params }) {
    try {
        const { data, error } = await client_1.supabase.from("blog_categories").select("*").eq("id", params.id).single();
        if (error) {
            return server_1.NextResponse.json({ error: error.message }, { status: 500 });
        }
        if (!data) {
            return server_1.NextResponse.json({ error: "Category not found" }, { status: 404 });
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
        const { name, slug, description } = body;
        const { data, error } = await client_1.supabase
            .from("blog_categories")
            .update({
            name,
            slug,
            description: description || null,
            updated_at: new Date().toISOString(),
        })
            .eq("id", params.id)
            .select()
            .single();
        if (error) {
            return server_1.NextResponse.json({ error: error.message }, { status: 500 });
        }
        return server_1.NextResponse.json({ data });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
async function DELETE(request, { params }) {
    try {
        const { error } = await client_1.supabase.from("blog_categories").delete().eq("id", params.id);
        if (error) {
            return server_1.NextResponse.json({ error: error.message }, { status: 500 });
        }
        return server_1.NextResponse.json({ message: "Category deleted successfully" });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
