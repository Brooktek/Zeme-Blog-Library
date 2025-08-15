import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('id, name, slug, description') // Expanded to get more data for the list view
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching categories:', message);
    return NextResponse.json(
      { message: 'Error fetching categories', error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  try {
    const { name, slug, description } = await request.json();

    const { data, error } = await supabase
      .from('blog_categories')
      .insert({ name, slug, description })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // unique_violation
        return NextResponse.json({ message: 'A category with this slug already exists.' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error creating category:', message);
    return NextResponse.json(
      { message: 'Error creating category', error: message },
      { status: 500 }
    );
  }
}
