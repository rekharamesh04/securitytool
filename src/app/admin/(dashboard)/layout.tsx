"use client";

import AuthGuard from "@/guards/AuthGuard";
import AdminLayout from "@/layout/admin";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <AuthGuard>
        <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  );
}
