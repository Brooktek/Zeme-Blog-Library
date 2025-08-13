// Placeholder for fetching admin stats
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ posts: 0, categories: 0, tags: 0 });
}
