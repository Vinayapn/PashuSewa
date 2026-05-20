import axios from 'axios';

const API = axios.create({ baseURL: `${import.meta.env.VITE_API_URL}/api`,});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('relieflink_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('relieflink_token');
      localStorage.removeItem('relieflink_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  verifyOTP: (data) => API.post('/auth/verify-otp', data),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  getMe: () => API.get('/auth/me'),
};

// Rescuer
export const rescuerAPI = {
  getDashboard: () => API.get('/rescuer/dashboard'),
  createAlert: (data) => API.post('/rescuer/alerts', data),
  updateAlertStatus: (id, status) => API.patch(`/rescuer/alerts/${id}/status`, { status }),
  updateAlert: (id, data) => API.put(`/rescuer/alerts/${id}`, data),
  getMapAlerts: () => API.get('/rescuer/map/alerts'),
};

// NGO
export const ngoAPI = {
  getDashboard: () => API.get('/ngo/dashboard'),
  createResource: (data) => API.post('/ngo/resources', data),
  updateResource: (id, data) => API.patch(`/ngo/resources/${id}`, data),
  broadcast: (data) => API.post('/ngo/broadcast', data),
  // Animal Adoption
  getAnimals: () => API.get('/ngo/animals'),
  createAnimal: (data) => API.post('/ngo/animals', data),
  updateAnimal: (id, data) => API.patch(`/ngo/animals/${id}`, data),
  deleteAnimal: (id) => API.delete(`/ngo/animals/${id}`),
};


// Doctor
export const doctorAPI = {
  getDashboard: () => API.get('/doctor/dashboard'),
  getPatients: () => API.get('/doctor/patients'),
  addPatient: (data) => API.post('/doctor/patients', data),
  updatePatient: (id, data) => API.patch(`/doctor/patients/${id}`, data),
};

export default API;
