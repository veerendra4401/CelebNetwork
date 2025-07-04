const API_BASE_URL = '/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  let user = null;
  
  // Get user from localStorage
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  }

  // Merge headers
  const headers = {
    'Content-Type': 'application/json',
    ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    // Clear stored user data
    localStorage.removeItem('user');
    // Reload the page to trigger the AuthGuard
    window.location.reload();
    throw new Error('Session expired');
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
} 