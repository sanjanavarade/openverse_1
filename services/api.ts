const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth API
export const authAPI = {
  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getActivityGraph: async () => {
    const response = await fetch(`${API_URL}/dashboard/activity-graph`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// GitHub API
export const githubAPI = {
  searchRepositories: async (filters: any) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/github/repositories/search?${params}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// AI API
export const aiAPI = {
  analyzeRepository: async (repoUrl: string) => {
    const response = await fetch(`${API_URL}/ai/analyze-repository`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ repoUrl })
    });
    return response.json();
  },

  generateReadme: async (tone: string) => {
    const response = await fetch(`${API_URL}/ai/generate-readme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ tone })
    });
    return response.json();
  }
};