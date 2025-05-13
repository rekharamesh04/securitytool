"use client";

import useAuth from "@/hooks/useAuth";
import { Theme, SxProps } from "@mui/material/styles";
import { PageContainer } from "@toolpad/core";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import adminNavigation from "./navigation";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { CompanyProvider, useCompanyContext } from "@/contexts/CompanyContext";
import Image from "next/image";
import { createTheme, alpha } from "@mui/material/styles";
import { Box, IconButton, Tooltip } from "@mui/material";
import { NightsStay, WbSunny } from "@mui/icons-material";
import { UserMenu } from "@/components/UserMenu";

interface LayoutProps {
  window?: () => Window;
  children: React.ReactNode;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedCompany } = useCompanyContext();
  
  const pageContainerStyles: SxProps<Theme> = {
    color: (theme) => theme.palette.text.primary,
    "& .MuiTypography-h4": {
      color: (theme) =>
        theme.palette.mode === "light"
          ? "#5D87FF"
          : theme.palette.primary.light,
      fontSize: "1.75rem",
      marginBottom: "1.5rem",
      fontWeight: 700,
      fontFamily: "'Poppins', sans-serif",
      transition: 'color 0.2s ease',
      '&:hover': {
        color: (theme) => theme.palette.mode === "light" ? "#4570EA" : "#7DA2FF"
      }
    },
    "& .MuiTypography-body1": {
      color: (theme) =>
        theme.palette.mode === "light" 
          ? alpha(theme.palette.text.primary, 0.85)
          : alpha(theme.palette.text.primary, 0.9),
      fontSize: "1.05rem",
      fontWeight: 500,
      lineHeight: 1.8,
      fontFamily: "'Inter', sans-serif",
    },
    "& .MuiButton-root": {
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: (theme) => 
          theme.palette.mode === 'light'
            ? '0 4px 12px rgba(93, 135, 255, 0.25)'
            : '0 4px 12px rgba(93, 135, 255, 0.35)'
      }
    },
    // Beautiful table styles
    "& .MuiDataGrid-root": {
      border: 'none',
      fontFamily: "'Inter', sans-serif",
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' 
            ? alpha(theme.palette.primary.light, 0.2) 
            : alpha(theme.palette.primary.dark, 0.3),
        fontSize: '0.875rem',
        fontWeight: 600,
      },
      "& .MuiDataGrid-cell": {
        borderBottom: (theme) => 
          `1px solid ${
            theme.palette.mode === 'light'
              ? 'rgba(0, 0, 0, 0.08)'
              : 'rgba(255, 255, 255, 0.08)'
          }`,
      },
      "& .MuiDataGrid-row": {
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: (theme) => 
            theme.palette.mode === 'light'
              ? alpha(theme.palette.primary.light, 0.1)
              : alpha(theme.palette.primary.dark, 0.2),
        },
        '&.Mui-selected': {
          backgroundColor: (theme) => 
            theme.palette.mode === 'light'
              ? alpha(theme.palette.primary.light, 0.3)
              : alpha(theme.palette.primary.dark, 0.4),
          '&:hover': {
            backgroundColor: (theme) => 
              theme.palette.mode === 'light'
                ? alpha(theme.palette.primary.light, 0.4)
                : alpha(theme.palette.primary.dark, 0.5),
          }
        }
      }
    }
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

  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () => createTheme({
      palette: {
        mode,
        primary: {
          main: "#5D87FF",
          light: "#ECF2FF",
          dark: "#4570EA",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#49BEFF",
          light: "#E8F7FF",
          dark: "#23A9F2",
          contrastText: "#FFFFFF",
        },
        background: {
          default: mode === 'light' ? "#F8FAFC" : "#121212",
          paper: mode === 'light' ? "#F5F7FF" : "#1A1A1A",
        },
        text: {
          primary: mode === 'light' ? "#2A3547" : "#F0F0F0",
          secondary: mode === 'light' ? "#5A6A85" : "#B0B0B0",
        },
        divider: mode === 'light' ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)",
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        h1: { fontFamily: "'Poppins', sans-serif" },
        h2: { fontFamily: "'Poppins', sans-serif" },
        h3: { fontFamily: "'Poppins', sans-serif" },
        h4: { fontFamily: "'Poppins', sans-serif" },
        h5: { fontFamily: "'Poppins', sans-serif" },
        h6: { fontFamily: "'Poppins', sans-serif" },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 600,
              letterSpacing: 0.5,
              padding: '10px 24px',
              borderRadius: '12px',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: mode === 'light' 
                ? '0 2px 10px 0 rgba(0, 0, 0, 0.05)'
                : '0 2px 10px 0 rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
    }),
    [mode],
  );

  const dashboardStyles: SxProps<Theme> = {
    flex: 1,
    background: (theme) => 
      theme.palette.mode === 'light'
        ? '#f8fafc'
        : '#121212',
    "& .MuiAppBar-root": {
      backgroundColor: (theme) =>
        theme.palette.mode === "light" 
          ? "#F5F7FF" 
          : "#1A1A1A",
      color: (theme) => theme.palette.text.primary,
      boxShadow: (theme) => 
        theme.palette.mode === 'light'
          ? '0 2px 8px rgba(93, 135, 255, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.3)',
      borderBottom: (theme) =>
        `1px solid ${
          theme.palette.mode === "light"
            ? "rgba(93, 135, 255, 0.2)"
            : "rgba(255, 255, 255, 0.1)"
        }`,
      transition: 'all 0.3s ease',

      "& .MuiToolbar-root": {
        minHeight: "64px",
        padding: "0 20px",
      },

      "& .user-menu-button": {
        padding: "6px 12px",
        borderRadius: "12px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(93, 135, 255, 0.1)"
              : "rgba(255, 255, 255, 0.1)",
        },
      },
    },

    "& .MuiDrawer-root": {
      "& .MuiPaper-root": {
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? "#F5F7FF"
            : "#1A1A1A",
        borderRight: (theme) =>
          `1px solid ${
            theme.palette.mode === "light"
              ? "rgba(93, 135, 255, 0.2)"
              : "rgba(255, 255, 255, 0.1)"
          }`,
        boxShadow: (theme) => 
          theme.palette.mode === 'light'
            ? '2px 0 8px rgba(93, 135, 255, 0.1)'
            : '2px 0 8px rgba(0, 0, 0, 0.3)',
      },
    },

    "& .Mui-selected": {
      "& *": {
        color: "white !important",
      },
      background: `linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%) !important`,
      boxShadow: (theme) => 
        theme.palette.mode === 'light'
          ? '0 4px 12px rgba(93, 135, 255, 0.3)'
          : '0 4px 12px rgba(93, 135, 255, 0.4)',
      "&:hover": {
        background: `linear-gradient(135deg, #4570EA 0%, #23A9F2 100%) !important`,
      }
    },

    "& .MuiListSubheader-root": {
      fontFamily: "'Poppins', sans-serif",
      color: (theme) =>
        theme.palette.mode === "light"
          ? "#5D87FF"
          : theme.palette.primary.light,
      fontWeight: 600,
      fontSize: "0.8rem",
      letterSpacing: "0.5px",
      marginTop: "12px",
      pl: "12px",
      lineHeight: 1.5,
      textTransform: "uppercase",
    },

    "& .MuiListItemButton-root": {
      borderRadius: "8px",
      margin: "2px 6px",
      padding: "6px 10px",
      whiteSpace: "nowrap",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? alpha(theme.palette.primary.light, 0.3)
            : alpha(theme.palette.primary.dark, 0.3),
        color: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.primary.main
            : theme.palette.primary.light,
        transform: 'translateX(4px)',
      },
    },

    "& .MuiListItemIcon-root": {
      minWidth: "32px",
      color: "inherit",
    },

    "& .MuiCollapse-root .MuiListItemButton-root": {
      paddingLeft: "32px",
    },
  };

  return (
    <NextAppProvider
      navigation={adminNavigation}
      branding={{
        logo: (
          <Box
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              width: 150,
              height: 40,
              position: "relative",
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.03)',
              }
            }}
          >
            <Image
              src="/logo.png"
              alt="Monitoring App"
              fill
              style={{ 
                objectFit: "contain",
                filter: theme.palette.mode === 'dark' ? 'brightness(0.8) contrast(1.2)' : 'none'
              }}
            />
          </Box>
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
          width: '100%',
          backgroundColor: (theme) => theme.palette.background.default
        }}>
          <DashboardLayout 
            sx={{ 
              flex: 1,
              width: '100%',
              maxWidth: '100%',
              '& .MuiAppBar-root': {
                position: 'relative',
                zIndex: 1200,
              },
              '& .MuiToolbar-root': {
                minHeight: '64px',
              },
              ...dashboardStyles 
            }}
          >
            <LayoutContent>{children}</LayoutContent>
            
            <Box
              sx={{
                position: 'fixed',
                right: 20,
                top: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                zIndex: 1300
              }}
            >
              <Tooltip title="Toggle Theme" arrow>
                <IconButton 
                  onClick={colorMode.toggleColorMode} 
                  color="inherit"
                  sx={{ 
                    height: 40,
                    width: 40,
                    borderRadius: '20px',
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? alpha(theme.palette.primary.light, 0.2)
                        : alpha(theme.palette.primary.dark, 0.3),
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                          ? alpha(theme.palette.primary.light, 0.3)
                          : alpha(theme.palette.primary.dark, 0.4),
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {theme.palette.mode === 'dark' ? (
                    <WbSunny fontSize="small" />
                  ) : (
                    <NightsStay fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>

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