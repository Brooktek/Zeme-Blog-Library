-- Insert sample categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Posts about technology, programming, and software development'),
  ('Design', 'design', 'Posts about UI/UX design, web design, and creative processes'),
  ('Business', 'business', 'Posts about entrepreneurship, business strategy, and industry insights'),
  ('Tutorial', 'tutorial', 'Step-by-step guides and educational content')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample tags
INSERT INTO blog_tags (name, slug) VALUES
  ('React', 'react'),
  ('Next.js', 'nextjs'),
  ('TypeScript', 'typescript'),
  ('Tailwind CSS', 'tailwind-css'),
  ('JavaScript', 'javascript'),
  ('Web Development', 'web-development'),
  ('UI/UX', 'ui-ux'),
  ('Performance', 'performance'),
  ('SEO', 'seo'),
  ('Best Practices', 'best-practices')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
WITH tech_category AS (
  SELECT id FROM blog_categories WHERE slug = 'technology' LIMIT 1
),
design_category AS (
  SELECT id FROM blog_categories WHERE slug = 'design' LIMIT 1
),
tutorial_category AS (
  SELECT id FROM blog_categories WHERE slug = 'tutorial' LIMIT 1
)
INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, published_at, reading_time, meta_title, meta_description) VALUES
  (
    'Getting Started with Next.js 15',
    'getting-started-nextjs-15',
    'Learn the fundamentals of Next.js 15 and build your first modern web application.',
    '# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements that make building React applications even more powerful and efficient.

## What''s New in Next.js 15

- **Improved App Router**: Enhanced routing capabilities with better performance
- **Server Components**: Better server-side rendering and data fetching
- **Enhanced TypeScript Support**: Improved type safety and developer experience

## Setting Up Your First Project

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
