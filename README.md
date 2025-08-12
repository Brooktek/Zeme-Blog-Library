# Zeme Blog System

A production-ready, modular blog system for Next.js applications with Supabase backend. Available as `zeme-blog-system` on npm.

## 🚀 Features

- **Plug-and-Play**: Install via npm and integrate in minutes
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS, Supabase
- **Admin Dashboard**: Full-featured admin interface for content management
- **SEO Optimized**: Built-in meta tags, structured data, and performance optimization
- **Responsive Design**: Mobile-first design with dark theme support
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Modular Architecture**: Use only the components you need
- **REST API**: Complete API for headless usage

```bash
npx create-next-app@latest my-blog --typescript --tailwind --eslint
cd my-blog
```

### 2. Install the package

```bash
npm install zeme-blog-system
```

### 3. Set up environment variables

Create a `.env.local` file in your Next.js project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Create a Supabase project

1. Go to [Supabase](https://supabase.com) and create a new project
2. In the SQL Editor, run the following SQL script to set up the database schema:

```sql
-- Create tables and relationships
-- (Include your database schema here)
```

### 5. Create a blog page

Create a new file at `app/blog/page.tsx`:

```tsx
import { BlogList } from 'zeme-blog-system';

export default function BlogPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogList />
    </main>
  );
}
```

### 6. Start the development server

```bash
npm run dev
```

Visit `http://localhost:3000/blog` to see your blog in action!

## Admin Dashboard

To access the admin dashboard, create a page at `app/admin/page.tsx`:

```tsx
import { AdminDashboard } from 'zeme-blog-system';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboard />
    </div>
  );
}
```

Visit `http://localhost:3000/admin` to access the admin dashboard.

## 🏗️ Architecture

### Components

- **BlogPostList**: Displays paginated list of blog posts with filtering
- **BlogPostCard**: Individual post preview with metadata
- **BlogPostDetail**: Full post view with related posts
- **AdminLayout**: Admin dashboard layout with navigation
- **PostForm**: Create/edit post form with rich features

### API Routes

- `GET /api/blog/posts` - List posts with filtering
- `GET /api/blog/posts/[id]` - Get post by ID
- `GET /api/blog/posts/slug/[slug]` - Get post by slug
- `POST /api/blog/posts` - Create new post
- `PUT /api/blog/posts/[id]` - Update post
- `DELETE /api/blog/posts/[id]` - Delete post

Similar endpoints for categories and tags.

### Database Schema

\`\`\`sql
-- Core tables
blog_posts (id, title, slug, content, status, published_at, ...)
blog_categories (id, name, slug, description, ...)
blog_tags (id, name, slug, ...)
blog_post_tags (post_id, tag_id) -- Junction table
\`\`\`

## 🎨 Customization

### Styling

The system uses Tailwind CSS with a dark theme. Customize colors in your `tailwind.config.js`:

\`\`\`js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4318D1', // Purple theme
          foreground: '#FFFFFF',
        }
      }
    }
  }
}
\`\`\`

### Configuration

Edit `blog.config.js` to customize behavior:

\`\`\`js
const blogConfig = {
  title: "My Blog",
  description: "A modern blog",
  postsPerPage: 10,
  enableComments: false,
  enableSearch: true,
  theme: {
    primaryColor: "#4318D1",
    darkMode: true
  }
}
\`\`\`

## 📚 Usage Examples

### Basic Blog Page

\`\`\`tsx
import { BlogPostList } from '@/components/blog/blog-post-list'
import { getBlogPosts } from '@/lib/blog-api'

export default async function BlogPage() {
  const posts = await getBlogPosts({ limit: 10 })
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogPostList initialPosts={posts} />
    </div>
  )
}
\`\`\`

### Custom Post Card

\`\`\`tsx
import { BlogPostCard } from '@/components/blog/blog-post-card'

export function CustomBlogPage({ posts }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
\`\`\`

### API Usage

\`\`\`tsx
import { BlogApiClient } from '@zemenay/modular-blog'

// Get posts
const { data: posts } = await BlogApiClient.getPosts({
  limit: 5,
  category: 'technology'
})

// Create post
await BlogApiClient.createPost({
  title: 'New Post',
  slug: 'new-post',
  content: 'Post content...',
  status: 'published'
})
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### Other Platforms

The system works with any Next.js hosting platform:
- Netlify
- Railway
- DigitalOcean App Platform
- Self-hosted

## 🛠️ Development

### Local Setup

\`\`\`bash
git clone https://github.com/zemenay/modular-blog.git
cd modular-blog
npm install
npm run dev
\`\`\`

### Building

\`\`\`bash
npm run build
\`\`\`

### Testing

\`\`\`bash
npm run test
npm run test:e2e
\`\`\`

## 📖 API Documentation

### Posts API

#### GET /api/blog/posts

Get paginated list of posts.

**Query Parameters:**
- `limit` (number): Number of posts to return
- `category` (string): Filter by category slug
- `tag` (string): Filter by tag slug
- `status` (string): Filter by status (published, draft, archived)

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "uuid",
      "title": "Post Title",
      "slug": "post-title",
      "excerpt": "Post excerpt...",
      "content": "Full post content...",
      "status": "published",
      "published_at": "2024-01-01T00:00:00Z",
      "blog_categories": {
        "id": "uuid",
        "name": "Technology",
        "slug": "technology"
      },
      "blog_post_tags": [
        {
          "blog_tags": {
            "id": "uuid",
            "name": "React",
            "slug": "react"
          }
        }
      ]
    }
  ]
}
\`\`\`

#### POST /api/blog/posts

Create a new post.

**Request Body:**
\`\`\`json
{
  "title": "Post Title",
  "slug": "post-title",
  "excerpt": "Post excerpt",
  "content": "Full post content",
  "featured_image_url": "https://example.com/image.jpg",
  "category_id": "uuid",
  "status": "published",
  "meta_title": "SEO Title",
  "meta_description": "SEO Description",
  "tag_ids": ["uuid1", "uuid2"]
}
\`\`\`

### Categories API

#### GET /api/blog/categories

Get all categories.

#### POST /api/blog/categories

Create a new category.

**Request Body:**
\`\`\`json
{
  "name": "Category Name",
  "slug": "category-name",
  "description": "Category description"
}
\`\`\`

### Tags API

Similar to categories API but for tags.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add JSDoc comments for public APIs
- Write tests for new features

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Zemenay Tech Solutions hackathon
- Inspired by modern CMS solutions
- Uses amazing open-source libraries

## 📞 Support

- **Documentation**: [docs.zemenay.com/modular-blog](https://docs.zemenay.com/modular-blog)
- **Issues**: [GitHub Issues](https://github.com/zemenay/modular-blog/issues)
- **Discussions**: [GitHub Discussions](https://github.com/zemenay/modular-blog/discussions)
- **Email**: support@zemenay.com

---

Made with ❤️ by [Zemenay Tech Solutions](https://zemenay.com)
