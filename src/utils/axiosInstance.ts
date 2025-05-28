import axios from "axios";
import { getSession, removeSession } from "./jwt";

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
  withCredentials: true,
});

// Interceptor for adding the Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getSession();
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
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
    if (response) {
      // Handle 401/403 globally or in a more specific way
      if (response.status === 401 || response.status === 403) {
        console.warn(`Authentication/Authorization issue: Status ${response.status}.`);
        // Centralized logout logic if needed, but often handled in AuthProvider's catch block
        // to avoid redirect loops or conflicts with specific component error handling.
        // For example, if a 401 happens on get-profile, AuthProvider catches it and logs out.
        removeSession(); // Clear session if token is invalid/expired
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;