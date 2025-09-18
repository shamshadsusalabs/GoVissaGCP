// src/utils/fetchWithAuth.ts

const originalFetch = window.fetch.bind(window); // bind karo original fetch ko window se

window.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const token = localStorage.getItem('accessToken');

  const headers = new Headers(init?.headers || {});

  // Determine target URL to decide whether to attach Authorization
  let urlString = '';
  if (typeof input === 'string') urlString = input;
  else if (input instanceof URL) urlString = input.toString();
  else if (typeof (input as Request).url === 'string') urlString = (input as Request).url;

  const shouldSkipAuth = (() => {
    try {
      // Skip auth for OCR Cloud Run domain to keep CORS simple
      return urlString.includes('govissagcpocr-872569311567.asia-south2.run.app');
    } catch {
      return false;
    }
  })();

  if (token && !shouldSkipAuth) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const modifiedInit: RequestInit = { ...init, headers };

  return originalFetch(input, modifiedInit);
}) as typeof window.fetch;
