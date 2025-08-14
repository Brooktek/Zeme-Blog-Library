import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET a single post by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        categories ( id, name ),
        tags ( id, name )
      `)
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!data) return new NextResponse('Post not found', { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error fetching post ${params.id}:`, message);
    return NextResponse.json(
      { message: 'Error fetching post', error: message },
      { status: 500 }
    );
  }
}

// UPDATE a post
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    const { title, content, slug, category_id, status, tag_ids } = await request.json();

    // 1. Update the post details
    const { error: postError } = await supabase
      .from('posts')
      .update({ title, content, slug, category_id, status })
      .eq('id', params.id);

    if (postError) throw postError;

    // 2. Update tags (this is a multi-step process)
    // First, remove all existing tag associations for this post
    const { error: deleteTagsError } = await supabase.from('posts_tags').delete().eq('post_id', params.id);
    if (deleteTagsError) throw deleteTagsError;

    // Second, add the new tag associations
    if (tag_ids && tag_ids.length > 0) {
      const tagsToInsert = tag_ids.map((tag_id: string) => ({ post_id: params.id, tag_id }));
      const { error: insertTagsError } = await supabase.from('posts_tags').insert(tagsToInsert);
      if (insertTagsError) throw insertTagsError;
    }

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error updating post ${params.id}:`, message);
    return NextResponse.json(
      { message: 'Error updating post', error: message },
      { status: 500 }
    );
  }
}

// DELETE a post
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    // The 'posts_tags' entries should be deleted automatically by cascade if set up in DB.
    // If not, they must be deleted manually first.
    await supabase.from('posts_tags').delete().eq('post_id', params.id);
    
    const { error } = await supabase.from('posts').delete().eq('id', params.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error deleting post ${params.id}:`, message);
    return NextResponse.json(
      { message: 'Error deleting post', error: message },
      { status: 500 }
    );
  }
}
