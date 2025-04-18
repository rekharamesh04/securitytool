'use client';

import { CompanyAuthProvider } from "@/providers/CompanyAuthProvider";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <CompanyAuthProvider>
            {children}
        </CompanyAuthProvider>
    );
}