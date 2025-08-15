# Zeme Blog System

A production-ready, modular blog system for Next.js applications with a Supabase backend. Available as `zeme-blog-system` on npm.

## Features

- **Plug-and-Play**: Install via npm and integrate in minutes with a single CLI command.
- **Modern Stack**: Built with Next.js (App Router), TypeScript, and Tailwind CSS.
- **Supabase Backend**: Uses Supabase for database and authentication.
- **Full-Featured Admin**: A complete admin dashboard to manage posts, categories, and tags.
- **Component-Based**: Includes a set of clean, reusable components for your public-facing blog.
- **Responsive Design**: Mobile-first design with dark theme support.
- **Type Safe**: Full TypeScript support for all components and APIs.

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

For a complete walkthrough, including setting up your Supabase project and environment variables, see the [**Installation Guide**](./INSTALL.md).

## What's Included?

The CLI installer adds the following to your project:

- **`/app/admin/**`**: The complete admin dashboard for managing content.
- **`/app/api/admin/**`**: All backend API routes for CRUD operations.
- **`/app/blog/**`**: Basic public-facing pages to display posts.
- **`/components/blog/**`**: Reusable components like `BlogPostCard` and `BlogPostDetail`.
- **`/lib/**`**: Supabase client setup and helper functions.
- **`/templates/scripts/schema.sql`**: The complete database schema to run in your Supabase project.

## Acknowledgments

- Built for the Zemenay Tech Solutions hackathon.
- Inspired by modern headless CMS solutions.

---

Made with ❤️ by SlowMoon for [Zemenay Tech Solutions](https://www.zemenaytech.com/)
