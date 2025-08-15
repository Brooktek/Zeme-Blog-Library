import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey
        }
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test basic connection
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('Auth check (expected for anonymous access):', authError.message);
    }

    // Test storage bucket access
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to access storage',
        error: bucketError.message
      }, { status: 500 });
    }

    const postImagesBucket = buckets.find(bucket => bucket.name === 'post-images');
    
    if (!postImagesBucket) {
      return NextResponse.json({
        status: 'warning',
        message: 'post-images bucket not found',
        availableBuckets: buckets.map(b => b.name),
        instructions: 'Create a bucket named "post-images" in your Supabase storage'
      });
    }

    // Test bucket permissions
    const { data: testFiles, error: listError } = await supabase.storage
      .from('post-images')
      .list('public', { limit: 1 });

    if (listError) {
      return NextResponse.json({
        status: 'error',
        message: 'Cannot access post-images bucket',
        error: listError.message,
        instructions: 'Check bucket permissions and policies'
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection and storage are working correctly',
      details: {
        url: supabaseUrl,
        bucketExists: true,
        bucketName: postImagesBucket.name,
        bucketPublic: postImagesBucket.public,
        canListFiles: true,
        fileCount: testFiles?.length || 0
      }
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Connection test error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Connection test failed',
      error: message
    }, { status: 500 });
  }
} 