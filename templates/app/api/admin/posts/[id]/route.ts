import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET a single post by ID
export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, category:blog_categories(id, name), tags:blog_tags(id, name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Remap to match client-side expectations if needed, or adjust client-side
    const post = {
      ...data,
      category: data.category,
      tags: data.tags,
    };

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// UPDATE a post
export async function PUT(request: Request, { params: { id } }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  try {
    const { title, content, slug, status, category_id, tag_ids } = await request.json();

    // 1. Update the post details, including the direct category_id link
    const { error: postUpdateError } = await supabase
      .from('blog_posts')
      .update({ 
        title, 
        content, 
        slug,
        status,
        category_id: category_id || null 
      })
      .eq('id', id);

    if (postUpdateError) throw postUpdateError;

    // 2. Clear existing tag relationships for this post
    const { error: deleteTagsError } = await supabase.from('blog_post_tags').delete().eq('post_id', id);
    if (deleteTagsError) throw deleteTagsError;

    // 3. Insert new tag relationships if any are provided
    if (tag_ids && tag_ids.length > 0) {
      const tagsToInsert = tag_ids.map((tag_id: string) => ({ post_id: id, tag_id }));
      const { error: insertTagsError } = await supabase.from('blog_post_tags').insert(tagsToInsert);
      if (insertTagsError) throw insertTagsError;
    }

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error updating post:', message);
    return NextResponse.json({ error: 'Failed to update post', details: message }, { status: 500 });
  }
}

// DELETE a post
export async function DELETE(request: Request, { params: { id } }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  try {
    // The ON DELETE CASCADE constraint on blog_post_tags will handle tag relations.
    // The category_id is ON DELETE SET NULL.
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return new NextResponse(null, { status: 204 }); // Standard for successful delete
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error deleting post:', message);
    return NextResponse.json({ error: 'Failed to delete post', details: message }, { status: 500 });
  }
}
