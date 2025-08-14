import { type NextRequest, NextResponse } from "next/server";
export declare function GET(request: NextRequest, { params }: {
    params: {
        id: string;
    };
}): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    data: any;
}>>;
export declare function PUT(request: NextRequest, { params }: {
    params: {
        id: string;
    };
}): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    data: any;
}>>;
export declare function DELETE(request: NextRequest, { params }: {
    params: {
        id: string;
    };
}): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    message: string;
}>>;
