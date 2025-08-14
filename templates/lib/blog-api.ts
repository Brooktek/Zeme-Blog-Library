import apiClient from './api-client';

export async function getPosts() {
  return apiClient.get('/blog/posts');
}

export async function getPostBySlug(slug: string) {
  return apiClient.get(`/blog/posts/slug/${slug}`);
}

export async function getCategories() {
  return apiClient.get('/blog/categories');
}

export async function getPostsByCategory(categorySlug: string) {
  return apiClient.get(`/blog/posts?category=${categorySlug}`);
}

export async function getPostsByTag(tagSlug: string) {
  return apiClient.get(`/blog/posts?tag=${tagSlug}`);
}


