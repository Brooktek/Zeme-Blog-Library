import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('id, name, slug') // Corrected to select only existing columns
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error fetching tags:', message);
    return NextResponse.json(
      { message: 'Error fetching tags', error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  try {
    const { name, slug } = await request.json();

    const { data, error } = await supabase
      .from('blog_tags')
      .insert({ name, slug })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // unique_violation
        return NextResponse.json({ message: 'A tag with this slug already exists.' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error creating tag:', message);
    return NextResponse.json(
      { message: 'Error creating tag', error: message },
      { status: 500 }
    );
  }
}
