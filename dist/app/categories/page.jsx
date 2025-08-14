"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoriesPage;
const blog_api_1 = require("@/lib/blog-api");
const link_1 = __importDefault(require("next/link"));
async function CategoriesPage() {
    const categories = await (0, blog_api_1.getBlogCategories)();
    return (<div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold">Categories</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (<link_1.default href={`/categories/${category.slug}`} key={category.id}>
            <a className="block rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
              <h2 className="mb-2 text-2xl font-semibold">{category.name}</h2>
              <p className="text-gray-600">{category.description}</p>
            </a>
          </link_1.default>))}
      </div>
    </div>);
}
