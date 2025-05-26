"use client";

import { UserModel } from '@/models/User.model';
import { createContext } from 'react';

export interface State {
    isInitialized: boolean;
    isAuthenticated: boolean;
    user: UserModel | null;
}

export interface AuthContextProps extends State {
    method: string;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: any) => Promise<void>;
    initialize: () => Promise<void>;
}

export type AuthAction =
    | { type: 'INITIAL'; payload: { isAuthenticated: boolean; user: UserModel | null } }
    | { type: 'LOGIN'; payload: { isAuthenticated: boolean; user: UserModel } }
    | { type: 'REGISTER'; payload: { isAuthenticated: boolean; user: UserModel } } // Fixed: Now includes isAuthenticated
    | { type: 'LOGOUT' };

export const initialState: State = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
};

export const AuthContext = createContext<AuthContextProps>({
    ...initialState,
    method: 'jwt',
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
    initialize: () => Promise.resolve(),
});
