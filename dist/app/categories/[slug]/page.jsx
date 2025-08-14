"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryPage;
const blog_api_1 = require("@/lib/blog-api");
const blog_post_list_1 = require("@/components/blog/blog-post-list");
async function CategoryPage({ params }) {
    const category = await (0, blog_api_1.getBlogCategory)(params.slug);
    const posts = await (0, blog_api_1.getBlogPosts)({ category: params.slug });
    if (!category) {
        return <div>Category not found</div>;
    }
    return (<div className="container mx-auto py-12">
      <h1 className="mb-4 text-4xl font-bold">{category.name}</h1>
      <p className="mb-8 text-lg text-gray-600">{category.description}</p>
      <blog_post_list_1.BlogPostList initialPosts={posts}/>
    </div>);
}
