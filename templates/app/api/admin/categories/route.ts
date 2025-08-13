import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description') // Expanded to get more data for the list view
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching categories', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const { name, slug, description } = await request.json();

    const { data, error } = await supabase
      .from('categories')
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
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error creating category', error: error.message },
      { status: 500 }
    );
  }
}
