import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.hasShown401Toast) {
        window.hasShown401Toast = true;
        // Optionally import toast if needed, but since we are redirecting we can just alert or rely on UI
        // Actually, importing toast at top level might cause circular deps or issues outside React tree.
        // We'll just redirect immediately, or use native alert to be completely safe from context issues.
        alert('Session expired. Please login again.');
        localStorage.removeItem('sc_user');
        window.location.href = '/login';
      }
    }

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
