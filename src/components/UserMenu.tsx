"use client";

import {
  Menu,
  MenuItem,
  Divider,
  Button,
  Avatar,
  Box,
  Typography,
  ListItemIcon,
  Badge,
} from "@mui/material";
import { Logout, Email } from "@mui/icons-material";
import { Theme } from "@mui/material/styles";

export const UserMenu = ({
  user,
  handleMenuOpen,
  anchorEl,
  open,
  handleMenuClose,
  // handleNavigation,
  logout,
}: {
  user: any;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  handleMenuClose: () => void;
  handleNavigation: (url: string) => void;
  logout: () => void;
}) => (
  <>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Button
        onClick={handleMenuOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "inherit",
          textTransform: "none",
          minWidth: "auto",
          padding: "4px 8px",
          boxSizing: "border-box",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#44b700",
              color: "#44b700",
              boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
              "&::after": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: "ripple 1.2s infinite ease-in-out",
                border: "1px solid currentColor",
                content: '""',
              },
            },
            "@keyframes ripple": {
              "0%": {
                transform: "scale(.8)",
                opacity: 1,
              },
              "100%": {
                transform: "scale(2.4)",
                opacity: 0,
              },
            },
          }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              backgroundColor: (theme: Theme) =>
                theme.palette.mode === "light" ? "#375199" : "#4a6ccc",
              color: "white",
              fontSize: "1.25rem",
              fontWeight: 500,
              boxSizing: "border-box",
              border: "2px solid",
              borderColor: (theme) => theme.palette.primary.main,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
        </Badge>
      </Button>
    </Box>

    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      PaperProps={{
        elevation: 4,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 4px 16px rgba(0, 0, 0, 0.2))",
          mt: 1.5,
          minWidth: 280,
          borderRadius: "12px",
          background: (theme) =>
            theme.palette.mode === "light" ? "#ffffff" : "#1A1A1A",
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === "light"
                ? "rgba(93, 135, 255, 0.3)"
                : "rgba(255, 255, 255, 0.1)"
            }`,
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "#ffffff" : "#1A1A1A",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
            borderTop: (theme) =>
              `1px solid ${
                theme.palette.mode === "light"
                  ? "rgba(93, 135, 255, 0.3)"
                  : "rgba(255, 255, 255, 0.1)"
              }`,
            borderLeft: (theme) =>
              `1px solid ${
                theme.palette.mode === "light"
                  ? "rgba(93, 135, 255, 0.3)"
                  : "rgba(255, 255, 255, 0.1)"
              }`,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
        disabled
        sx={{
          py: 1.5,
          backgroundColor: "transparent !important",
          opacity: 1,
          "&.Mui-disabled": {
            opacity: 1,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            width: "100%",
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              backgroundColor: (theme: Theme) =>
                theme.palette.mode === "light" ? "#375199" : "#4a6ccc",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 600,
              boxSizing: "border-box",
              border: "2px solid",
              borderColor: (theme) => theme.palette.primary.main,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: (theme) => theme.palette.text.primary,
                fontSize: "1.25rem",
                fontWeight: "bold",
                lineHeight: 1.3,
                mb: 0.5,
              }}
            >
              {user?.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  fontSize: "2rem",
                  ml: 1,
                }}
              >
                <Email fontSize="small" />
              </ListItemIcon>
              <Typography
                variant="caption"
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  fontSize: "1rem",
                  lineHeight: 1.3,
                  mr: 1,
                }}
              >
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          handleMenuClose();
          logout();
        }}
        sx={{
          py: 1.5,
          mt: 0.5,
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: (theme) => theme.palette.error.light,
            color: "#fff",
            "& .MuiListItemIcon-root": {
              color: "#fff",
            },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 36, ml: "20px" }}>
          <Logout fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "1rem" }}>
          Sign Out
        </Typography>
      </MenuItem>
    </Menu>
  </>
);
