#!/usr/bin/env node

/**
 * Test script for image upload functionality
 * Run this script to test your Supabase connection and storage setup
 */

const fs = require('fs');
const path = require('path');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('Please create a .env.local file with your Supabase credentials:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

// Check environment variables
require('dotenv').config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables!');
  console.log('Please check your .env.local file contains:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseKey.substring(0, 20) + '...');

// Test Supabase connection
async function testConnection() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('\n🔄 Testing Supabase connection...');
    
    // Test basic connection
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.log('ℹ️  Auth check (expected for anonymous access):', authError.message);
    }
    
    // Test storage access
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Failed to access storage:', bucketError.message);
      return false;
    }
    
    console.log('✅ Storage access successful');
    console.log('📦 Available buckets:', buckets.map(b => b.name));
    
    // Check for post-images bucket
    const postImagesBucket = buckets.find(bucket => bucket.name === 'post-images');
    
    if (!postImagesBucket) {
      console.error('❌ post-images bucket not found!');
      console.log('Please create a bucket named "post-images" in your Supabase storage');
      return false;
    }
    
    console.log('✅ post-images bucket found');
    console.log('🔓 Bucket public:', postImagesBucket.public);
    
    // Test bucket permissions
    const { data: testFiles, error: listError } = await supabase.storage
      .from('post-images')
      .list('public', { limit: 1 });
    
    if (listError) {
      console.error('❌ Cannot access post-images bucket:', listError.message);
      console.log('Please check bucket permissions and policies');
      return false;
    }
    
    console.log('✅ post-images bucket accessible');
    console.log('📁 Current files in bucket:', testFiles?.length || 0);
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 All tests passed! Your setup is ready for image uploads.');
    console.log('\nNext steps:');
    console.log('1. Start your Next.js development server: npm run dev');
    console.log('2. Navigate to /admin/posts/new to test image uploads');
    console.log('3. Check /api/test-connection for ongoing monitoring');
  } else {
    console.log('\n❌ Setup incomplete. Please fix the issues above and try again.');
    process.exit(1);
  }
}); 