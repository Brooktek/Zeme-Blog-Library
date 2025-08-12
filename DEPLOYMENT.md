# Deployment Guide

This guide covers deploying the Zeme Blog System (`zeme-blog-system`) to various platforms.

## 🚀 Vercel (Recommended)

Vercel provides the best experience for Next.js applications with automatic Supabase integration.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/zeme-blog-system)

### Manual Deployment

1. **Connect Repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables:**
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## 🌐 Netlify

### Deploy from Git

1. **Connect Repository:**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings:**
   \`\`\`
   Build command: npm run build
   Publish directory: .next
   \`\`\`

3. **Environment Variables:**
   - Go to Site settings > Environment variables
   - Add your Supabase credentials

### Deploy from CLI

\`\`\`bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your application
npm run build

# Deploy
netlify deploy --prod --dir=.next
\`\`\`

## 🚢 Docker

### Dockerfile

\`\`\`dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
\`\`\`

### Docker Compose

\`\`\`yaml
version: '3.8'
services:
  blog:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
\`\`\`

### Deploy with Docker

\`\`\`bash
# Build image
docker build -t modular-blog .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  modular-blog
\`\`\`

## ☁️ AWS

### AWS Amplify

1. **Connect Repository:**
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Connect your GitHub repository

2. **Build Settings:**
   \`\`\`yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   \`\`\`

3. **Environment Variables:**
   - Add your Supabase credentials in Amplify console

### AWS EC2

1. **Launch EC2 Instance:**
   - Choose Ubuntu 22.04 LTS
   - Configure security groups (ports 22, 80, 443)

2. **Install Dependencies:**
   \`\`\`bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   \`\`\`

3. **Deploy Application:**
   \`\`\`bash
   # Clone repository
   git clone https://github.com/your-username/modular-blog.git
   cd modular-blog
   
   # Install dependencies
   npm ci
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "blog" -- start
   pm2 startup
   pm2 save
   \`\`\`

4. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   \`\`\`

## 🔧 Railway

1. **Connect Repository:**
   - Go to [Railway Dashboard](https://railway.app/)
   - Click "New Project"
   - Connect your GitHub repository

2. **Environment Variables:**
   - Add your Supabase credentials in Railway dashboard

3. **Custom Domain:**
   - Go to project settings
   - Add your custom domain

## 📱 DigitalOcean App Platform

1. **Create App:**
   - Go to DigitalOcean Control Panel
   - Click "Create" > "Apps"
   - Connect your GitHub repository

2. **Configure Build:**
   \`\`\`yaml
   name: modular-blog
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/modular-blog
       branch: main
     run_command: npm start
     build_command: npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NEXT_PUBLIC_SUPABASE_URL
       value: your_supabase_url
     - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
       value: your_supabase_anon_key
   \`\`\`

## 🔒 Environment Variables

### Required Variables

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Blog Configuration
NEXT_PUBLIC_BLOG_TITLE="My Blog"
NEXT_PUBLIC_BLOG_DESCRIPTION="A modern blog"
\`\`\`

### Security Considerations

- **Never commit** environment variables to version control
- **Use secrets management** for production deployments
- **Rotate keys regularly** for security
- **Limit permissions** of service role keys

## 🚀 Performance Optimization

### Next.js Configuration

\`\`\`js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  // Enable compression
  compress: true,
  // Enable static optimization
  trailingSlash: false,
}

module.exports = nextConfig
\`\`\`

### CDN Configuration

- **Images**: Use Supabase Storage with CDN
- **Static Assets**: Configure CDN for CSS/JS files
- **Caching**: Set appropriate cache headers

### Database Optimization

- **Indexes**: Ensure proper database indexes
- **Connection Pooling**: Use Supabase connection pooling
- **Query Optimization**: Optimize database queries

## 📊 Monitoring

### Error Tracking

\`\`\`bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs')
\`\`\`

### Analytics

\`\`\`bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
\`\`\`

### Performance Monitoring

- **Core Web Vitals**: Monitor with Vercel Analytics
- **Database Performance**: Monitor with Supabase dashboard
- **Error Rates**: Track with error monitoring service

## 🔄 CI/CD Pipeline

### GitHub Actions

\`\`\`yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
\`\`\`

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify environment variables
   - Review build logs

2. **Database Connection:**
   - Verify Supabase credentials
   - Check network connectivity
   - Review database logs

3. **Performance Issues:**
   - Enable Next.js analytics
   - Check database query performance
   - Review CDN configuration

### Getting Help

- **Documentation**: Check deployment platform docs
- **Community**: Ask in GitHub Discussions
- **Support**: Contact platform support teams

---

Need help with deployment? [Open an issue](https://github.com/zemenay/modular-blog/issues) or check our [documentation](https://docs.zemenay.com/modular-blog).
