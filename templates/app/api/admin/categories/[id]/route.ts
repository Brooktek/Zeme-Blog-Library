import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET a single category by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!data) return new NextResponse('Category not found', { status: 404 });

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error fetching category ${params.id}:`, message);
    return NextResponse.json(
      { message: 'Error fetching category', error: message },
      { status: 500 }
    );
  }
}

// UPDATE a category
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  try {
    const { name, slug, description } = await request.json();
    const { error } = await supabase
      .from('categories')
      .update({ name, slug, description })
      .eq('id', params.id);

    if (error) {
       if (error.code === '23505') { // unique_violation on slug
        return NextResponse.json({ message: 'A category with this slug already exists.' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ message: 'Category updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error updating category:', message);
    return NextResponse.json(
      { message: 'Error updating category', error: message },
      { status: 500 }
    );
  }
}

// DELETE a category
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  try {
    const { error } = await supabase.from('categories').delete().eq('id', params.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(`Error deleting category ${params.id}:`, message);
    return NextResponse.json(
      { message: 'Error deleting category', error: message },
      { status: 500 }
    );
  }
}
