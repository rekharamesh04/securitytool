"use client";

import { AuthAction, AuthContext, initialState, State } from '@/contexts/AuthContext';
import axiosInstance from '@/utils/axiosInstance';
import { getSession, setSession } from '@/utils/jwt'; // Assuming setSession handles token storage
import localStorageAvailable from '@/utils/localStorageAvailable';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { ReactNode, useCallback, useEffect, useMemo, useReducer } from 'react';
import { AxiosError } from 'axios'; // Import AxiosError

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
            const accessToken = storageAvailable ? getSession() : ''; // Get token from storage
            
            if (accessToken) {
                // IMPORTANT: Ensure axiosInstance's default header is set *before* the request
                axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

                const response = await axiosInstance.get('/admin/auth/get-profile');
                const user = response.data;

                dispatch({
                    type: 'INITIAL',
                    payload: {
                        isAuthenticated: true,
                        user,
                    },
                });
            } else {
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
            // Log expected 401/404 errors as info, others as actual errors
            if (error instanceof AxiosError && error.response && (error.response.status === 401 || error.response.status === 404)) {
                console.log('Admin AuthProvider: Initialization failed (expected unauthenticated or token expired).');
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
            // Ensure session is cleared if initialization fails unexpectedly (e.g., invalid token)
            setSession(''); // Clear any potentially stale token
            delete axiosInstance.defaults.headers.common.Authorization; // Clear header
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
            // IMPORTANT: Explicitly set the Authorization header for axiosInstance immediately
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

            dispatch({
                type: 'LOGIN',
                payload: {
                    isAuthenticated: true,
                    user,
                },
            });

            router.push('/admin'); // Redirect
        } catch (error) {
            // Log expected 401/404 errors as info, others as actual errors for login attempts
            if (error instanceof AxiosError && error.response && (error.response.status === 401 || error.response.status === 404)) {
                console.log('Admin AuthProvider: Login failed with invalid credentials (expected 401/404).');
            } else {
                console.error('Admin AuthProvider: Login error:', error);
            }
            setSession(''); // Clear token on login failure
            delete axiosInstance.defaults.headers.common.Authorization; // Clear header
            throw error; // Re-throw to be caught by the SignIn component for its toast
        }
    }, [router]);

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
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`; // Explicitly set header

            dispatch({
                type: 'REGISTER',
                payload: {
                    isAuthenticated: true, // Fixed: Now correctly passed in payload
                    user,
                },
            });

            router.push('/admin');
        } catch (error) {
            console.error('Admin AuthProvider: Registration error:', error);
            setSession('');
            delete axiosInstance.defaults.headers.common.Authorization;
            throw error;
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await axiosInstance.delete('/admin/auth/sign-out');
        } catch (error) {
            console.error('Admin AuthProvider: Backend logout call failed, but clearing client-side session:', error);
        } finally {
            setSession(''); // Clear token
            delete axiosInstance.defaults.headers.common.Authorization; // Clear header
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
