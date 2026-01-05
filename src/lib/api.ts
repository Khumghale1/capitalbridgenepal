// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Extract skip-auth flag and remove it from headers
  const headersObj = options.headers as Record<string, string> || {};
  const skipAuth = headersObj['skip-auth'] === 'true';
  const { 'skip-auth': _, ...restHeaders } = headersObj;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...restHeaders,
  };

  // Add auth token if available (unless explicitly excluded)
  const token = getAuthToken();
  if (token && !skipAuth) {
    headers['Authorization'] = token;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Required for CORS with credentials
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }

  return data as T;
}

// API Endpoints
export const api = {
  // Auth APIs
  auth: {
    login: async (email: string, password: string) => {
      return apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'skip-auth': 'true' }, // Don't send auth for login
      });
    },
  },

  // Interest APIs
  interests: {
    // Submit interest (Public)
    submit: async (data: {
      businessId: string;
      investorName: string;
      phoneNumber: string;
      email: string;
      remarks?: string;
    }) => {
      return apiRequest('/api/interests', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'skip-auth': 'true' }, // Public endpoint
      });
    },

    // Get all interests (Admin only)
    getAll: async (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      const endpoint = query ? `/api/interests?${query}` : '/api/interests';

      return apiRequest(endpoint, {
        method: 'GET',
      });
    },
  },

  // Business APIs
  businesses: {
    getAll: async () => {
      return apiRequest('/api/businesses', {
        method: 'GET',
        headers: { 'skip-auth': 'true' }, // Public endpoint
      });
    },

    getById: async (id: string) => {
      return apiRequest(`/api/businesses/${id}`, {
        method: 'GET',
        headers: { 'skip-auth': 'true' }, // Public endpoint
      });
    },

    // Admin endpoints
    getPending: async (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      const endpoint = query ? `/api/businesses/pending?${query}` : '/api/businesses/pending';

      return apiRequest(endpoint, {
        method: 'GET',
      });
    },

    approve: async (id: string) => {
      return apiRequest(`/api/businesses/${id}/approve`, {
        method: 'PUT',
      });
    },

    reject: async (id: string, rejectionReason: string) => {
      return apiRequest(`/api/businesses/${id}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ rejectionReason }),
      });
    },

    // Get all active businesses for admin
    getActive: async (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      const endpoint = query ? `/api/businesses/active?${query}` : '/api/businesses/active';

      return apiRequest(endpoint, {
        method: 'GET',
      });
    },

    // Get full business details by ID (Admin)
    getDetailsById: async (id: string) => {
      return apiRequest(`/api/businesses/${id}/details`, {
        method: 'GET',
      });
    },

    // Update business (Admin)
    update: async (id: string, data: Record<string, unknown>) => {
      return apiRequest(`/api/businesses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // Toggle business active status (Admin)
    toggleActive: async (id: string) => {
      return apiRequest(`/api/businesses/${id}/toggle-active`, {
        method: 'PUT',
      });
    },

    // Get all removal requests (Admin)
    getRemovalRequests: async (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      const endpoint = query ? `/api/businesses/removal-requests?${query}` : '/api/businesses/removal-requests';

      return apiRequest(endpoint, {
        method: 'GET',
      });
    },

    // Approve removal request (Admin)
    approveRemovalRequest: async (requestId: string) => {
      return apiRequest(`/api/businesses/removal-requests/${requestId}/approve`, {
        method: 'PUT',
      });
    },

    // Reject removal request (Admin)
    rejectRemovalRequest: async (requestId: string) => {
      return apiRequest(`/api/businesses/removal-requests/${requestId}/reject`, {
        method: 'PUT',
      });
    },
  },

  // Onboarding APIs
  onboarding: {
    submit: async (data: {
      businessName: string;
      email: string;
      phoneNumber: string;
      message?: string;
    }) => {
      return apiRequest('/api/onboarding/request', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'skip-auth': 'true' }, // Public endpoint
      });
    },

    // Get all onboarding requests (Admin only)
    getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);

      const query = queryParams.toString();
      const endpoint = query ? `/api/onboarding/requests?${query}` : '/api/onboarding/requests';

      return apiRequest(endpoint, {
        method: 'GET',
      });
    },

    // Approve request and generate token (Admin only)
    approve: async (requestId: string) => {
      return apiRequest(`/api/onboarding/requests/${requestId}/approve`, {
        method: 'PUT',
      });
    },

    // Validate registration token (Public)
    validateToken: async (token: string) => {
      return apiRequest(`/api/onboarding/validate/${token}`, {
        method: 'GET',
        headers: { 'skip-auth': 'true' }, // Public endpoint
      });
    },

    // Complete registration with token (Public)
    register: async (data: Record<string, unknown>) => {
      return apiRequest('/api/onboarding/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'skip-auth': 'true' }, // Public endpoint
      });
    },
  },

  // Business Profile APIs (for logged-in business users)
  businessProfile: {
    // Get own business profile
    getOwnProfile: async () => {
      return apiRequest('/api/business/profile', {
        method: 'GET',
      });
    },

    // Update own business profile
    updateOwnProfile: async (data: Record<string, unknown>) => {
      return apiRequest('/api/business/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // Get investment inquiries for own business
    getOwnInterests: async (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      const endpoint = query ? `/api/business/interests?${query}` : '/api/business/interests';

      return apiRequest(endpoint, {
        method: 'GET',
      });
    },

    // Change password
    changePassword: async (data: { currentPassword: string; newPassword: string }) => {
      return apiRequest('/api/business/change-password', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // Request profile removal
    requestRemoval: async (data: { reason?: string }) => {
      return apiRequest('/api/business/request-removal', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
};

// Export base URL for direct use if needed
export { API_BASE_URL };