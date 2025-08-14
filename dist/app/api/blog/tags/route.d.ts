import { type NextRequest, NextResponse } from "next/server";
export declare function GET(): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    data: any[];
}>>;
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    data: any;
}>>;
