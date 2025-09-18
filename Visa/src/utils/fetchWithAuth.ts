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
      const isOcrDomain = urlString.includes('govissagcpocr-872569311567.asia-south2.run.app');
      if (isOcrDomain) {
        console.log('🔓 Skipping auth for OCR domain:', urlString);
      }
      return isOcrDomain;
    } catch {
      return false;
    }
  })();

  if (token && !shouldSkipAuth) {
    headers.set('Authorization', `Bearer ${token}`);
    console.log('🔐 Adding auth header for:', urlString);
  } else if (shouldSkipAuth) {
    console.log('✅ No auth header for OCR domain');
  }

  const modifiedInit: RequestInit = { ...init, headers };

  return originalFetch(input, modifiedInit);
}) as typeof window.fetch;
