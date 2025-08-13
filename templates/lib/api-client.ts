// Placeholder for API client

export async function apiClient(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error('API request failed');
  }
  return res.json();
}
