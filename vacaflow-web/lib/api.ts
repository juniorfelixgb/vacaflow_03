import { AbsenceType, Request, User, UpdateRequestData, ApprovalData } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiError {
  code: string;
  message: string;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      code: 'UNKNOWN_ERROR',
      message: `HTTP ${response.status}`,
    }));
    throw new Error(`[${error.code}] ${error.message}`);
  }

  return response.json();
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiCall<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// User API
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    return apiCall<User>('/users/me');
  },
};

// Absence Types API
export const absenceTypeApi = {
  getAll: async (): Promise<AbsenceType[]> => {
    return apiCall<AbsenceType[]>('/absence-types');
  },
};

// Requests API
export const requestApi = {
  getAll: async (): Promise<Request[]> => {
    return apiCall<Request[]>('/requests');
  },

  getById: async (id: string): Promise<Request> => {
    return apiCall<Request>(`/requests/${id}`);
  },

  create: async (data: {
    absenceTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<Request> => {
    return apiCall<Request>('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateRequestData): Promise<Request> => {
    return apiCall<Request>(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  submit: async (id: string): Promise<Request> => {
    return apiCall<Request>(`/requests/${id}/submit`, {
      method: 'POST',
    });
  },

  cancel: async (id: string): Promise<Request> => {
    return apiCall<Request>(`/requests/${id}/cancel`, {
      method: 'POST',
    });
  },

  getSubmittedAll: async (): Promise<Request[]> => {
    return apiCall<Request[]>('/requests/submitted/all');
  },

  approve: async (id: string, data: ApprovalData): Promise<Request> => {
    return apiCall<Request>(`/requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  reject: async (id: string, data: ApprovalData): Promise<Request> => {
    return apiCall<Request>(`/requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
