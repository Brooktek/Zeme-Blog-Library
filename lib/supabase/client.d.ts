export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export type BlogPost = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image_url: string | null;
    status: "draft" | "published" | "archived";
    published_at: string | null;
    created_at: string;
    updated_at: string;
    reading_time: number;
    meta_title: string | null;
    meta_description: string | null;
    blog_categories: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
    } | null;
    blog_post_tags: Array<{
        blog_tags: {
            id: string;
            name: string;
            slug: string;
        };
    }>;
};
export type BlogCategory = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
};
export type BlogTag = {
    id: string;
    name: string;
    slug: string;
    created_at: string;
};
