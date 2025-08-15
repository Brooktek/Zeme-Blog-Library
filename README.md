# Zeme Blog System

A production-ready, modular blog system for Next.js applications with a Supabase backend. Available as `zeme-blog-system` on npm.

## Features

- **Plug-and-Play**: Install via npm and integrate in minutes with a single CLI command.
- **Modern Stack**: Built with Next.js (App Router), TypeScript, and Tailwind CSS.
- **Supabase Backend**: Uses Supabase for database and storage.
- **Full-Featured Admin**: A complete admin dashboard to manage posts, categories, and tags.
- **Component-Based**: Includes a set of clean, reusable components for your public-facing blog.
- **Responsive Design**: Mobile-first design with dark theme support.
- **Type Safe**: Full TypeScript support for all components and APIs.
- **Image Uploads**: Built-in support for uploading cover images without authentication.
- **Error Handling**: Comprehensive error messages and validation feedback.

## Quick Start

Get up and running with the Zeme Blog System in just two steps.

### 1. Install the Package

In your Next.js project directory, install the package from npm:

```bash
npm install zeme-blog-system
```

### 2. Run the Installer

Run the `install` command to automatically copy all the necessary routes, components, and libraries into your project:

```bash
npx zeme-blog-system install
``` 
Then install
```bash
npx shadcn@latest add button
npx shadcn@latest add sheet
```

The installer will guide you through the required setup steps.

For a complete walkthrough, see the [**Installation Guide**](./INSTALL.md).

## Configuration

To connect the blog system to your Supabase project, you'll need to set up a few environment variables and create a storage bucket for images.

### 1. Environment Variables

Create a `.env.local` file in the root of your project and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these keys in your Supabase project's **Settings > API** page.

### 2. Supabase Storage Bucket

The blog system uses Supabase Storage to handle image uploads for post cover images. **No authentication is required** - images can be uploaded anonymously.

1.  Go to the **Storage** section in your Supabase dashboard.
2.  Create a new public bucket named `post-images`.
3.  Set up the following access policies for the `post-images` bucket to allow public reads and anonymous uploads:

    **For public read access (select/get):**
    ```sql
    -- Policy: Allow public read access to files in post-images
    CREATE POLICY "Allow public read access" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'post-images');
    ```

    **For anonymous uploads (insert):**
    ```sql
    -- Policy: Allow anonymous uploads to post-images
    CREATE POLICY "Allow anonymous uploads" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'post-images');
    ```

## What's Included?

The CLI installer adds the following to your project:

- **`/app/admin/**`**: The complete admin dashboard for managing content.
- **`/app/api/admin/**`**: All backend API routes for CRUD operations and image uploads.
- **`/app/blog/**`**: Basic public-facing pages to display posts.
- **`/components/blog/**`**: Reusable components like `BlogPostCard` and `BlogPostDetail`.
- **`/lib/**`**: Supabase client setup and helper functions.
- **`/templates/scripts/schema.sql`**: The complete database schema to run in your Supabase project.

## Image Upload Features

- **No Authentication Required**: Images can be uploaded anonymously
- **File Validation**: Supports JPEG, PNG, GIF, and WebP formats up to 5MB
- **Error Handling**: Comprehensive error messages and validation feedback
- **Public Access**: Uploaded images are publicly accessible
- **Client & Server Validation**: Both client-side and server-side file validation

## API Endpoints

The system provides REST API endpoints:

- `GET /api/blog/posts` - Get all posts
- `GET /api/blog/posts/[id]` - Get post by ID
- `GET /api/blog/posts/slug/[slug]` - Get post by slug
- `POST /api/blog/posts` - Create new post
- `PUT /api/blog/posts/[id]` - Update post
- `DELETE /api/blog/posts/[id]` - Delete post
- `POST /api/admin/upload` - Upload images (no auth required)
- `GET /api/test-connection` - Test Supabase connection

Similar endpoints exist for categories and tags.

## Testing Your Setup

After installation, test your setup:

1. **Test Connection**: Visit `/api/test-connection` in your browser
2. **Test Upload**: Navigate to `/admin/posts/new` and try uploading an image
3. **Check Console**: Monitor browser console for any error messages

## Acknowledgments

- Built for the Zemenay Tech Solutions hackathon.
- Inspired by modern headless CMS solutions.

---

Made by SlowMoon for [Zemenay Tech Solutions](https://www.zemenaytech.com/)
