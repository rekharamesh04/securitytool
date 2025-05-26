'use client';

import { CompanyAuthProvider } from "@/contexts/CompanyAuthContext";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <CompanyAuthProvider>
            {children}
        </CompanyAuthProvider>
    );
}