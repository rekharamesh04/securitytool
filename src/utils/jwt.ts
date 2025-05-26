// src/utils/jwt.ts OR src/utils/companyJwt.ts (ensure correct file is modified)
import axiosInstance from './axiosInstance'; // Make sure this path is correct relative to this file

// Function to handle setting the session token (ideally in an HttpOnly cookie)
export const setSession = (accessToken: string | null): void => {
  if (typeof window !== 'undefined') { // Ensure this runs only on client-side
    // Force cleanup of any old localStorage tokens, including 'accessToken' and 'companyAccessToken'
    localStorage.removeItem('accessToken');
    localStorage.removeItem('companyAccessToken'); // <--- ADD/CONFIRM THIS LINE

    if (accessToken) {
      // Set the Authorization header for Axios for the current session.
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // If your backend *still* sends a non-HttpOnly token and you need to store it here
      // for some reason (less secure, only for explicit non-HttpOnly backend):
      // localStorage.setItem('accessToken', accessToken); // DANGER: LESS SECURE
      // localStorage.setItem('companyAccessToken', accessToken); // DANGER: LESS SECURE (if this was the original key)

    } else {
      // Clear the Authorization header if no access token is present (e.g., on logout)
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }
};

// Function to get session status (does NOT retrieve the token itself from localStorage)
export const getSession = (): string | null => {
  if (typeof window !== 'undefined') {
    // This is purely for a "fallback" or if the token is briefly handled client-side.
    // Ideally, for HttpOnly cookies, this function wouldn't be used to fetch the token directly.
    const accessTokenFromLocalStorageIfAny = localStorage.getItem('accessToken');
    const companyAccessTokenFromLocalStorageIfAny = localStorage.getItem('companyAccessToken'); // <--- ADD THIS LINE

    const tokenToUse = accessTokenFromLocalStorageIfAny || companyAccessTokenFromLocalStorageIfAny; // Prioritize one or the other

    if (tokenToUse) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokenToUse}`;
      return tokenToUse;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }
  return null;
};

// Function to remove the session (logout)
export const removeSession = (): void => {
  if (typeof window !== 'undefined') {
    // Clear the Authorization header from Axios
    delete axiosInstance.defaults.headers.common['Authorization'];

    // Explicitly remove all known token keys from localStorage during logout
    localStorage.removeItem('accessToken');
    localStorage.removeItem('companyAccessToken'); // <--- ADD/CONFIRM THIS LINE

    // In a real application, you would also trigger a backend endpoint to invalidate
    // the session and clear the HttpOnly cookie from the server side.
  }
};