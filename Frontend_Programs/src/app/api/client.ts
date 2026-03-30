const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string) || 'http://localhost:3001/api';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') {
    return {};
  }

  const role = (localStorage.getItem('labflow_role') || 'viewer').toLowerCase();
  const editorPin = localStorage.getItem('labflow_editor_pin') || '';

  const headers: HeadersInit = {
    'x-user-role': role,
    'x-username': role,
  };

  if (role === 'editor' && editorPin) {
    (headers as Record<string, string>)['x-pin'] = editorPin;
  }

  return headers;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...getAuthHeaders(),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `${init.method || 'GET'} ${path} failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export async function apiPost<T>(path: string, payload: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function apiPut<T>(path: string, payload: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function apiPatch<T>(path: string, payload: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, {
    method: 'DELETE',
  });
}
