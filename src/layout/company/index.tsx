'use client';

import useCompanyAuth from '@/hooks/useCompanyAuth';
import theme from '@/theme/theme';
import { PageContainer } from '@toolpad/core';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import adminNavigation from './navigation';
import { NextAppProvider } from '@toolpad/core/nextjs';

interface LayoutProps {
    window?: () => Window;
    children: React.ReactNode;
}

export default function CompanyAdminLayout(props: LayoutProps) {
    const { window, children } = props;
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useCompanyAuth();
    // Remove this const when copying and pasting into your project.
    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <NextAppProvider
            navigation={adminNavigation}
            branding={{
                logo: <img src="/logo.png" alt="Monitoring App" />,
                title: '',
                homeUrl: '/admin',
            }}
            router={{
                navigate: (segment: any) => {
                    router.push(segment);
                },
                pathname: pathname,
                searchParams: new URLSearchParams(),
            }}
            theme={theme}
            window={demoWindow}
            session={{
                user: user || undefined,
            }}
            authentication={{
                signIn: () => {
                    console.log('Sign in');
                },
                signOut: () => {
                    logout();
                }
            }}
        >
            <DashboardLayout>
                <PageContainer>
                    {children}
                </PageContainer>
            </DashboardLayout>
        </NextAppProvider>
    );
}
