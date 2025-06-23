'use client';

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const apiClient = {
  get: (url: string) => fetch(url, { headers: getAuthHeaders() }),
  post: (url: string, data: any) => fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  }),
  put: (url: string, data: any) => fetch(url, {
    method: 'PUT', 
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  }),
  delete: (url: string) => fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
};
