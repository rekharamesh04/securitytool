"use client";

import useAuth from "@/hooks/useAuth";
import theme from "@/theme/theme";
import { PageContainer } from "@toolpad/core";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import adminNavigation from "./navigation";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { GridMenuIcon } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

interface LayoutProps {
  window?: () => Window;
  children: React.ReactNode;
}

export default function AdminLayout(props: LayoutProps) {
  const { window, children } = props;
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  // Create a normalized pathname by removing trailing slashes
  const normalizedPathname = pathname.replace(/\/+$/, "");

  // Custom navigation handler that ensures proper matching
  // Create a navigation handler that matches the expected type
  const handleNavigation = (url: string | URL) => {
    if (typeof url === "string") {
      router.push(url);
    } else {
      router.push(url.toString());
    }
  };

  // const handleDrawerToggle = () => {
  //     setMobileOpen(!mobileOpen);
  //   };

  console.log("Current pathname:", pathname);

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
      <DashboardLayout
        sx={{
          "& .Mui-selected": {
            "& *": {
              color: "white !important", // Force all child elements white
            },
          },
          "& .MuiListSubheader-root": {
            fontFamily: "'Inter', 'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            color: "#5D87FF",
            fontSize: "10px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.13px",
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
        <PageContainer>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <GridMenuIcon />
            </IconButton>
          )}
          {children}
        </PageContainer>
      </DashboardLayout>
    </NextAppProvider>
  );
}
