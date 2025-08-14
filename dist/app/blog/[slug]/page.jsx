"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlogPostPage;
exports.generateMetadata = generateMetadata;
const blog_post_detail_1 = require("@/components/blog/blog-post-detail");
const blog_api_1 = require("@/lib/blog-api");
function BlogPostPage({ params }) {
    // Pass the slug directly from params
    return (<div className="min-h-screen bg-background">
      <blog_post_detail_1.BlogPostDetail slug={params.slug}/>
    </div>);
}
async function generateMetadata({ params }) {
    // Deconstruct the slug from params
    const { slug } = params;
    const post = await (0, blog_api_1.getBlogPost)(slug);
    if (!post) {
        return {
            title: "Post Not Found",
        };
    }
    return {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt,
    };
}
