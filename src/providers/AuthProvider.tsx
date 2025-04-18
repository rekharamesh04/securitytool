"use client";

import { AuthAction, AuthContext, initialState, State } from '@/contexts/AuthContext';
import axiosInstance from '@/utils/axiosInstance';
import { getSession, setSession } from '@/utils/jwt';
import localStorageAvailable from '@/utils/localStorageAvailable';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { ReactNode, useCallback, useEffect, useMemo, useReducer } from 'react';

const reducer = (state: State, action: AuthAction): State => {
    switch (action.type) {
        case 'INITIAL':
        case 'LOGIN':
        case 'REGISTER':
            return {
                ...state,
                isInitialized: true,
                ...action.payload,
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
    const router = useRouter()

    const initialize = useCallback(async () => {
        try {
            const accessToken = storageAvailable ? getSession() : '';
            if (accessToken) {
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
                dispatch({
                    type: 'INITIAL',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        } catch (error) {
            console.error(error);
            dispatch({
                type: 'INITIAL',
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
        }
    }, [storageAvailable,]);

    useEffect(() => {
        initialize();
    }, [state.isAuthenticated,initialize]);

    const login = useCallback(async (data: any) => {
        const { email, password } = data
        const response = await axiosInstance.post('/admin/auth/sign-in', {
            email,
            password,
        });
        const { accessToken, user } = response.data;

        setSession(accessToken);

        dispatch({
            type: 'LOGIN',
            payload: {
                isAuthenticated: true,
                user,
            },
        });

        router.push('/admin')
    }, [router]);

    const register = useCallback(async (data: any) => {
        const { name, email, password, password_confirmation } = data

        const response = await axiosInstance.post('/admin/auth/sign-up', {
            name,
            email,
            password,
            password_confirmation,
        });

        const { accessToken, user } = response.data;

        setSession(accessToken);

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
                isInitialized: false
            },
        });

        router.push('/admin')
    }, [router]);

    const logout = useCallback(async () => {
        await axiosInstance.delete('/admin/auth/sign-out').then((response: any) => {
            if (response.status === 200) {
                setSession('');
                dispatch({ type: 'LOGOUT' });
                initialize()
                router.push('/admin/auth/sign-in')
            }
        }).catch((error: any) => {
            console.log('SIGNOUT ERROR', error);
            setSession('');
            dispatch({ type: 'LOGOUT' });
        });
    }, [initialize,router]);

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