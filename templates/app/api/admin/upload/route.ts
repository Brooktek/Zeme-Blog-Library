import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    // Create Supabase client without authentication
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided.' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `public/${fileName}`;

    console.log('Attempting to upload file:', { fileName, filePath, fileSize: file.size });

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return NextResponse.json(
        { message: 'Failed to upload image to storage', error: uploadError.message },
        { status: 500 }
      );
    }

    console.log('File uploaded successfully, getting public URL...');

    const { data: publicUrlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      console.error('Could not get public URL for uploaded file');
      return NextResponse.json(
        { message: 'Failed to generate public URL for uploaded image' },
        { status: 500 }
      );
    }

    console.log('Upload successful:', publicUrlData.publicUrl);

    return NextResponse.json({ 
      url: publicUrlData.publicUrl,
      fileName: fileName,
      filePath: filePath
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in upload route:', error);
    return NextResponse.json(
      { message: 'Error uploading file', error: message },
      { status: 500 }
    );
  }
}
