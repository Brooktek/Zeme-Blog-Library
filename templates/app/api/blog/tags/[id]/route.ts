// Placeholder for fetching a single tag by ID
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  return NextResponse.json({ id });
}
