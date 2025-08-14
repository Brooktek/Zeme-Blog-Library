import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  try {
    const { count: postsCount, error: postsError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (postsError) throw postsError;

    const { count: categoriesCount, error: categoriesError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    if (categoriesError) throw categoriesError;

    const { count: tagsCount, error: tagsError } = await supabase
      .from('tags')
      .select('*', { count: 'exact', head: true });

    if (tagsError) throw tagsError;

    return NextResponse.json({
      posts: postsCount ?? 0,
      categories: categoriesCount ?? 0,
      tags: tagsCount ?? 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching admin stats:', message);
    return NextResponse.json(
      { message: 'Error fetching admin stats', error: message },
      { status: 500 }
    );
  }
}
