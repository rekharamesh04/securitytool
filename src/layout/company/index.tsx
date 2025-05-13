"use client";

import useCompanyAuth from "@/hooks/useCompanyAuth";
import { Theme, SxProps } from "@mui/material/styles";
import Image from "next/image";
import { createTheme, alpha } from "@mui/material/styles";
import { PageContainer } from "@toolpad/core";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { CompanyProvider, useCompanyContext } from "@/contexts/CompanyContext";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import adminNavigation from "./navigation";
import { NextAppProvider } from "@toolpad/core/nextjs";
import {
  Avatar,
  Box,
  Divider,
  // IconButton,
  Menu,
  MenuItem,
  // Tooltip,
  Typography,
} from "@mui/material";
import {
  Logout,
  // NightsStay,
  // WbSunny,
} from "@mui/icons-material";
// import { ThemeProvider } from "@emotion/react";
import defaultTheme from "@/theme/theme";

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
      transition: "color 0.2s ease",
      "&:hover": {
        color: (theme) =>
          theme.palette.mode === "light" ? "#4570EA" : "#7DA2FF",
      },
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
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: (theme) =>
          theme.palette.mode === "light"
            ? "0 4px 12px rgba(93, 135, 255, 0.25)"
            : "0 4px 12px rgba(93, 135, 255, 0.35)",
      },
    },
    // Beautiful table styles
    "& .MuiDataGrid-root": {
      border: "none",
      fontFamily: "'Inter', sans-serif",
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? alpha(theme.palette.primary.light, 0.2)
            : alpha(theme.palette.primary.dark, 0.3),
        fontSize: "0.875rem",
        fontWeight: 600,
      },
      "& .MuiDataGrid-cell": {
        borderBottom: (theme) =>
          `1px solid ${
            theme.palette.mode === "light"
              ? "rgba(0, 0, 0, 0.08)"
              : "rgba(255, 255, 255, 0.08)"
          }`,
      },
      "& .MuiDataGrid-row": {
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? alpha(theme.palette.primary.light, 0.1)
              : alpha(theme.palette.primary.dark, 0.2),
        },
        "&.Mui-selected": {
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? alpha(theme.palette.primary.light, 0.3)
              : alpha(theme.palette.primary.dark, 0.4),
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? alpha(theme.palette.primary.light, 0.4)
                : alpha(theme.palette.primary.dark, 0.5),
          },
        },
      },
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

