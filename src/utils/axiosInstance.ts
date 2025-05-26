import axios from "axios";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// --- IMPORTANT ERROR CHECKING ---
if (!BACKEND_API_URL) {
  console.error('Environment variable NEXT_PUBLIC_BACKEND_API_URL is not defined!');
}


const axiosInstance = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor for adding the Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    // Only access localStorage in the browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('companyToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Your existing interceptor for handling 403 (Forbidden) responses
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const { response } = error;
    if (response && response.status === 403) {
      console.warn("Received 403 Forbidden. Consider redirecting to /forbidden.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;