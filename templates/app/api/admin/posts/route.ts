import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();

  try {
    // For the admin panel, we fetch all posts, not just 'published' ones
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        status,
        created_at,
        categories ( name ),
        tags ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('Error fetching posts for admin:', error);
    return NextResponse.json(
      { message: 'Error fetching posts for admin', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const { title, content, slug, category_id, status, tag_ids } = await request.json();

    // 1. Insert the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        slug,
        category_id,
        status,
      })
      .select()
      .single();

    if (postError) {
      // Handle potential duplicate slug error
      if (postError.code === '23505') { // unique_violation
        return NextResponse.json({ message: 'A post with this slug already exists.' }, { status: 409 });
      }
      throw postError;
    }

    // 2. If tags are provided, link them in the join table
    if (tag_ids && tag_ids.length > 0) {
      const tagsToInsert = tag_ids.map((tag_id: string) => ({
        post_id: post.id,
        tag_id: tag_id,
      }));

      const { error: tagsError } = await supabase.from('posts_tags').insert(tagsToInsert);

      if (tagsError) {
        // If linking tags fails, we should ideally roll back the post creation.
        // For simplicity here, we'll log the error and return a specific message.
        // In a real-world app, a transaction or RPC call would be better.
        console.error('Error linking tags:', tagsError);
        return NextResponse.json(
          { message: 'Post created, but failed to link tags.', post },
          { status: 207 } // Multi-Status
        );
      }
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { message: 'Error creating post', error: error.message },
      { status: 500 }
    );
  }
}

