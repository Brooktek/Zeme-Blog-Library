import type React from "react";
import { type BlogPost } from "@/lib/blog-api";
interface PostFormProps {
    post?: BlogPost;
    onSubmit: (data: PostFormData) => Promise<void>;
    isLoading?: boolean;
}
export interface PostFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image_url: string;
    category_id: string;
    status: "draft" | "published" | "archived";
    meta_title: string;
    meta_description: string;
    tag_ids: string[];
}
export declare function PostForm({ post, onSubmit, isLoading }: PostFormProps): React.JSX.Element;
export {};
