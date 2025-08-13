import type { BlogPost } from "@/lib/supabase/client";
interface BlogPostCardProps {
    post: BlogPost;
    variant?: "default" | "featured";
}
export declare function BlogPostCard({ post, variant }: BlogPostCardProps): import("react").JSX.Element;
export {};
