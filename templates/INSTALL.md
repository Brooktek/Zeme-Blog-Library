# Installation Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. **Environment Setup**
   Create a `.env.local` file in your project root:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Supabase Setup**
   - Create a `post-images` storage bucket
   - Set it to public
   - Configure storage policies (see SETUP.md)

4. **Test Your Setup**
   ```bash
   # Test connection
   node templates/scripts/test-upload.js
   
   # Or visit in browser
   /api/test-connection
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## What's Included

- ✅ Image upload without authentication
- ✅ File validation (JPEG, PNG, GIF, WebP, max 5MB)
- ✅ Error handling and user feedback
- ✅ Test endpoints for debugging
- ✅ Comprehensive documentation

## Troubleshooting

If you get errors:
1. Check that all dependencies are installed
2. Verify your `.env.local` file exists
3. Ensure Supabase bucket is created and public
4. Use the test script to diagnose issues

## Next Steps

After successful installation:
1. Navigate to `/admin/posts/new`
2. Try uploading an image
3. Check the browser console for any errors
4. Verify images appear in your Supabase storage 