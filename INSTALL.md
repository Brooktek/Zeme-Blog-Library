# Installation Guide

## Quick Start

Install the Zeme Blog System in your Next.js project:

```bash
npm install zeme-blog-system @supabase/supabase-js
```

## Manual Installation

### 1. Install Dependencies

```bash
npm install zeme-blog-system @supabase/supabase-js lucide-react
```

### 2. Set Up Environment Variables

Create a `.env.local` file in your Next.js project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Import and Use Components

Import components directly in your Next.js pages:

```tsx
import { BlogList, BlogPost, AdminDashboard } from 'zeme-blog-system';
```

### 3. Set Up Environment Variables

Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### 4. Initialize Configuration

\`\`\`bash
npx @zemenay/modular-blog init
\`\`\`

### 5. Set Up Database

Run the SQL scripts in your Supabase dashboard:

1. Copy the contents of `scripts/01-create-blog-tables.sql`
2. Run it in your Supabase SQL editor
3. Copy and run `scripts/02-seed-blog-data.sql`

### 6. Add Blog Routes

Create your blog pages:

\`\`\`tsx
// app/blog/page.tsx
import { BlogPostList } from '@/components/blog/blog-post-list'
import { getBlogPosts, getBlogCategories } from '@/lib/blog-api'

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories()
  ])

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogPostList 
        initialPosts={posts}
        initialCategories={categories}
      />
    </div>
  )
}
\`\`\`

\`\`\`tsx
// app/blog/[slug]/page.tsx
import { BlogPostDetail } from '@/components/blog/blog-post-detail'
import { getBlogPost } from '@/lib/blog-api'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  return <BlogPostDetail slug={params.slug} initialPost={post} />
}
\`\`\`

## Configuration

Customize your blog by editing `blog.config.js`:

\`\`\`js
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
\`\`\`

## Admin Dashboard

Access the admin dashboard at `/admin` to manage your blog posts, categories, and tags.

## API Endpoints

The system provides REST API endpoints:

- `GET /api/blog/posts` - Get all posts
- `GET /api/blog/posts/[id]` - Get post by ID
- `GET /api/blog/posts/slug/[slug]` - Get post by slug
- `POST /api/blog/posts` - Create new post
- `PUT /api/blog/posts/[id]` - Update post
- `DELETE /api/blog/posts/[id]` - Delete post

Similar endpoints exist for categories and tags.

## Customization

### Styling

The components use Tailwind CSS with a dark theme. Customize the colors in your `tailwind.config.js`:

\`\`\`js
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
\`\`\`

### Components

All components are fully customizable. Copy them to your project and modify as needed.

## Deployment

The blog system works with any Next.js deployment platform:

1. **Vercel**: Deploy directly with automatic Supabase integration
2. **Netlify**: Use environment variables for Supabase configuration
3. **Self-hosted**: Ensure environment variables are properly set

## Support

For issues and questions:

- GitHub Issues: [github.com/zemenay/modular-blog/issues](https://github.com/zemenay/modular-blog/issues)
- Documentation: [docs.zemenay.com/modular-blog](https://docs.zemenay.com/modular-blog)
