import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET a single tag by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!data) return new NextResponse('Tag not found', { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error fetching tag ${params.id}:`, message);
    return NextResponse.json(
      { message: 'Error fetching tag', error: message },
      { status: 500 }
    );
  }
}

// UPDATE a tag
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    const { name, slug, description } = await request.json();
    const { error } = await supabase
      .from('tags')
      .update({ name, slug, description })
      .eq('id', params.id);

    if (error) {
       if (error.code === '23505') { // unique_violation on slug
        return NextResponse.json({ message: 'A tag with this slug already exists.' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ message: 'Tag updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error updating tag:', message);
    return NextResponse.json(
      { message: 'Error updating tag', error: message },
      { status: 500 }
    );
  }
}

// DELETE a tag
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  try {
    // Manually delete associations in posts_tags first
    await supabase.from('posts_tags').delete().eq('tag_id', params.id);

    const { error } = await supabase.from('tags').delete().eq('id', params.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error deleting tag ${params.id}:`, message);
    return NextResponse.json(
      { message: 'Error deleting tag', error: message },
      { status: 500 }
    );
  }
}
