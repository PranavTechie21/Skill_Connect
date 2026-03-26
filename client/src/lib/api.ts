// API configuration
// In development, use relative paths to let Vite's dev-server proxy handle requests
// API_BASE_URL: only use when explicitly provided via VITE_API_URL
// In production, API_BASE_URL should be set to the actual API server URL
export const API_BASE_URL = import.meta.env.DEV ? "" : (import.meta.env.VITE_API_URL ?? "");

export const apiFetch = async (url: string, options?: RequestInit) => {
	// Build URL: if absolute already provided, use it. Otherwise prefer relative path
	// so the dev server proxy handles it. If API_BASE_URL is explicitly set, use that.
	const fullUrl = url.startsWith("http")
		? url
		: API_BASE_URL
		? `${API_BASE_URL}${url}`
		: url; // relative

	// Use session-based authentication (cookies) instead of Bearer token
	let headers: Record<string, string> = {};

	try {
		const response = await fetch(fullUrl, {
			...options,
			// Merge caller-provided headers with our defaults (currently none).
			headers: { ...(options && (options as any).headers), ...headers },
			credentials: options?.credentials ?? "include", // Allow overriding default 'include'
		});
		
		// Check if response is ok (status in the range 200-299)
		if (!response.ok) {
			console.warn(`API request failed: ${fullUrl}`, response.status, response.statusText);
			// Still return the response so the caller can handle it
		}
		
		return response;
	} catch (error: any) {
		// Ignore AbortError logs to avoid noise from React StrictMode double-effects
		if (error?.name === "AbortError") {
			throw error;
		}
		console.error(`API fetch error for ${fullUrl}:`, error);
		// Re-throw the error for the caller to handle
		throw error;
	}
};

// Types
export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  applications: number;
  newApplications: number;
  status: 'active' | 'paused' | 'closed';
  views: number;
  conversion: number;
}

export interface Story {
  id?: string;
  title: string;
  content: string;
  tags?: string[];
  status: 'pending' | 'approved' | 'rejected';
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

// API endpoints
export const api = {
  // Base HTTP methods
  async get(url: string, params?: Record<string, any>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    const response = await apiFetch(`/api${url}${queryString}`);
    return response.json();
  },

  async post(url: string, data?: any) {
    const response = await apiFetch(`/api${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async put(url: string, data?: any) {
    const response = await apiFetch(`/api${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async delete(url: string) {
    const response = await apiFetch(`/api${url}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  async patch(url: string, data?: any) {
    const response = await apiFetch(`/api${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Stories API
  stories: {
    async getAll() {
      return api.get('/stories');
    },

    async getPending() {
      return api.get('/stories', { status: 'pending' });
    },

    async getApproved() {
      return api.get('/stories', { status: 'approved' });
    },

    async submit(data: { title: string; content: string; tags?: string[] }) {
      return api.post('/stories', {
        ...data,
        status: 'pending'
      });
    },

    async update(id: string, storyData: Partial<Story>) {
      return api.put(`/stories/${id}`, storyData);
    },

    async delete(id: string) {
      return api.delete(`/stories/${id}`);
    },

    async updateStatus(id: string | number, status: Story['status']) {
      return api.patch(`/stories/${id}/status`, { status });
    }
  },

  // Jobs API
  jobs: {
    async getAll(filters = {}) {
      return api.get('/jobs', filters);
    },

    async getOne(id: string) {
      return api.get(`/jobs/${id}`);
    },

    async create(jobData: Partial<Job>) {
      return api.post('/jobs', jobData);
    },

    async update(id: string, jobData: Partial<Job>) {
      return api.put(`/jobs/${id}`, jobData);
    },

    async delete(id: string) {
      return api.delete(`/jobs/${id}`);
    },

    async updateStatus(id: string, status: Job['status']) {
      return api.patch(`/jobs/${id}/status`, { status });
    },

    async getApplications(id: string) {
      return api.get(`/jobs/${id}/applications`);
    },

    async export(filters = {}) {
      return api.get('/jobs/export', filters);
    },
    async getRecommended() {
      return api.get('/jobs?page=1&itemsPerPage=4'); // Use basic jobs list as fallback
    }
  }
};