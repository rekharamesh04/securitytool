"use client";

import DashboardLayout from "@/components/DashboardLayout";
import CompanyAuthGuard from "@/guards/CompanyAuthGuard";
import CompanyAdminLayout from "@/layout/company";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <CompanyAuthGuard>
      <DashboardLayout>
        <CompanyAdminLayout>
            {children}
        </CompanyAdminLayout>
      </DashboardLayout>
    </CompanyAuthGuard>
  );
}
