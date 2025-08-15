# Setup Guide for Image Uploads

## Prerequisites

1. **Supabase Project**: You need a Supabase project with storage enabled
2. **Storage Bucket**: Create a storage bucket named `post-images` in your Supabase project

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Storage Bucket Setup

1. Go to your Supabase dashboard
2. Navigate to Storage > Buckets
3. Create a new bucket named `post-images`
4. Set the bucket to public (this allows unauthenticated uploads)
5. Configure CORS if needed

## Storage Policies

Make sure your storage bucket has the following policies for public access:

```sql
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');

-- Allow public insert access (for uploads)
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-images');
```

## Testing

After setup, you should be able to:
1. Upload images through the admin post creation form
2. See uploaded images in your Supabase storage
3. Access images via their public URLs

## Troubleshooting

If you encounter upload errors:
1. Check that environment variables are set correctly
2. Verify the storage bucket exists and is public
3. Check browser console for detailed error messages
4. Ensure your Supabase project is active and not paused 