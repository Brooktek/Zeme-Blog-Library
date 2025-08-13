import { type BlogPost, type BlogCategory } from "@/lib/blog-api";
interface BlogPostListProps {
    initialPosts?: BlogPost[];
    initialCategories?: BlogCategory[];
    showFilters?: boolean;
    limit?: number;
}
export declare function BlogPostList({ initialPosts, initialCategories, showFilters, limit, }: BlogPostListProps): import("react").JSX.Element;
export {};
