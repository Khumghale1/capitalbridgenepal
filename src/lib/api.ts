import type { MediaType, MediaTypesResponse, MediaUploadResponse, MediaListResponse, BusinessMedia } from '@/types/media';

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
    throw new Error(data.message || data.error || `API Error: ${response.status}`);
  }

  return data as T;
}

// Helper function for file uploads (FormData requests)
async function uploadRequest<T>(
  endpoint: string,
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(response as T);
        } else {
          reject(new Error(response.message || response.error || `Upload failed: ${xhr.status}`));
        }
      } catch {
        reject(new Error('Failed to parse response'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    xhr.open('POST', url);
    xhr.withCredentials = true;

    if (token) {
      xhr.setRequestHeader('Authorization', token);
    }

    xhr.send(formData);
  });
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
      investorName?: string;
      phoneNumber?: string;
      email?: string;
      message?: string;
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

    // Get interests for a specific business (Admin only)
    getByBusinessId: async (businessId: string, params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      const endpoint = query
        ? `/api/interests/business/${businessId}?${query}`
        : `/api/interests/business/${businessId}`;

      return apiRequest(endpoint, {
        method: 'GET',
      });
    },

    // Update interest follow-up details (Admin only)
    update: async (interestId: string, data: { contacted?: boolean; followUpRemarks?: string; businessId: string }) => {
      return apiRequest(`/api/interests/${interestId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // Add a new follow-up to an interest (Admin only)
    addFollowUp: async (interestId: string, remarks: string, businessId: string) => {
      return apiRequest(`/api/interests/${interestId}/followups`, {
        method: 'POST',
        body: JSON.stringify({ remarks, businessId }),
      });
    },

    // Update a follow-up (Admin only)
    updateFollowUp: async (followUpId: string, remarks: string, businessId: string) => {
      return apiRequest(`/api/interests/followups/${followUpId}`, {
        method: 'PUT',
        body: JSON.stringify({ remarks, businessId }),
      });
    },

    // Delete a follow-up (Admin only)
    deleteFollowUp: async (followUpId: string, businessId: string) => {
      return apiRequest(`/api/interests/followups/${followUpId}`, {
        method: 'DELETE',
        body: JSON.stringify({ businessId }),
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

    // Update interest follow-up details
    updateInterest: async (interestId: string, data: { contacted?: boolean; followUpRemarks?: string }) => {
      return apiRequest(`/api/business/interests/${interestId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // Add a new follow-up to an interest
    addFollowUp: async (interestId: string, remarks: string) => {
      return apiRequest(`/api/business/interests/${interestId}/followups`, {
        method: 'POST',
        body: JSON.stringify({ remarks }),
      });
    },

    // Update a follow-up
    updateFollowUp: async (followUpId: string, remarks: string) => {
      return apiRequest(`/api/business/followups/${followUpId}`, {
        method: 'PUT',
        body: JSON.stringify({ remarks }),
      });
    },

    // Delete a follow-up
    deleteFollowUp: async (followUpId: string) => {
      return apiRequest(`/api/business/followups/${followUpId}`, {
        method: 'DELETE',
      });
    },
  },

  // Upload/Media APIs
  upload: {
    // Get available media types and their limits
    getMediaTypes: async (): Promise<MediaTypesResponse> => {
      return apiRequest<MediaTypesResponse>('/api/upload/media-types', {
        method: 'GET',
      });
    },

    // Upload business media (file)
    uploadMedia: async (
      businessId: string,
      mediaType: MediaType,
      file: File,
      options?: {
        title?: string;
        description?: string;
        onProgress?: (progress: number) => void;
      }
    ): Promise<MediaUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('businessId', businessId);
      formData.append('mediaType', mediaType);
      if (options?.title) formData.append('title', options.title);
      if (options?.description) formData.append('description', options.description);

      return uploadRequest<MediaUploadResponse>(
        '/api/upload/media',
        formData,
        options?.onProgress
      );
    },

    // Upload business logo (shorthand)
    uploadLogo: async (
      businessId: string,
      file: File,
      onProgress?: (progress: number) => void
    ): Promise<MediaUploadResponse & { logoUrl: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('businessId', businessId);
      formData.append('mediaType', 'COMPANY_LOGO');

      return uploadRequest<MediaUploadResponse & { logoUrl: string }>(
        '/api/upload/logo',
        formData,
        onProgress
      );
    },

    // Add external URL (YouTube, Website)
    addExternalUrl: async (
      businessId: string,
      mediaType: 'YOUTUBE_VIDEO' | 'WEBSITE',
      externalUrl: string,
      options?: { title?: string; description?: string }
    ): Promise<MediaUploadResponse> => {
      return apiRequest<MediaUploadResponse>('/api/upload/external-url', {
        method: 'POST',
        body: JSON.stringify({
          businessId,
          mediaType,
          externalUrl,
          title: options?.title,
          description: options?.description,
        }),
      });
    },

    // Get business media
    getMedia: async (
      businessId: string,
      options?: { mediaType?: MediaType; grouped?: boolean }
    ): Promise<MediaListResponse> => {
      const params = new URLSearchParams();
      if (options?.mediaType) params.append('mediaType', options.mediaType);
      if (options?.grouped) params.append('grouped', 'true');

      const query = params.toString();
      const endpoint = query
        ? `/api/upload/media/${businessId}?${query}`
        : `/api/upload/media/${businessId}`;

      return apiRequest<MediaListResponse>(endpoint, {
        method: 'GET',
      });
    },

    // Delete media
    deleteMedia: async (mediaId: string): Promise<{ message: string }> => {
      return apiRequest<{ message: string }>(`/api/upload/media/${mediaId}`, {
        method: 'DELETE',
      });
    },
  },
};

// Export base URL for direct use if needed
export { API_BASE_URL };