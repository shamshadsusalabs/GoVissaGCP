// src/utils/fetchWithAuth.ts

const originalFetch = window.fetch.bind(window); // bind karo original fetch ko window se

window.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const token = localStorage.getItem('accessToken');

  const headers = new Headers(init?.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const modifiedInit: RequestInit = { ...init, headers };

  return originalFetch(input, modifiedInit);
}) as typeof window.fetch;
