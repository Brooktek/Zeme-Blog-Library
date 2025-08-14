"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
const blog_post_list_1 = require("@/components/blog/blog-post-list");
const blog_api_1 = require("@/lib/blog-api");
async function HomePage() {
    const [posts, categories] = await Promise.all([(0, blog_api_1.getBlogPosts)({ limit: 9 }), (0, blog_api_1.getBlogCategories)()]);
    return (<div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover insights, tutorials, and stories from our team of experts.
          </p>
        </div>

        <blog_post_list_1.BlogPostList initialPosts={posts} initialCategories={categories} showFilters={true}/>
      </div>
    </div>);
}
