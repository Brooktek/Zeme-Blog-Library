import { type NextRequest, NextResponse } from "next/server";
export declare function GET(request: NextRequest, { params }: {
    params: {
        slug: string;
    };
}): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    data: any;
}>>;
