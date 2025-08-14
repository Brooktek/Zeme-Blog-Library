import { type BlogPost, type BlogCategory, type BlogTag } from "./supabase/client";
export declare function getBlogPosts(options?: {
    category?: string;
    limit?: number;
    status?: string;
}): Promise<BlogPost[]>;
export declare function getBlogPost(slug: string): Promise<BlogPost | null>;
export declare function getBlogCategories(): Promise<BlogCategory[]>;
export declare function getBlogCategory(slug: string): Promise<BlogCategory | null>;
export declare function createBlogCategory(category: Partial<BlogCategory>): Promise<BlogCategory>;
export declare function updateBlogCategory(id: string, updates: Partial<BlogCategory>): Promise<BlogCategory>;
export declare function deleteBlogCategory(id: string): Promise<boolean>;
export declare function getBlogTags(): Promise<BlogTag[]>;
export declare function getBlogTag(id: string): Promise<BlogTag | null>;
export declare function createBlogTag(tag: Partial<BlogTag>): Promise<BlogTag>;
export declare function updateBlogTag(id: string, updates: Partial<BlogTag>): Promise<BlogTag>;
export declare function deleteBlogTag(id: string): Promise<boolean>;
export declare function getBlogPostsByCategory(category: string, options?: {
    limit?: number;
    status?: "draft" | "published" | "archived";
}): Promise<BlogPost[]>;
export declare function getBlogPostsByTag(tag: string, options?: {
    limit?: number;
    status?: "draft" | "published" | "archived";
}): Promise<BlogPost[]>;
export declare function getRelatedPosts(currentPostId: string, categoryId?: string, limit?: number): Promise<BlogPost[]>;
export type { BlogPost, BlogCategory, BlogTag } from "./supabase/client";
