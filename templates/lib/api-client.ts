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
