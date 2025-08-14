"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const client_1 = require("@/lib/supabase/client");
async function GET() {
    try {
        const { data, error } = await client_1.supabase.from("blog_tags").select("*").order("name");
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
        const { name, slug } = body;
        if (!name || !slug) {
            return server_1.NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
        }
        const { data, error } = await client_1.supabase
            .from("blog_tags")
            .insert({
            name,
            slug,
        })
            .select()
            .single();
        if (error) {
            return server_1.NextResponse.json({ error: error.message }, { status: 500 });
        }
        return server_1.NextResponse.json({ data }, { status: 201 });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
