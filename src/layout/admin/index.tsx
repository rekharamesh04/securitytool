"use client";

import useAuth from "@/hooks/useAuth";
import theme from "@/theme/theme";
import { Theme, SxProps  } from '@mui/material/styles';
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
  const pageContainerStyles: SxProps<Theme> = {
    color: (theme) => theme.palette.text.primary,
    "& .MuiTypography-h4": {
      color: (theme) => 
        theme.palette.mode === 'light' ? '#0037d3' : theme.palette.primary.light,
      fontSize: "1.35rem",
      marginBottom: "1rem",
      fontWeight: "bold",
      fontFamily: "'Inter', sans-serif",
    },
    "& .MuiTypography-body1": {
      color: (theme) => 
        theme.palette.mode === 'light' ? 'red' : theme.palette.error.light,
      fontSize: "1rem",
      fontWeight: "600",
      lineHeight: 1.6,
    },
  };

  return (
    <PageContainer
      title={
        pathname === "/admin/company/data-source" && selectedCompany
          ? `Data Source · ${selectedCompany.name}`
          : undefined
      }
      sx={pageContainerStyles}
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

  const dashboardStyles: SxProps<Theme> = {
    "& .MuiAppBar-root": {
      backgroundColor: (theme: Theme) => 
        theme.palette.mode === 'light' ? '#fafbff' : theme.palette.background.default,
    },
    "& .MuiDrawer-root": {
      "& .MuiPaper-root": {
        backgroundColor: (theme: Theme) => 
          theme.palette.mode === 'light' ? '#f7f7f7' : theme.palette.background.paper,
      },
    },
    "& .Mui-selected": {
      "& *": {
        color: "white !important",
      },
    },
    "& .MuiListSubheader-root": {
      fontFamily: "'Inter', sans-serif",
      color: (theme: Theme) => 
        theme.palette.mode === 'light' ? '#0037d3' : theme.palette.primary.light,
      fontWeight: "bold",
      fontSize: "14px",
      letterSpacing: "0.25px",
      marginTop: "10px",
      pl: "10px",
      lineHeight: 1.5,
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
        backgroundColor: (theme: Theme) => 
          theme.palette.mode === 'light' ? "#ECF2FF" : theme.palette.action.hover,
        color: (theme: Theme) => 
          theme.palette.mode === 'light' ? "#5D87FF" : theme.palette.primary.light,
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
  };

  return (
    <NextAppProvider
      navigation={adminNavigation}
      branding={{
        logo: <img src="/logo.png" alt="Monitoring App" style={{ 
          borderRadius: '15px',
          width: '150px',
          height: '130px',
          objectFit: 'contain'
        }}  />,
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
        <DashboardLayout sx={dashboardStyles}
          // sx={{
          //   "& .MuiAppBar-root": {
          //     backgroundColor: (theme: Theme) => 
          //       theme.palette.mode === 'light' ? '#fafbff' : theme.palette.background.default,
          //   },
          //   "& .MuiDrawer-root": {
          //     "& .MuiPaper-root": {
          //       backgroundColor: (theme: Theme) => 
          //         theme.palette.mode === 'light' ? '#f7f7f7' : theme.palette.background.paper,
          //     },
          //   },
          //   "& .Mui-selected": {
          //     "& *": {
          //       color: "white !important",
          //     },
          //   },
          //   "& .MuiListSubheader-root": {
          //     fontFamily: "'Inter', sans-serif",
          //     color: "#0037d3",
          //     fontWeight: "bold",
          //     fontSize: "14px",
          //     letterSpacing: "0.25px",
          //     marginTop: "10px",
          //     pl: "10px",
          //     lineHeight: 1.5,
          //   },
          //   "& .MuiListItemButton-root": {
          //     borderRadius: "8px",
          //     marginBottom: "2px",
          //     paddingLeft: "10px",
          //     whiteSpace: "nowrap",
          //     "&.Mui-selected": {
          //       backgroundColor: "#5D87FF !important",
          //       color: "inherit !important",
          //       "& .MuiListItemIcon-root": {
          //         color: "inherit !important",
          //       },
          //       "&:hover": {
          //         backgroundColor: "#5D87FF",
          //       },
          //     },
          //     "&:hover": {
          //       backgroundColor: "#ECF2FF",
          //       color: "#5D87FF",
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
          <LayoutContent>{children}</LayoutContent>
        </DashboardLayout>
      </CompanyProvider>
    </NextAppProvider>
  );
}
