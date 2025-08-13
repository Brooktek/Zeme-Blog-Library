const apiClient = {
  get: async (url: string) => {
    const response = await fetch(`/api${url}`);
    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }
    return response.json();
  },
};

export default apiClient;

export async function apiClient(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error('API request failed');
  }
  return res.json();
}
