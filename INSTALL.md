# Installation Guide

This guide will walk you through integrating the Zeme Blog System into your Next.js project using the official CLI.

## Prerequisites

Before you begin, ensure you have a Next.js project with the following installed:
- **TypeScript**
- **Tailwind CSS**

## Step 1: Install the Package

In your Next.js project directory, install the `zeme-blog-system` package from npm:

```bash
npm install zeme-blog-system
```

## Step 2: Run the `install` Command

The `install` command sets up the core files, styles, and configurations needed for the blog system.

```bash
npx zeme-blog-system install
```

This command will:
- Install peer dependencies (like Radix UI).
- Modify your `tailwind.config.ts`.
- Add necessary global CSS styles.

## Step 3: Run the `init` Command

The `init` command configures the backend aspects of your blog, such as the database connection. You will be prompted to enter your Supabase credentials.

```bash
npx zeme-blog-system init
```

Make sure you have your Supabase URL and `anon` key ready for this step.

## Step 4: Add Components

Use the `add` command to add individual blog components to your project. The components will be added directly to your `components` directory, giving you full control over them.

```bash
npx zeme-blog-system add <component-name>
```

### Available Components

- `post-card`
- `post-list`
- `post-detail`
- `admin-dashboard`
- `post-form`
- `stats-card`

### Example

To add the main blog post list, run:

```bash
npx zeme-blog-system add post-list
```

That's it! You now have a fully integrated and customizable blog in your Next.js application.
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
