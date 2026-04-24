// lib/api.ts
const API_BASE = '/api/v1';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  // ✅ Fix: Check if response has content before parsing JSON
  const contentType = response.headers.get('content-type');
  let data = null;
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }
  
  if (!response.ok) {
    const isLoginEndpoint = endpoint === '/auth/login';
    
    if (response.status === 401 && !isLoginEndpoint) {
      const refreshed = await refreshToken();
      if (refreshed) {
        return apiFetch(endpoint, options);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/auth/admin/login';
        throw new Error('Session expired');
      }
    }
    throw new Error(data?.message || `API request failed: ${response.status}`);
  }
  
  return data;
}

async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.data.accessToken);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  
  return false;
}

export const api = {
  get: <T = any>(endpoint: string) => 
    apiFetch(endpoint, { method: 'GET' }) as Promise<T>,
  
  post: <T = any>(endpoint: string, data?: any) => 
    apiFetch(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }) as Promise<T>,
  
  put: <T = any>(endpoint: string, data?: any) => 
    apiFetch(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }) as Promise<T>,
  
  patch: <T = any>(endpoint: string, data?: any) => 
    apiFetch(endpoint, { 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }) as Promise<T>,
  
  delete: <T = any>(endpoint: string) => 
    apiFetch(endpoint, { method: 'DELETE' }) as Promise<T>,
};