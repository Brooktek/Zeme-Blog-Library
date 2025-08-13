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
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Error fetching admin stats', error: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ posts: 0, categories: 0, tags: 0 });
}
