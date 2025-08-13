"use strict";
// API client utilities for making requests to our blog API
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogApiClient = void 0;
const API_BASE = "/api/blog";
class BlogApiClient {
    // Posts
    static async getPosts(params) {
        const searchParams = new URLSearchParams();
        if (params?.limit)
            searchParams.set("limit", params.limit.toString());
        if (params?.category)
            searchParams.set("category", params.category);
        if (params?.tag)
            searchParams.set("tag", params.tag);
        if (params?.status)
            searchParams.set("status", params.status);
        const response = await fetch(`${API_BASE}/posts?${searchParams}`);
        if (!response.ok)
            throw new Error("Failed to fetch posts");
        return response.json();
    }
    static async getPost(id) {
        const response = await fetch(`${API_BASE}/posts/${id}`);
        if (!response.ok)
            throw new Error("Failed to fetch post");
        return response.json();
    }
    static async getPostBySlug(slug) {
        const response = await fetch(`${API_BASE}/posts/slug/${slug}`);
        if (!response.ok)
            throw new Error("Failed to fetch post");
        return response.json();
    }
    static async createPost(data) {
        const response = await fetch(`${API_BASE}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error("Failed to create post");
        return response.json();
    }
    static async updatePost(id, data) {
        const response = await fetch(`${API_BASE}/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error("Failed to update post");
        return response.json();
    }
    static async deletePost(id) {
        const response = await fetch(`${API_BASE}/posts/${id}`, {
            method: "DELETE",
        });
        if (!response.ok)
            throw new Error("Failed to delete post");
        return response.json();
    }
    // Categories
    static async getCategories() {
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok)
            throw new Error("Failed to fetch categories");
        return response.json();
    }
    static async createCategory(data) {
        const response = await fetch(`${API_BASE}/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error("Failed to create category");
        return response.json();
    }
    static async updateCategory(id, data) {
        const response = await fetch(`${API_BASE}/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error("Failed to update category");
        return response.json();
    }
    static async deleteCategory(id) {
        const response = await fetch(`${API_BASE}/categories/${id}`, {
            method: "DELETE",
        });
        if (!response.ok)
            throw new Error("Failed to delete category");
        return response.json();
    }
    // Tags
    static async getTags() {
        const response = await fetch(`${API_BASE}/tags`);
        if (!response.ok)
            throw new Error("Failed to fetch tags");
        return response.json();
    }
    static async createTag(data) {
        const response = await fetch(`${API_BASE}/tags`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error("Failed to create tag");
        return response.json();
    }
    static async updateTag(id, data) {
        const response = await fetch(`${API_BASE}/tags/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error("Failed to update tag");
        return response.json();
    }
    static async deleteTag(id) {
        const response = await fetch(`${API_BASE}/tags/${id}`, {
            method: "DELETE",
        });
        if (!response.ok)
            throw new Error("Failed to delete tag");
        return response.json();
    }
    // Admin
    static async getStats() {
        const response = await fetch("/api/admin/stats");
        if (!response.ok)
            throw new Error("Failed to fetch stats");
        return response.json();
    }
}
exports.BlogApiClient = BlogApiClient;
