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

  const response = await originalFetch(input, modifiedInit);

  // ✅ NEW: Handle authentication errors globally
  if (response.status === 401 || response.status === 403) {
    const responseClone = response.clone();
    try {
      const errorData = await responseClone.json();
      if (errorData.message && (errorData.message.includes('expired') || errorData.message.includes('Invalid'))) {
        console.warn('🚨 Token expired or invalid, logging out...');
        
        // Determine which login page to redirect to BEFORE clearing localStorage
        const currentPath = window.location.pathname;
        const hasAdminId = localStorage.getItem('adminId');
        const hasEmployee = localStorage.getItem('employee');
        const hasManager = localStorage.getItem('manager');
        const hasUser = localStorage.getItem('user');
        
        // Clear localStorage
        localStorage.clear();
        
        // Redirect based on user type
        if (currentPath.includes('/dashboard') || currentPath.includes('/admin') || hasAdminId) {
          window.location.href = '/admin/login';
        } else if (currentPath.includes('/employee') || hasEmployee) {
          window.location.href = '/employee';
        } else if (currentPath.includes('/manager') || hasManager) {
          window.location.href = '/manager';
        } else if (currentPath.includes('/user') || hasUser) {
          window.location.href = '/auth';
        } else {
          // Default fallback to home page
          window.location.href = '/';
        }
      }
    } catch (e) {
      // If response is not JSON, ignore
    }
  }

  return response;
}) as typeof window.fetch;
