'use client';

import { AuthProvider } from "@/providers/AuthProvider";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}