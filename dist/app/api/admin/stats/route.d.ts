import { NextResponse } from "next/server";
export declare function GET(): Promise<NextResponse<{
    data: {
        publishedPosts: number;
        totalCategories: number;
        totalTags: number;
        draftPosts: number;
    };
}> | NextResponse<{
    error: string;
}>>;
