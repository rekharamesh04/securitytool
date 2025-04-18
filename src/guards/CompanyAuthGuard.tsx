"use client";

import React, { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useCompanyAuth from '@/hooks/useCompanyAuth';

interface CompanyAuthGuardProps {
    children: ReactNode;
}

export default function CompanyAuthGuard({ children }: CompanyAuthGuardProps) {
    const { isAuthenticated, isInitialized } = useCompanyAuth();
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
            push('/company/auth/sign-in')
        }
    }, [isAuthenticated, pathname, push, requestedLocation, isInitialized]);

    if (!isInitialized) {
        return "Loading...";
    }

    return <>{children}</>;
}