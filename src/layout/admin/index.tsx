"use client";

import useAuth from "@/hooks/useAuth";
import theme from "@/theme/theme";
import { PageContainer } from "@toolpad/core";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import adminNavigation from "./navigation";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { CompanyProvider, useCompanyContext } from "@/contexts/CompanyContext";

interface LayoutProps {
  window?: () => Window;
  children: React.ReactNode;
}

// 👇 Component that accesses the company context AFTER provider is applied
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedCompany } = useCompanyContext();

  return (
    <PageContainer
      title={
        pathname === "/admin/company/data-source" && selectedCompany
          ? `Data Source · ${selectedCompany.name}`
          : undefined
      }
      sx={{
        color: "rgb(30, 14, 145)",
        "& .MuiTypography-h4": {
          color: "rgb(30, 14, 145)",
          fontSize: "2rem",
          marginBottom: "1rem",
          fontFamily: "'Inter', sans-serif",
        },
        "& .MuiTypography-body1": {
          color: "rgb(30, 14, 145)",
          fontSize: "1rem",
          fontWeight: "600",
          lineHeight: 1.6,
        },
      }}
    >
      {children}
    </PageContainer>
  );
}

export default function AdminLayout(props: LayoutProps) {
  const { window, children } = props;
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const demoWindow = window !== undefined ? window() : undefined;
  const normalizedPathname = pathname.replace(/\/+$/, "");

  const handleNavigation = (url: string | URL) => {
    if (typeof url === "string") {
      router.push(url);
    } else {
      router.push(url.toString());
    }
  };

  return (
    <NextAppProvider
      navigation={adminNavigation}
      branding={{
        logo: <img src="/logo.png" alt="Monitoring App" />,
        title: "",
        homeUrl: "/admin",
      }}
      router={{
        navigate: handleNavigation,
        pathname: normalizedPathname,
        searchParams: new URLSearchParams(),
      }}
      theme={theme}
      window={demoWindow}
      session={{
        user: user || undefined,
      }}
      authentication={{
        signIn: () => {
          console.log("Sign in");
        },
        signOut: () => {
          logout();
        },
      }}
    >
      <CompanyProvider>
        <DashboardLayout
          sx={{
            "& .MuiAppBar-root": {
              backgroundColor: "#f7f7f7",
              color: "white",
              boxShadow: "none",
              backgroundImage: "none",
            },
            "& .MuiDrawer-root": {
              "& .MuiPaper-root": {
                backgroundColor: "#f7f7f7",
                boxSizing: "border-box",
                transition: "width 0.3s ease, transform 0.3s ease",
              },
            },
            "& .Mui-selected": {
              "& *": {
                color: "white !important",
              },
            },
            "& .MuiListSubheader-root": {
              fontFamily:
                "'Inter', 'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              color: "rgb(17, 4, 122)",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.75px",
              marginTop: "10px",
              pl: "10px",
              lineHeight: 1.5,
              backgroundColor: "transparent",
            },
            "& .MuiListItemButton-root": {
              borderRadius: "8px",
              marginBottom: "2px",
              paddingLeft: "10px",
              whiteSpace: "nowrap",
              "&.Mui-selected": {
                backgroundColor: "#5D87FF !important",
                color: "inherit !important",
                "& .MuiListItemIcon-root": {
                  color: "inherit !important",
                },
                "&:hover": {
                  backgroundColor: "#5D87FF",
                },
              },
              "&:hover": {
                backgroundColor: "#ECF2FF",
                color: "#5D87FF",
                "& .MuiListItemIcon-root": {
                  color: "inherit",
                },
              },
            },
            "& .MuiListItemIcon-root": {
              minWidth: "36px",
              color: "inherit",
            },
            "& .MuiCollapse-root .MuiListItemButton-root": {
              paddingLeft: "30px",
            },
          }}
        >
          <LayoutContent>{children}</LayoutContent>
        </DashboardLayout>
      </CompanyProvider>
    </NextAppProvider>
  );
}
