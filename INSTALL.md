# Installation Guide

This guide provides a complete walkthrough for integrating the Zeme Blog System into your Next.js project.

## Prerequisites

Before you begin, ensure you have a Next.js project with **TypeScript** and **Tailwind CSS** enabled.

## Step 1: Create a Supabase Project

The blog system uses Supabase for its backend. If you don't have one, create a new project:

1.  Go to [supabase.com](https://supabase.com/) and sign in.
2.  Click **New project** and give it a name.
3.  Navigate to **Project Settings** > **API**.
4.  You will need the following information for the next step:
    *   **Project URL**
    *   **Project API keys** (`anon` key is sufficient for image uploads)

## Step 2: Set Up Environment Variables

Create a new file named `.env.local` in the root of your Next.js project and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

**Note**: Only the `anon` key is required. The system is designed to work without authentication for image uploads.

## Step 3: Install and Run the CLI

Now, install the package and run the interactive installer:

```bash
# 1. Install the package from npm
npm install zeme-blog-system

# 2. Run the installer
npx zeme-blog-system install
```

The `install` command will automatically copy all the required files—including API routes, admin pages, and public components—into your project.

## Step 4: Set Up the Database Schema

The installer adds the complete database schema to `templates/scripts/schema.sql`.

1.  In your Supabase dashboard, go to the **SQL Editor**.
2.  Click **New query**.
3.  Copy the entire content of the `schema.sql` file and paste it into the editor.
4.  Click **Run** to create the `posts`, `categories`, `tags`, and `posts_tags` tables.

## Step 5: Configure Storage for Image Uploads

The blog system includes image upload functionality that works without authentication:

1.  In your Supabase dashboard, go to **Storage**.
2.  Create a new bucket named `post-images`.
3.  Set the bucket to **public** (this allows unauthenticated uploads).
4.  Configure the following storage policies:

    **For public read access:**
    ```sql
    CREATE POLICY "Allow public read access" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'post-images');
    ```

    **For anonymous uploads:**
    ```sql
    CREATE POLICY "Allow anonymous uploads" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'post-images');
    ```

## Step 6: Test Your Setup

Before starting your development server, test your configuration:

1. **Test Connection**: Visit `/api/test-connection` in your browser
2. **Check Environment**: Ensure your `.env.local` file is properly configured
3. **Verify Storage**: Confirm the `post-images` bucket exists and is public

## Step 7: Start the Development Server

That's it! Start your development server to see the blog in action:

```bash
npm run dev
```

- Your public-facing blog will be available at `/blog`.
- Your admin dashboard will be at `/admin`.
- Test image uploads at `/admin/posts/new`.

## Image Upload Features

The system includes comprehensive image upload functionality:

- **No Authentication Required**: Images can be uploaded anonymously
- **File Validation**: Supports JPEG, PNG, GIF, and WebP formats up to 5MB
- **Error Handling**: Comprehensive error messages and validation feedback
- **Public Access**: Uploaded images are publicly accessible
- **Client & Server Validation**: Both client-side and server-side file validation

## Next Steps

- **Customize Components**: All components are now in your project's `/components/blog` directory. Feel free to modify them to match your brand.
- **Deploy**: Deploy your application to any Next.js hosting provider like Vercel or Netlify, ensuring your environment variables are set.

## Configuration

Customize your blog by editing `blog.config.js`:

```js
const blogConfig = {
  title: "My Blog",
  description: "A modern blog built with Next.js",
  postsPerPage: 10,
  enableComments: false,
  enableSearch: true,
  theme: {
    primaryColor: "#4318D1",
    darkMode: true
  }
}
```

## Admin Dashboard

Access the admin dashboard at `/admin` to manage your blog posts, categories, and tags. The image upload functionality is fully integrated into the post creation and editing forms.

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

## Customization

### Styling

The components use Tailwind CSS with a dark theme. Customize the colors in your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4318D1',
          foreground: '#FFFFFF',
        }
      }
    }
  }
}
```

### Components

All components are fully customizable. Copy them to your project and modify as needed.

## Troubleshooting

If you encounter issues:

1. **Check Environment Variables**: Ensure `.env.local` contains your Supabase credentials
2. **Verify Storage Bucket**: Confirm `post-images` bucket exists and is public
3. **Test Connection**: Use `/api/test-connection` to diagnose issues
4. **Check Console**: Monitor browser console for detailed error messages
5. **Storage Policies**: Verify storage policies allow public read and anonymous insert

## Deployment

The blog system works with any Next.js deployment platform:

1. **Vercel**: Deploy directly with automatic Supabase integration
2. **Netlify**: Use environment variables for Supabase configuration
3. **Self-hosted**: Ensure environment variables are properly set

## Support

For issues and questions:

- GitHub Issues: [github.com/zemenay/modular-blog/issues](https://github.com/zemenay/modular-blog/issues)
- Documentation: [docs.zemenay.com/modular-blog](https://docs.zemenay.com/modular-blog)
