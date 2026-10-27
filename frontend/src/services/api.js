import axios from 'axios';

// In local development, Vite proxy forwards /api to http://localhost:8009
// In production (Vercel), VITE_API_BASE_URL points to the Render backend URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to extract data cleanly and format error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected server error occurred';
    return Promise.reject(new Error(errorMsg));
  }
);

// Batch API Services
export const getBatches = () => api.get('/batches');
export const getBatchById = (id) => api.get(`/batches/${id}`);
export const createBatch = (batchData) => api.post('/batches', batchData);
export const updateBatch = (id, batchData) => api.put(`/batches/${id}`, batchData);
export const deleteBatch = (id) => api.delete(`/batches/${id}`);
export const getStudentsByBatch = (batchId) => api.get(`/batches/${batchId}/students`);
export const getDashboardStats = () => api.get('/batches/dashboard-stats');

// Student API Services
export const getAllStudents = () => api.get('/students');
export const getStudentById = (id) => api.get(`/students/${id}`);
export const registerStudent = (studentData) => api.post('/students', studentData);
export const updateStudent = (id, studentData) => api.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const searchStudentsByRollNumber = (rollNumber) =>
  api.get(`/students/search`, { params: { rollNumber } });

export default api;
