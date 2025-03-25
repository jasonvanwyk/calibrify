import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Equipment {
  id: number;
  name: string;
  model_number: string;
  serial_number: string;
  manufacturer: string;
  category: string;
  location: string;
  purchase_date: string | null;
  last_calibration_date: string | null;
  next_calibration_date: string | null;
  calibration_interval_type: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  calibration_interval_value: number;
  status: string;
  status_display: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: number | null;
}

export interface Calibration {
  id: number;
  equipment: number;
  calibration_date: string;
  next_calibration_date: string;
  performed_by: string;
  certificate_number: string;
  notes: string;
}

export interface Maintenance {
  id: number;
  equipment: number;
  maintenance_type: string;
  scheduled_date: string;
  status: string;
  performed_by: string;
  notes: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const equipmentApi = {
  getAll: () => api.get<PaginatedResponse<Equipment>>('/equipment/'),
  getById: (id: number) => api.get<Equipment>(`/equipment/${id}/`),
  create: (data: Partial<Equipment>) => api.post<Equipment>('/equipment/', data),
  update: (id: number, data: Partial<Equipment>) => api.put<Equipment>(`/equipment/${id}/`, data),
  delete: (id: number) => api.delete(`/equipment/${id}/`),
};

export const calibrationApi = {
  getAll: () => api.get<Calibration[]>('/calibrations/'),
  getById: (id: number) => api.get<Calibration>(`/calibrations/${id}/`),
  create: (data: Partial<Calibration>) => api.post<Calibration>('/calibrations/', data),
  update: (id: number, data: Partial<Calibration>) => api.put<Calibration>(`/calibrations/${id}/`, data),
  delete: (id: number) => api.delete(`/calibrations/${id}/`),
};

export const maintenanceApi = {
  getAll: () => api.get<Maintenance[]>('/maintenance/'),
  getById: (id: number) => api.get<Maintenance>(`/maintenance/${id}/`),
  create: (data: Partial<Maintenance>) => api.post<Maintenance>('/maintenance/', data),
  update: (id: number, data: Partial<Maintenance>) => api.put<Maintenance>(`/maintenance/${id}/`, data),
  delete: (id: number) => api.delete(`/maintenance/${id}/`),
};

export default api; 