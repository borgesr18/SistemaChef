// 📁 src/lib/apiClient.ts
'use client';

export const getAuthHeaders = () => {
  const supabaseAccessToken = document.cookie
    ?.split('; ')
    .find((row) => row.startsWith('sb-access-token='))
    ?.split('=')[1];

  return {
    Authorization: supabaseAccessToken ? `Bearer ${supabaseAccessToken}` : '',
  };
};

export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return response;
  },

  post: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  },

  put: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (url: string) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return response;
  },
};
