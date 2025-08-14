"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditCategoryPage;
const blog_api_1 = require("@/lib/blog-api");
const edit_category_form_1 = require("./edit-category-form");
const navigation_1 = require("next/navigation");
async function EditCategoryPage({ params }) {
    const category = await (0, blog_api_1.getBlogCategory)(params.slug);
    if (!category) {
        (0, navigation_1.notFound)();
    }
    return <edit_category_form_1.EditCategoryForm category={category}/>;
}
