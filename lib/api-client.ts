// API client utilities for making requests to our blog API

const API_BASE = "/api/blog"

export class BlogApiClient {
  // Posts
  static async getPosts(params?: {
    limit?: number
    category?: string
    tag?: string
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.category) searchParams.set("category", params.category)
    if (params?.tag) searchParams.set("tag", params.tag)
    if (params?.status) searchParams.set("status", params.status)

    const response = await fetch(`${API_BASE}/posts?${searchParams}`)
    if (!response.ok) throw new Error("Failed to fetch posts")
    return response.json()
  }

  static async getPost(id: string) {
    const response = await fetch(`${API_BASE}/posts/${id}`)
    if (!response.ok) throw new Error("Failed to fetch post")
    return response.json()
  }

  static async getPostBySlug(slug: string) {
    const response = await fetch(`${API_BASE}/posts/slug/${slug}`)
    if (!response.ok) throw new Error("Failed to fetch post")
    return response.json()
  }

  static async createPost(data: any) {
    const response = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create post")
    return response.json()
  }

  static async updatePost(id: string, data: any) {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update post")
    return response.json()
  }

  static async deletePost(id: string) {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete post")
    return response.json()
  }

  // Categories
  static async getCategories() {
    const response = await fetch(`${API_BASE}/categories`)
    if (!response.ok) throw new Error("Failed to fetch categories")
    return response.json()
  }

  static async createCategory(data: { name: string; slug: string; description?: string }) {
    const response = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create category")
    return response.json()
  }

  static async updateCategory(id: string, data: { name: string; slug: string; description?: string }) {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update category")
    return response.json()
  }

  static async deleteCategory(id: string) {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete category")
    return response.json()
  }

  // Tags
  static async getTags() {
    const response = await fetch(`${API_BASE}/tags`)
    if (!response.ok) throw new Error("Failed to fetch tags")
    return response.json()
  }

  static async createTag(data: { name: string; slug: string }) {
    const response = await fetch(`${API_BASE}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create tag")
    return response.json()
  }

  static async updateTag(id: string, data: { name: string; slug: string }) {
    const response = await fetch(`${API_BASE}/tags/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update tag")
    return response.json()
  }

  static async deleteTag(id: string) {
    const response = await fetch(`${API_BASE}/tags/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete tag")
    return response.json()
  }

  // Admin
  static async getStats() {
    const response = await fetch("/api/admin/stats")
    if (!response.ok) throw new Error("Failed to fetch stats")
    return response.json()
  }
}