export default function CompanyAdminLayout(props: LayoutProps) {
  const { window, children } = props;
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useCompanyAuth();
  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [mode, setMode] = React.useState<"light" | "dark">("light");

  // Create a theme based on the current mode
  const currentTheme = React.useMemo(
    () =>
      createTheme({
        ...defaultTheme,
        palette: {
          ...defaultTheme.palette,
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
            default: mode === "light" ? "#F8FAFC" : "#121212",
            paper: mode === "light" ? "#F5F7FF" : "#1A1A1A",
          },
        },
      }),
    [mode]
  );

  // const { toggleColorMode } = React.useMemo(
  //   () => ({
  //     toggleColorMode: () => {
  //       setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  //     },
  //   }),
  //   []
  // );

  const dashboardStyles: SxProps<Theme> = {
    flex: 1,
    background: (theme) =>
      theme.palette.mode === "light" ? "#f8fafc" : "#121212",
    "& .MuiAppBar-root": {
      backgroundColor: (theme) =>
        theme.palette.mode === "light" ? "#F5F7FF" : "#1A1A1A",
      color: (theme) => theme.palette.text.primary,
      boxShadow: (theme) =>
        theme.palette.mode === "light"
          ? "0 2px 8px rgba(93, 135, 255, 0.1)"
          : "0 2px 8px rgba(0, 0, 0, 0.3)",
      borderBottom: (theme) =>
        `1px solid ${
          theme.palette.mode === "light"
            ? "rgba(93, 135, 255, 0.2)"
            : "rgba(255, 255, 255, 0.1)"
        }`,
      transition: "all 0.3s ease",

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
          theme.palette.mode === "light" ? "#F5F7FF" : "#1A1A1A",
        borderRight: (theme) =>
          `1px solid ${
            theme.palette.mode === "light"
              ? "rgba(93, 135, 255, 0.2)"
              : "rgba(255, 255, 255, 0.1)"
          }`,
        boxShadow: (theme) =>
          theme.palette.mode === "light"
            ? "2px 0 8px rgba(93, 135, 255, 0.1)"
            : "2px 0 8px rgba(0, 0, 0, 0.3)",
      },
    },

    "& .Mui-selected": {
      "& *": {
        color: "white !important",
      },
      background: `linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%) !important`,
      boxShadow: (theme) =>
        theme.palette.mode === "light"
          ? "0 4px 12px rgba(93, 135, 255, 0.3)"
          : "0 4px 12px rgba(93, 135, 255, 0.4)",
      "&:hover": {
        background: `linear-gradient(135deg, #4570EA 0%, #23A9F2 100%) !important`,
      },
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
        transform: "translateX(4px)",
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

  const session = React.useMemo(
    () => ({
      user: user
        ? {
            ...user,
            // Add image property if it doesn't exist on user
            image: (user as any).image || "/default-avatar.png",
          }
        : undefined,
    }),
    [user]
  );

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
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <Image
                src="/logo.png"
                alt="Monitoring App"
                fill
                style={{
                  objectFit: "contain",
                  filter:
                    mode === "dark" ? "brightness(0.8) contrast(1.2)" : "none",
                }}
              />
            </Box>
          ),
          title: "",
          homeUrl: "/admin",
        }}
        router={{
          navigate: (segment: any) => {
            router.push(segment);
          },
          pathname: pathname,
          searchParams: new URLSearchParams(),
        }}
        theme={currentTheme}
        window={demoWindow}
        session={session}
        // authentication={{
        //   signIn: () => {
        //     console.log("Sign in");
        //   },
        //   signOut: () => {
        //     logout();
        //   },
        // }}
      >
      <CompanyProvider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            overflowX: "hidden",
            width: "100%",
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        >
          <DashboardLayout
            sx={{
              flex: 1,
              width: "100%",
              maxWidth: "100%",
              "& .MuiAppBar-root": {
                position: "relative",
                zIndex: 1200,
              },
              "& .MuiToolbar-root": {
                minHeight: "64px",
              },
              ...dashboardStyles,
            }}
          >
            <LayoutContent>{children}</LayoutContent>

            <Box
              sx={{
                position: "absolute",
                right: 24,
                top: 12,
                display: "flex",
                alignItems: "center",
                gap: 1,
                zIndex: 1300,
              }}
            >
              {/* Keep only this single theme toggle */}
              {/* <Tooltip title={mode === "light" ? "Dark Mode" : "Light Mode"} arrow>
                <IconButton
                  onClick={toggleColorMode}
                  color="inherit"
                  sx={{
                    height: 40,
                    width: 40,
                    borderRadius: "12px",
                    backgroundColor: (theme) =>
                      mode === "light"
                        ? alpha(theme.palette.primary.light, 0.2)
                        : alpha(theme.palette.primary.dark, 0.3),
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        mode === "light"
                          ? alpha(theme.palette.primary.light, 0.3)
                          : alpha(theme.palette.primary.dark, 0.4),
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {mode === "dark" ? (
                    <WbSunny fontSize="small" />
                  ) : (
                    <NightsStay fontSize="small" />
                  )}
                </IconButton>
              </Tooltip> */}

              {/* User Menu */}
              <Box
                className="user-menu"
                onClick={handleClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "2.5rem"
                }}
              >
                <Avatar
                  className="user-avatar"
                  src={(user as any)?.image || "/default-avatar.png"}
                  sx={{
                    bgcolor: currentTheme.palette.primary.main,
                    width: 36,
                    height: 36,
                  }}
                />
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                    width: 240,
                    mt: 1.5,
                    borderRadius: "12px",
                    border: (theme: Theme) =>
                      `1px solid ${
                        theme.palette.mode === "light"
                          ? "rgba(93, 135, 255, 0.2)"
                          : "rgba(255, 255, 255, 0.1)"
                      }`,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha(
                        currentTheme.palette.primary.light,
                        0.2
                      ),
                    },
                  }}
                >
                  <Avatar
                    src={(user as any)?.image || "/default-avatar.png"}
                    sx={{
                      bgcolor: currentTheme.palette.primary.main,
                      width: 40,
                      height: 40,
                      mr: 2,
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user?.name || "User"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email || "user@example.com"}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    logout();
                  }}
                  sx={{
                    color: currentTheme.palette.error.main,
                    "&:hover": {
                      backgroundColor: alpha(
                        currentTheme.palette.error.light,
                        0.2
                      ),
                    },
                  }}
                >
                  <Logout fontSize="small" sx={{ mr: 1.5 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </DashboardLayout>
        </Box>
      </CompanyProvider>
      </NextAppProvider>
  );
}
