import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  // Params for filtering and pagination
  const categorySlug = searchParams.get('category');
  const tagSlug = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  try {
    // Base query
    let query = supabase
      .from('posts')
      .select(`
        *,
        categories ( id, name, slug ),
        tags ( id, name, slug )
      `)
      .eq('status', 'published');

    // Apply filters
    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug);
    } else if (tagSlug) {
      // For many-to-many, we need to filter based on the join table
      // This requires a view or a function, but a simple text search on tags can work as a proxy
      // A more robust solution would use an RPC call.
      // For now, we'll filter on the related table.
      query = query.select('*, categories(*), tags!inner(slug)').eq('tags.slug', tagSlug);
    }

    // Apply ordering and pagination
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: posts, error } = await query;

    if (error) throw error;

    // We also need the total count for the filtered query
    let countQuery = supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published');
    if (categorySlug) {
      countQuery = countQuery.eq('categories.slug', categorySlug);
    } else if (tagSlug) {
      countQuery = countQuery.select('*, tags!inner(slug)').eq('tags.slug', tagSlug);
    }

    const { count, error: countError } = await countQuery;

    if (countError) throw countError;

    return NextResponse.json({
      posts,
      total: count,
      page,
      limit,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching posts:', message);
    return NextResponse.json(
      { message: 'Error fetching posts', error: message },
      { status: 500 }
    );
  }
}


