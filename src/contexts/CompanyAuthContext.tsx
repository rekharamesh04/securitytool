// src/contexts/CompanyAuthContext.tsx
"use client";

import { createContext, useContext, ReactNode, useCallback, useReducer, useEffect, useMemo } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { setSession, removeSession } from '@/utils/jwt';
import localStorageAvailable from '@/utils/localStorageAvailable';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios'; // Import AxiosError for type checking

// 1. Define the company data structure as received from API
interface CompanyData {
  _id: string;
  name: string;
}

interface AuthUser {
  _id: string;
  email: string;
  name: string;
  company?: CompanyData;
  role?: { _id: string; name: string };
}

// Define the type for login data - matches your FormData in SignIn component
interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Define AuthAction types for useReducer
export type AuthAction =
  | { type: 'INITIAL'; payload: { isAuthenticated: boolean; user: AuthUser | null; isInitialized: boolean } }
  | { type: 'LOGIN'; payload: { isAuthenticated: boolean; user: AuthUser; isInitialized: boolean } }
  | { type: 'REGISTER'; payload: { isAuthenticated: boolean; user: AuthUser; isInitialized: boolean } }
  | { type: 'LOGOUT' };

// 3. Define the auth state
export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
}

// 4. Define the complete context type
interface AuthContextType extends AuthState {
  method: string;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  initialize: () => Promise<void>;
}

// 5. Create initial state
export const initialState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null
};

