'use client';

import CompanyAuthGuard from "@/guards/CompanyAuthGuard";
import CompanyAdminLayout from "@/layout/company";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <CompanyAuthGuard>
            <CompanyAdminLayout>
                {children}
            </CompanyAdminLayout>
        </CompanyAuthGuard>
    );
}