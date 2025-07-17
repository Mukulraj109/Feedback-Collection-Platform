const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthToken = () => localStorage.getItem('authToken');

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new ApiError(response.status, errorData.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, 'Network error occurred');
    }
  },

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(name: string, email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Form endpoints
  async createForm(formData: Partial<Form>) {
    return this.request('/forms', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  async getForms() {
    return this.request('/forms');
  },

  async getForm(id: string) {
    return this.request(`/forms/${id}`);
  },

  async getPublicForm(id: string) {
    return this.request(`/forms/public/${id}`);
  },

  async updateForm(id: string, formData: Partial<Form>) {
    return this.request(`/forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  },

  async deleteForm(id: string) {
    return this.request(`/forms/${id}`, {
      method: 'DELETE',
    });
  },

  // Response endpoints
  async submitResponse(formId: string, responses: Record<string, string>) {
    return this.request('/responses', {
      method: 'POST',
      body: JSON.stringify({ formId, responses }),
    });
  },

  async getFormResponses(formId: string) {
    return this.request(`/responses/form/${formId}`);
  },

  async exportResponses(formId: string) {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/responses/export/${formId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    return response.blob();
  },
};