// Reducer for state management
const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INITIAL':
    case 'LOGIN':
    case 'REGISTER':
      return {
        ...state,
        isInitialized: action.payload.isInitialized,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

// Local storage keys for non-sensitive user/company data
const LOCAL_STORAGE_USER_KEY = 'currentUser';
const LOCAL_STORAGE_COMPANY_KEY = 'currentCompany';
const LOCAL_STORAGE_DATASOURCE_KEY = 'dataSourceData';

// 6. Create context with default values
export const CompanyAuthContext = createContext<AuthContextType>({
  ...initialState,
  method: 'jwt',
  login: async () => { },
  logout: async () => { },
  register: async () => { },
  initialize: async () => { }
});

// 7. Create the provider component
export function CompanyAuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const storageAvailable = localStorageAvailable();
  const router = useRouter();

  const initialize = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/company/auth/get-profile');
      const userDataFromApi = response.data;

      const user: AuthUser = {
        _id: userDataFromApi._id,
        email: userDataFromApi.email,
        name: userDataFromApi.name,
        company: userDataFromApi.company ? {
          _id: userDataFromApi.company._id,
          name: userDataFromApi.company.name,
        } : undefined,
        role: userDataFromApi.role ? {
          _id: userDataFromApi.role._id,
          name: userDataFromApi.role.name,
        } : undefined,
      };

      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: true,
          user,
          isInitialized: true,
        },
      });

      // Store non-sensitive user and company data in local storage
      if (storageAvailable) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({
          username: user.name,
          email: user.email,
        }));
        if (user.company) {
          localStorage.setItem(LOCAL_STORAGE_COMPANY_KEY, JSON.stringify({
            _id: user.company._id,
            name: user.company.name,
          }));
        }
      }
    } catch (error) {
      // Check if the error is an AxiosError and if it's a 401 (Unauthorized)
      if (error instanceof AxiosError && error.response && error.response.status === 401) {
        // This is an expected error when the user is not authenticated.
        // Log at info/debug level, not error, to prevent unnecessary console errors.
        console.log('User not authenticated (expected 401 on initialization).');
      } else {
        // For other unexpected errors during initialization, log them as errors.
        console.error('Initialization error:', error);
      }

      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
          isInitialized: true,
        },
      });
      // Clear non-sensitive local storage data if initialization fails
      if (storageAvailable) {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        localStorage.removeItem(LOCAL_STORAGE_COMPANY_KEY);
        localStorage.removeItem(LOCAL_STORAGE_DATASOURCE_KEY);
      }
      removeSession(); // Call the function from utils/jwt.ts to ensure token/cookie cleanup
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Login function
  const login = useCallback(async (data: LoginData) => {
    try {
      const { email, password } = data;
      const response = await axiosInstance.post('/company/auth/sign-in', {
        email,
        password,
      });
      const userDataFromApi = response.data.user;

      const user: AuthUser = {
        _id: userDataFromApi._id,
        email: userDataFromApi.email,
        name: userDataFromApi.name,
        company: userDataFromApi.company ? {
          _id: userDataFromApi.company._id,
          name: userDataFromApi.company.name,
        } : undefined,
        role: userDataFromApi.role ? {
          _id: userDataFromApi.role._id,
          name: userDataFromApi.role.name,
        } : undefined,
      };

      setSession(response.data.token);

      if (storageAvailable) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({
          username: user.name,
          email: user.email,
        }));
        if (user.company) {
          localStorage.setItem(LOCAL_STORAGE_COMPANY_KEY, JSON.stringify({
            _id: user.company._id,
            name: user.company.name,
          }));
        }
      }

      dispatch({
        type: 'LOGIN',
        payload: {
          isAuthenticated: true,
          user,
          isInitialized: true,
        },
      });

      router.push('/company');
    } catch (error) {
      // Check if the error is an AxiosError and if it's a 401 (Unauthorized) or 404 (Not Found)
      // These are expected for invalid credentials, so log them as info/debug, not error.
      if (error instanceof AxiosError && error.response && (error.response.status === 401 || error.response.status === 404)) {
        console.log('Login attempt failed with invalid credentials (expected 401/404):', error.response.status);
      } else {
        // For other unexpected errors during login, log them as errors.
        console.error('Login error:', error);
      }

      if (storageAvailable) {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        localStorage.removeItem(LOCAL_STORAGE_COMPANY_KEY);
        localStorage.removeItem(LOCAL_STORAGE_DATASOURCE_KEY);
      }
      removeSession();
      throw error; // Re-throw the error so SignIn component can catch it for toast
    }
  }, [router, storageAvailable]);

  // Register function (assuming similar logic to login for setting session and user data)
  const register = useCallback(async (data: any) => {
    const { name, email, password, password_confirmation } = data;

    try {
      const response = await axiosInstance.post('/company/auth/sign-up', {
        name,
        email,
        password,
        password_confirmation,
      });
      const { accessToken, user: userDataFromApi } = response.data;

      const user: AuthUser = {
        _id: userDataFromApi._id,
        email: userDataFromApi.email,
        name: userDataFromApi.name,
        company: userDataFromApi.company ? {
          _id: userDataFromApi.company._id,
          name: userDataFromApi.company.name,
        } : undefined,
        role: userDataFromApi.role ? {
          _id: userDataFromApi.role._id,
          name: userDataFromApi.role.name,
        } : undefined,
      };

      setSession(accessToken);

      if (storageAvailable) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({
          username: user.name,
          email: user.email,
        }));
        if (user.company) {
          localStorage.setItem(LOCAL_STORAGE_COMPANY_KEY, JSON.stringify({
            _id: user.company._id,
            name: user.company.name,
          }));
        }
      }

      dispatch({
        type: 'REGISTER',
        payload: {
          isAuthenticated: true,
          user,
          isInitialized: true,
        },
      });

      router.push('/company');
    } catch (error) {
      console.error('Registration error:', error);
      if (storageAvailable) {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        localStorage.removeItem(LOCAL_STORAGE_COMPANY_KEY);
        localStorage.removeItem(LOCAL_STORAGE_DATASOURCE_KEY);
      }
      removeSession();
      throw error;
    }
  }, [router, storageAvailable]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axiosInstance.delete('/company/auth/sign-out');
    } catch (error) {
      console.error('Backend logout call failed, but clearing client-side session:', error);
    } finally {
      removeSession();
      if (storageAvailable) {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        localStorage.removeItem(LOCAL_STORAGE_COMPANY_KEY);
        localStorage.removeItem(LOCAL_STORAGE_DATASOURCE_KEY);
      }
      dispatch({ type: 'LOGOUT' });
      router.push('/company/auth/sign-in');
    }
  }, [router, storageAvailable]);

  const contextValue: AuthContextType = useMemo(
    () => ({
      ...state,
      method: 'jwt',
      login,
      logout,
      register,
      initialize,
    }),
    [state, login, logout, register, initialize]
  );

  return (
    <CompanyAuthContext.Provider value={contextValue}>
      {children}
    </CompanyAuthContext.Provider>
  );
}

// Custom hook to use the CompanyAuthContext
export function useCompanyAuth(): AuthContextType {
  const context = useContext(CompanyAuthContext);
  if (!context) {
    throw new Error('useCompanyAuth must be used within a CompanyAuthProvider');
  }
  return context;
}
