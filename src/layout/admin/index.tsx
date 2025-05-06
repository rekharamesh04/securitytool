"use client";

import useAuth from "@/hooks/useAuth";
// import theme from "@/theme/theme";
import { Theme, SxProps } from "@mui/material/styles";
import { PageContainer } from "@toolpad/core";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import adminNavigation from "./navigation";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { CompanyProvider, useCompanyContext } from "@/contexts/CompanyContext";
import Image from "next/image";
import { createTheme } from '@mui/material/styles';
import {Box, IconButton} from "@mui/material";
import { NightsStay, WbSunny } from "@mui/icons-material";
import { UserMenu } from "@/components/UserMenu";

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
        theme.palette.mode === "light"
          ? "#0037d3"
          : theme.palette.primary.light,
      fontSize: "1.35rem",
      marginBottom: "1rem",
      fontWeight: "bold",
      fontFamily: "'Inter', sans-serif",
    },
    "& .MuiTypography-body1": {
      color: (theme) =>
        theme.palette.mode === "light" ? "red" : theme.palette.error.light,
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

  // Add menu state management
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (url: string | URL) => {
    if (typeof url === "string") {
      router.push(url);
    } else {
      router.push(url.toString());
    }
    handleMenuClose();
  };

    // Add color mode state
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    const colorMode = React.useMemo(
      () => ({
        toggleColorMode: () => {
          setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        },
      }),
      [],
    );
  
    // Create theme with mode
    const theme = React.useMemo(
      () => createTheme({
        palette: {
          mode,
          // ... your existing palette config ...
        },
      }),
      [mode],
    );

  const dashboardStyles: SxProps<Theme> = {
    flex: 1,
    "& .MuiAppBar-root": {
      backgroundColor: (theme: Theme) =>
        theme.palette.mode === "light" ? "#f7f7f7" : "black", // Set the app bar background color
      color: (theme: Theme) => theme.palette.text.primary,
      backdropFilter: "blur(6px)",
      boxShadow: "none",
      borderBottom: (theme) =>
        `1px solid ${
          theme.palette.mode === "light"
            ? "rgba(0, 0, 0, 0.08)"
            : "rgba(255, 255, 255, 0.08)"
        }`,
      transition: "background-color 0.3s ease",

      // Toolbar styling
      "& .MuiToolbar-root": {
        minHeight: "60px",
        padding: "0 20px",
        justifyContent: "space-between",
      },

      // User menu button styling
      "& .user-menu-button": {
        padding: "4px 8px",
        borderRadius: "12px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(37, 70, 163, 0.05)"
              : "rgba(255, 255, 255, 0.05)",
        },
        "& .MuiAvatar-root": {
          transition: "all 0.3s ease",
        },
        "&:hover .MuiAvatar-root": {
          transform: "scale(1.1)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 2px 8px rgba(16, 55, 162, 0.15)"
              : "0 2px 8px rgba(255, 255, 255, 0.15)",
        },
      },
    },

    "& .MuiDrawer-root": {
      "& .MuiPaper-root": {
        backgroundColor: (theme: Theme) =>
          theme.palette.mode === "light"
            ? "#f7f7f7"
            : theme.palette.background.paper,
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
        theme.palette.mode === "light"
          ? "#0037d3"
          : theme.palette.primary.light,
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
          theme.palette.mode === "light"
            ? "#ECF2FF"
            : theme.palette.action.hover,
        color: (theme: Theme) =>
          theme.palette.mode === "light"
            ? "#5D87FF"
            : theme.palette.primary.light,
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
    logo: (
      <div style={{
        borderRadius: "15px",
        overflow: "hidden",
        width: 150,
        height: 40,
        position: "relative",
      }}>
        <Image
          src="/logo.png"
          alt="Monitoring App"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
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
>
  <CompanyProvider>
    <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          overflowX: 'hidden',
          width: '100%' 
        }}>
      <DashboardLayout 
            sx={{ 
              flex: 1,
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden', // Prevent any overflow
              '& .MuiAppBar-root': {
                position: 'relative',
                zIndex: 1200,
                width: '100%',
              },
              '& .MuiToolbar-root': {
                minHeight: '64px',
                padding: '0 24px',
                position: 'relative',
                width: '100%',
              },
              '& .MuiContainer-root': {
                maxWidth: '100%',
                paddingLeft: '16px',
                paddingRight: '16px',
              },
              ...dashboardStyles 
            }}
      >
        <LayoutContent>{children}</LayoutContent>
        
        {/* Enhanced Theme Toggle and User Menu */}
        <Box
          component="div"
          sx={{
            position: 'absolute',
            right: { xs: 16, sm: 24, md: 20 },
            top: "30px",
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            zIndex: 1300
          }}
        >
          <IconButton 
            onClick={colorMode.toggleColorMode} 
            color="inherit"
            sx={{ 
              height: 42,
              width: 42,
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.08)',
                transform: 'scale(1.1)'
              },
              '& svg': {
                fontSize: '1.5rem',
                color: theme.palette.mode === 'dark'
                  ? theme.palette.warning.light
                  : "rgb(17, 4, 122)"
              }
            }}
          >
{theme.palette.mode === 'dark' ? (
  <WbSunny sx={{ transition: 'all 0.3s ease' }} />
) : (
  <NightsStay sx={{ transition: 'all 0.3s ease' }} />
)}
          </IconButton>
          
          {user && (
            <UserMenu
              user={user}
              handleMenuOpen={handleMenuOpen}
              anchorEl={anchorEl}
              open={open}
              handleMenuClose={handleMenuClose}
              handleNavigation={handleNavigation}
              logout={logout}
            />
          )}
        </Box>
      </DashboardLayout>
    </Box>
  </CompanyProvider>
</NextAppProvider>
  );
}
