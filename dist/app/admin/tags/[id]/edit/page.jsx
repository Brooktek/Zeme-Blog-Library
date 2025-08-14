"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditTagPage;
const blog_api_1 = require("@/lib/blog-api");
const edit_tag_form_1 = require("./edit-tag-form");
const navigation_1 = require("next/navigation");
async function EditTagPage({ params }) {
    const tag = await (0, blog_api_1.getBlogTag)(params.id);
    if (!tag) {
        (0, navigation_1.notFound)();
    }
    return <edit_tag_form_1.EditTagForm tag={tag}/>;
}
