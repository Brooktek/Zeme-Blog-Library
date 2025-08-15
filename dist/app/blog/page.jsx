"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlogPage;
const blog_post_list_1 = require("@/components/blog/blog-post-list");
function BlogPage() {
    return (<div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our latest articles, tutorials, and insights.
          </p>
        </div>

        <blog_post_list_1.BlogPostList showFilters={true}/>
      </div>
    </div>);
}
