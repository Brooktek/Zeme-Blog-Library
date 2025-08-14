import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const supabase = createClient();

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*, categories(name), tags(name)')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // PostgREST error for no rows found
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      throw error;
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error fetching post with slug ${slug}:`, message);
    return NextResponse.json(
      { message: 'Error fetching post', error: message },
      { status: 500 }
    );
  }
}

