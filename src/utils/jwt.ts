// src/utils/jwt.ts OR src/utils/companyJwt.ts (ensure correct file is modified)
import axiosInstance from './axiosInstance'; // Make sure this path is correct relative to this file

// Function to handle setting the session token (ideally in an HttpOnly cookie)
export const setSession = (accessToken: string | null): void => {
  if (typeof window !== 'undefined') {
    // Use a single, consistent key
    localStorage.removeItem('accessToken'); // Remove existing
    localStorage.removeItem('companyAccessToken'); // Ensure old keys are cleared
    localStorage.removeItem('companyToken'); // Ensure this old key is cleared too if it was ever used

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken); // Store with the chosen key
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem('accessToken'); // Clear if no token
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  }
};

// Function to get session status (does NOT retrieve the token itself from localStorage)
export const getSession = (): string | null => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken'); // Fetch with the chosen key
    if (accessToken) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      return accessToken;
    } else {
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  }
  return null;
};

// Function to remove the session (logout)
export const removeSession = (): void => {
  if (typeof window !== 'undefined') {
    delete axiosInstance.defaults.headers.common.Authorization;
    localStorage.removeItem('accessToken'); // Remove with the chosen key
    localStorage.removeItem('companyAccessToken'); // Just in case, to be thorough
    localStorage.removeItem('companyToken'); // Just in case, to be thorough
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentCompany');
    localStorage.removeItem('dataSourceData');
  }
};