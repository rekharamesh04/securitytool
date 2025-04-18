"use client";

import React, { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

interface AuthGuardProps {
    children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isInitialized } = useAuth();
    const { push } = useRouter();
    const pathname = usePathname();
    const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

    useEffect(() => {
        if (requestedLocation && pathname !== requestedLocation) {
            push(requestedLocation);
        }
        if (isAuthenticated) {
            setRequestedLocation(null);
        }
    }, [isAuthenticated, pathname, push, requestedLocation]);

    useEffect(() => {
        if (!isAuthenticated && isInitialized) {
            push('/admin/auth/sign-in')
        }
    }, [isAuthenticated, pathname, push, requestedLocation, isInitialized]);

    if (!isInitialized) {
        return "Loading...";
    }

    return <>{children}</>;
}