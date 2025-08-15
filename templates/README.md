# Zeme Blog System - Image Upload

This system allows users to upload cover images for blog posts without requiring authentication.

## Features

- **No Authentication Required**: Images can be uploaded anonymously
- **File Validation**: Supports JPEG, PNG, GIF, and WebP formats up to 5MB
- **Error Handling**: Comprehensive error messages and validation feedback
- **Public Access**: Uploaded images are publicly accessible

## Setup

1. **Environment Variables**: Create a `.env.local` file with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Storage Bucket**: Create a `post-images` bucket in your Supabase project
   - Set it to public
   - Configure appropriate storage policies

3. **Test Connection**: Visit `/api/test-connection` to verify your setup

## Usage

1. Navigate to `/admin/posts/new`
2. Fill in the post details
3. Select a cover image (JPEG, PNG, GIF, or WebP, max 5MB)
4. Submit the form

## API Endpoints

- `POST /api/admin/upload` - Upload images
- `GET /api/test-connection` - Test Supabase connection
- `POST /api/admin/posts` - Create blog posts

## File Validation

- **Types**: JPEG, JPG, PNG, GIF, WebP
- **Size**: Maximum 5MB
- **Client-side**: Immediate validation feedback
- **Server-side**: Additional validation and error handling

## Error Handling

The system provides detailed error messages for:
- Missing environment variables
- Invalid file types
- File size limits
- Upload failures
- Storage access issues

## Security

- Uses Supabase anonymous key (no user authentication required)
- File type and size validation
- Public bucket access for simplicity
- Consider implementing rate limiting for production use

## Troubleshooting

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your environment variables are set correctly
3. Ensure your Supabase project is active
4. Check that the `post-images` bucket exists and is public
5. Use the test connection endpoint to diagnose issues 