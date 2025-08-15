import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();

  try {
    // For the admin panel, we fetch all posts, not just 'published' ones
    const { data: posts, error } = await supabase
      .from('posts')
      .select(
        `
        id,
        title,
        slug,
        status,
        created_at,
        categories ( name ),
        tags ( name )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(posts);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching posts:', message);
    return NextResponse.json(
      { message: 'Error fetching posts', error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  try {
    const { title, content, slug, category_id, status, tag_ids } = await request.json();

    // 1. Insert the post (without category)
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({ title, content, slug, status })
      .select('id')
      .single();

    if (postError) {
      if (postError.code === '23505') {
        return NextResponse.json({ message: 'A post with this slug already exists.' }, { status: 409 });
      }
      throw postError;
    }

    // 2. Link the category in the join table
    if (category_id) {
      const { error: categoryError } = await supabase
        .from('post_categories')
        .insert({ post_id: post.id, category_id: category_id });

      if (categoryError) {
        console.error('Error linking category:', categoryError);
        // Depending on requirements, you might want to handle this error more gracefully
      }
    }

    // 3. If tags are provided, link them in the join table
    if (tag_ids && tag_ids.length > 0) {
      const tagsToInsert = tag_ids.map((tag_id: string) => ({
        post_id: post.id,
        tag_id: tag_id, // Use the string UUID directly
      }));

      const { error: tagsError } = await supabase.from('post_tags').insert(tagsToInsert);

      if (tagsError) {
        console.error('Error linking tags:', tagsError);
        // In a real app, you might want to roll back the post creation or handle this more gracefully
        return NextResponse.json(
          { message: 'Post created, but failed to link tags.', post },
          { status: 207 } // Multi-Status
        );
      }
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error creating post:', message);
    return NextResponse.json(
      { message: 'Error creating post', error: message },
      { status: 500 }
    );
  }
}

