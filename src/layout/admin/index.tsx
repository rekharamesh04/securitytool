"use client";

import useAuth from "@/hooks/useAuth";
// import theme from "@/theme/theme";
import { PageContainer } from "@toolpad/core";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import adminNavigation from "./navigation";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { CompanyProvider } from '@/contexts/CompanyContext';
import theme from "@/theme/theme";
interface LayoutProps {
  window?: () => Window;
  children: React.ReactNode;
}

export default function AdminLayout(props: LayoutProps) {
  const { window, children } = props;
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  // Create a normalized pathname by removing trailing slashes
  const normalizedPathname = pathname.replace(/\/+$/, "");

  // Create a navigation handler that matches the expected type
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
        // sx={{
        //   // Header background color based on the theme palette
        //   "& .MuiAppBar-root": {
        //     backgroundColor: isDarkMode ? "#1A1C4C" : "#f7f7f7",
        //     color: isDarkMode ? "#ffffff" : "white",
        //     boxShadow: "none",
        //     backgroundImage: "none",
        //   },
        //   // Drawer background color based on theme mode
        //   "& .MuiDrawer-root": {
        //     "& .MuiPaper-root": {
        //       backgroundColor: isDarkMode ? "#121212" : "#f7f7f7",
        //       boxSizing: "border-box",
        //       transition: "width 0.3s ease, transform 0.3s ease",
        //     },
        //   },
        //   "& .Mui-selected": {
        //     "& *": {
        //       color: isDarkMode ? "#ed1a26" : "white",
        //     },
        //   },
        //   "& .MuiListSubheader-root": {
        //     fontFamily:
        //       "'Inter', 'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        //     color: isDarkMode ? "#ffffff" : "rgb(17, 4, 122)",
        //     fontSize: "12px",
        //     fontWeight: 700,
        //     textTransform: "uppercase",
        //     letterSpacing: "0.75px",
        //     marginTop: "10px",
        //     pl: "10px",
        //     lineHeight: 1.5,
        //     backgroundColor: "transparent",
        //   },
        //   // Additional styles for selected items and hover states
        //   "& .MuiListItemButton-root": {
        //     borderRadius: "8px",
        //     marginBottom: "2px",
        //     paddingLeft: "10px",
        //     whiteSpace: "nowrap",
        //     "&.Mui-selected": {
        //       backgroundColor: isDarkMode ? "#282B73" : "#5D87FF",
        //       color: "inherit !important",
        //       "& .MuiListItemIcon-root": {
        //         color: "inherit !important",
        //       },
        //       "&:hover": {
        //         backgroundColor: isDarkMode ? "#1A1C4C" : "#5D87FF",
        //       },
        //     },
        //     "&:hover": {
        //       backgroundColor: isDarkMode ? "#333" : "#ECF2FF",
        //       color: isDarkMode ? "#ed1a26" : "#5D87FF",
        //       "& .MuiListItemIcon-root": {
        //         color: "inherit",
        //       },
        //     },
        //   },
        //   "& .MuiListItemIcon-root": {
        //     minWidth: "36px",
        //     color: "inherit",
        //   },
        //   "& .MuiCollapse-root .MuiListItemButton-root": {
        //     paddingLeft: "30px",
        //   },
        // }}
      >
        <PageContainer
          // sx={{
          //   color: isDarkMode ? "#ffffff" : "rgb(30, 14, 145)",
          //   "& .MuiTypography-h4": {
          //     // Style for headings above content
          //     color: isDarkMode ? "#f0f0f0" : "#40413F",
          //     fontSize: "1.35rem",
          //     fontWeight: "600",
          //     marginBottom: "1rem",
          //     fontFamily: "'Inter', sans-serif",
          //   },
          //   "& .MuiTypography-body1": {
          //     // Style for regular text
          //     color: isDarkMode ? "#e0e0e0" : "rgb(30, 14, 145)",
          //     fontSize: "1rem",
          //     fontWeight: "600",
          //     lineHeight: 1.6,
          //   },
          // }}
        >
          {/* <IconButton>
            <GridMenuIcon />
          </IconButton> */}
          {children}
        </PageContainer>
      </DashboardLayout>
      </CompanyProvider>
    </NextAppProvider>
  );
}
