"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogPosts = getBlogPosts;
exports.getBlogPost = getBlogPost;
exports.getBlogCategories = getBlogCategories;
exports.getBlogCategory = getBlogCategory;
exports.createBlogCategory = createBlogCategory;
exports.updateBlogCategory = updateBlogCategory;
exports.deleteBlogCategory = deleteBlogCategory;
exports.getBlogTags = getBlogTags;
exports.getBlogTag = getBlogTag;
exports.createBlogTag = createBlogTag;
exports.updateBlogTag = updateBlogTag;
exports.deleteBlogTag = deleteBlogTag;
exports.getBlogPostsByCategory = getBlogPostsByCategory;
exports.getBlogPostsByTag = getBlogPostsByTag;
exports.getRelatedPosts = getRelatedPosts;
const client_1 = require("./supabase/client");
async function getBlogPosts(options = {}) {
    let query = client_1.supabase.from("blog_posts").select(`
    *,
    blog_categories (*),
    blog_tags (*)
  `);
    if (options.category) {
        const { data: category, error: categoryError } = await client_1.supabase
            .from("blog_categories")
            .select("id")
            .eq("slug", options.category)
            .single();
        if (categoryError) {
            console.error("Error fetching category for filtering:", categoryError.message);
            return [];
        }
        if (category) {
            query = query.eq("category_id", category.id);
        }
        else {
            return [];
        }
    }
    if (options.status && options.status !== "all") {
        query = query.eq("status", options.status);
    }
    if (options.limit) {
        query = query.limit(options.limit);
    }
    const { data: posts, error } = await query;
    if (error) {
        console.error("Error fetching blog posts:", error.message);
        throw new Error(error.message);
    }
    return posts || [];
}
async function getBlogPost(slug) {
    const { data: post, error } = await client_1.supabase
        .from("blog_posts")
        .select(`
      *,
      blog_categories (*),
      blog_tags (*)
    `)
        .eq("slug", slug)
        .single();
    if (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error.message);
        return null;
    }
    return post;
}
async function getBlogCategories() {
    const { data: categories, error } = await client_1.supabase.from("blog_categories").select("*");
    if (error) {
        console.error("Error fetching blog categories:", error.message);
        throw new Error(error.message);
    }
    return categories || [];
}
async function getBlogCategory(slug) {
    const { data: category, error } = await client_1.supabase
        .from("blog_categories")
        .select("*")
        .eq("slug", slug)
        .single();
    if (error) {
        console.error(`Error fetching blog category with slug ${slug}:`, error.message);
        return null;
    }
    return category;
}
async function createBlogCategory(category) {
    const { data, error } = await client_1.supabase.from("blog_categories").insert([category]).select().single();
    if (error) {
        console.error("Error creating blog category:", error.message);
        throw new Error(error.message);
    }
    return data;
}
async function updateBlogCategory(id, updates) {
    const { data, error } = await client_1.supabase.from("blog_categories").update(updates).eq("id", id).select().single();
    if (error) {
        console.error(`Error updating blog category with id ${id}:`, error.message);
        throw new Error(error.message);
    }
    return data;
}
async function deleteBlogCategory(id) {
    const { error } = await client_1.supabase.from("blog_categories").delete().eq("id", id);
    if (error) {
        console.error(`Error deleting blog category with id ${id}:`, error.message);
        throw new Error(error.message);
    }
    return true;
}
async function getBlogTags() {
    const { data: tags, error } = await client_1.supabase.from("blog_tags").select("*");
    if (error) {
        console.error("Error fetching blog tags:", error.message);
        throw new Error(error.message);
    }
    return tags || [];
}
async function getBlogTag(id) {
    const { data: tag, error } = await client_1.supabase
        .from("blog_tags")
        .select("*")
        .eq("id", id)
        .single();
    if (error) {
        console.error(`Error fetching blog tag with id ${id}:`, error.message);
        return null;
    }
    return tag;
}
async function createBlogTag(tag) {
    const { data, error } = await client_1.supabase.from("blog_tags").insert([tag]).select().single();
    if (error) {
        console.error("Error creating blog tag:", error.message);
        throw new Error(error.message);
    }
    return data;
}
async function updateBlogTag(id, updates) {
    const { data, error } = await client_1.supabase.from("blog_tags").update(updates).eq("id", id).select().single();
    if (error) {
        console.error(`Error updating blog tag with id ${id}:`, error.message);
        throw new Error(error.message);
    }
    return data;
}
async function deleteBlogTag(id) {
    const { error } = await client_1.supabase.from("blog_tags").delete().eq("id", id);
    if (error) {
        console.error(`Error deleting blog tag with id ${id}:`, error.message);
        throw new Error(error.message);
    }
    return true;
}
async function getBlogPostsByCategory(category, options) {
    let query = client_1.supabase
        .from("blog_posts")
        .select(`
      *,
      blog_categories (id, name, slug, description),
      blog_post_tags (blog_tags (id, name, slug))
    `)
        .eq("blog_categories.slug", category)
        .order("published_at", { ascending: false });
    if (options?.status) {
        query = query.eq("status", options.status);
    }
    else {
        query = query.eq("status", "published");
    }
    if (options?.limit) {
        query = query.limit(options.limit);
    }
    const { data, error } = await query;
    if (error) {
        console.error("Error fetching blog posts by category:", error);
        return [];
    }
    return data;
}
async function getBlogPostsByTag(tag, options) {
    let query = client_1.supabase
        .from("blog_posts")
        .select(`
      *,
      blog_categories (id, name, slug, description),
      blog_post_tags (blog_tags (id, name, slug))
    `)
        .eq("blog_post_tags.blog_tags.slug", tag)
        .order("published_at", { ascending: false });
    if (options?.status) {
        query = query.eq("status", options.status);
    }
    else {
        query = query.eq("status", "published");
    }
    if (options?.limit) {
        query = query.limit(options.limit);
    }
    const { data, error } = await query;
    if (error) {
        console.error("Error fetching blog posts by tag:", error);
        return [];
    }
    return data;
}
async function getRelatedPosts(currentPostId, categoryId, limit = 3) {
    let query = client_1.supabase
        .from("blog_posts")
        .select(`
      *,
      blog_categories (id, name, slug, description),
      blog_post_tags (blog_tags (id, name, slug))
    `)
        .eq("status", "published")
        .neq("id", currentPostId)
        .order("published_at", { ascending: false })
        .limit(limit);
    if (categoryId) {
        query = query.eq("category_id", categoryId);
    }
    const { data, error } = await query;
    if (error) {
        console.error("Error fetching related posts:", error);
        return [];
    }
    return data;
}
