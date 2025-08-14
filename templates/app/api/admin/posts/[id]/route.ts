import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET a single post by ID
export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(id, name), tags(id, name)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// UPDATE a post
export async function PUT(request: Request, { params: { id } }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  try {
    const { title, content, published, category_id, tag_ids } = await request.json();

    // Update the post details
    const { error: postUpdateError } = await supabase
      .from('posts')
      .update({ title, content, published })
      .eq('id', id);

    if (postUpdateError) throw postUpdateError;

    // Handle category relationship
    const { error: deleteCategoryError } = await supabase
      .from('post_categories')
      .delete()
      .eq('post_id', id);

    if (deleteCategoryError) throw deleteCategoryError;

    if (category_id) {
      const { error: insertCategoryError } = await supabase
        .from('post_categories')
        .insert({ post_id: parseInt(id), category_id: category_id });
      if (insertCategoryError) throw insertCategoryError;
    }

    // Handle tags relationship
    const { error: deleteTagsError } = await supabase.from('posts_tags').delete().eq('post_id', id);
    if (deleteTagsError) throw deleteTagsError;

    if (tag_ids && tag_ids.length > 0) {
      const tagsToInsert = tag_ids.map((tag_id: string) => ({ post_id: id, tag_id }));
      const { error: insertTagsError } = await supabase.from('posts_tags').insert(tagsToInsert);
      if (insertTagsError) throw insertTagsError;
    }

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE a post
export async function DELETE(request: Request, { params: { id } }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  try {
    // First, delete related entries in junction tables
    await supabase.from('post_categories').delete().eq('post_id', id);
    await supabase.from('posts_tags').delete().eq('post_id', id);

    // Then, delete the post itself
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
