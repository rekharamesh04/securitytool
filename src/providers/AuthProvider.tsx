"use client";

import { AuthAction, AuthContext, initialState, State } from '@/contexts/AuthContext';
import axiosInstance from '@/utils/axiosInstance';
import { setSession, removeSession, getSession } from '@/utils/jwt'; // Assuming setSession handles token storage
import localStorageAvailable from '@/utils/localStorageAvailable';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { ReactNode, useCallback, useEffect, useMemo, useReducer } from 'react';
import { AxiosError } from 'axios'; // Import AxiosError

// const setAuthorizationHeader = (token: string | null) => {
//     if (token) {
//         axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
//     } else {
//         delete axiosInstance.defaults.headers.common.Authorization;
//     }
// };

const reducer = (state: State, action: AuthAction): State => {
    switch (action.type) {
        case 'INITIAL':
        case 'LOGIN':
        case 'REGISTER':
            return {
                ...state,
                isInitialized: true, // Always true after initial check or login/register
                isAuthenticated: action.payload.isAuthenticated, // Use payload's isAuthenticated
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

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const storageAvailable = localStorageAvailable();
    const router = useRouter();

    const initialize = useCallback(async () => {
        try {
             const accessToken = storageAvailable ? getSession() : '';
      console.log('AuthProvider: Initializing...');
        console.log('AuthProvider: Found accessToken (or companyAccessToken):', accessToken ? 'YES (length: ' + accessToken.length + ')' : 'NO')
            
            if (accessToken) {
                // IMPORTANT: Ensure axiosInstance's default header is set *before* the request
                // axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                // setAuthorizationHeader(accessToken);
                console.log('AuthProvider: Attempting to fetch /admin/auth/get-profile with token.');
                const response = await axiosInstance.get('/admin/auth/get-profile');
                const user = response.data;
                console.log('AuthProvider: /admin/auth/get-profile successful. User data:', user);
                dispatch({
                    type: 'INITIAL',
                    payload: {
                        isAuthenticated: true,
                        user,
                    },
                });
            } else {
                // setAuthorizationHeader(null);
                console.log('AuthProvider: No access token found. Setting unauthenticated state.');
                // If no access token, ensure isAuthenticated is false
                dispatch({
                    type: 'INITIAL',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        } catch (error) {
            console.error('AuthProvider: Initialization failed:', error); // Log the full error
            // Log expected 401/404 errors as info, others as actual errors
            if (error instanceof AxiosError && error.response) {
                console.error('AxiosError response status:', error.response.status);
                console.error('AxiosError response data:', error.response.data);
                if (error.response.status === 401 || error.response.status === 404) {
                    console.log('Admin AuthProvider: Initialization failed (expected unauthenticated or token expired).');
                }
            } else {
                console.error('Admin AuthProvider: Initialization error:', error);
            }
            dispatch({
                type: 'INITIAL',
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
            removeSession();
            // setAuthorizationHeader(null); // Clear header on initialization failure
        }
    }, [storageAvailable]); // Dependency only on storageAvailable

    useEffect(() => {
        initialize();
    }, [initialize]); // Depend only on initialize to prevent unnecessary re-runs

    const login = useCallback(async (data: any) => {
        const { email, password } = data;
        try {
            const response = await axiosInstance.post('/admin/auth/sign-in', {
                email,
                password,
            });
            const { accessToken, user } = response.data;

            setSession(accessToken); // Store the token (e.g., in localStorage/cookie)
            // IMPORTANT: Immediately set the Authorization header for axiosInstance
            // setAuthorizationHeader(accessToken);
            // IMPORTANT: Explicitly set the Authorization header for axiosInstance immediately
            // axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

            dispatch({
                type: 'LOGIN',
                payload: {
                    isAuthenticated: true,
                    user,
                },
            });

             // After login, re-initialize to fetch the user profile with the new token
            await initialize(); // <--- Call initialize after successful login

            router.push('/admin'); // Navigate after state is potentially updated by initialize
        } catch (error) {
        console.error('Admin AuthProvider: Login error:', error);
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 401 || error.response.status === 404) {
                    console.log('Admin AuthProvider: Login failed with invalid credentials (expected 401/404).');
                }
            }
            removeSession(); // Clear token on login failure
            // setAuthorizationHeader(null); // Clear header on login failure
            throw error;
        }
    }, [router, initialize]);

    const register = useCallback(async (data: any) => {
        const { name, email, password, password_confirmation } = data;

        try {
            const response = await axiosInstance.post('/admin/auth/sign-up', {
                name,
                email,
                password,
                password_confirmation,
            });

            const { accessToken, user } = response.data;

            setSession(accessToken);
            // axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`; // Explicitly set header
            // setAuthorizationHeader(accessToken);
            dispatch({
                type: 'REGISTER',
                payload: {
                    isAuthenticated: true, // Fixed: Now correctly passed in payload
                    user,
                },
            });

// After registration, re-initialize to fetch the user profile with the new token
            await initialize(); // <--- Call initialize after successful registration

            router.push('/admin'); // Navigate after state is potentially updated by initialize
        } catch (error) {
              console.error('Admin AuthProvider: Registration error:', error);
            removeSession();
            // setAuthorizationHeader(null);
            throw error;
        }
    }, [router, initialize]);

    const logout = useCallback(async () => {
        try {
            await axiosInstance.delete('/admin/auth/sign-out');
        } catch (error) {
            console.error('Admin AuthProvider: Backend logout call failed, but clearing client-side session:', error);
        } finally {
             removeSession(); // Clear all client-side 
            //  setAuthorizationHeader(null);
            dispatch({ type: 'LOGOUT' });
            router.push('/admin/auth/sign-in');
        }
    }, [router]);

    const memoizedValue = useMemo(
        () => ({
            ...state,
            method: 'jwt',
            login,
            register,
            logout,
            initialize
        }),
        [state, login, register, logout, initialize]
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node,
};
