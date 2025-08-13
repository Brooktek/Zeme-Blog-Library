import { supabase } from '../../../../lib/supabase/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');
  const tagSlug = searchParams.get('tag');

  let query = supabase.from('posts').select('*');

  if (categorySlug) {
    const { data: category } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
    if (category) {
      query = query.eq('category_id', category.id);
    }
  } else if (tagSlug) {
    const { data: tag } = await supabase.from('tags').select('id').eq('slug', tagSlug).single();
    if (tag) {
      const { data: postIds } = await supabase.from('posts_tags').select('post_id').eq('tag_id', tag.id);
      if (postIds) {
        const ids = postIds.map(pt => pt.post_id);
        query = query.in('id', ids);
      }
    }
  }

  const { data: posts, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(posts);
}
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([]);
}
