"use client";

import {
  Menu,
  MenuItem,
  Divider,
  Button, // Keep Button here, as it's rendered by UserMenu
  Avatar,
  Box,
  Typography,
  ListItemIcon,
  Badge,
  ListItemText,
} from "@mui/material";
import { Logout, Email } from "@mui/icons-material";
import { Theme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "12px 16px",
  borderRadius: "8px",
  margin: "4px 8px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(93, 135, 255, 0.1)"
        : "rgba(255, 255, 255, 0.1)",
    transform: "translateX(4px)",
  },
}));

const UserInfoMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  cursor: "default",
  backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#1A1A1A",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#1A1A1A",
  },
}));

export const UserMenu = ({
  user,
  handleMenuOpen, // This prop is used internally by UserMenu
  anchorEl,
  open,
  handleMenuClose,
  logout,
}: {
  user: any;
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  handleMenuClose: () => void;
  logout: () => void;
}) => (
  <>
    {/* This Button is what you'll see in the UI and what triggers the menu */}
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
      <UserInfoMenuItem
        disabled
        sx={{
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
              variant="subtitle1"
              fontWeight={700}
              sx={{
                color: (theme) => theme.palette.text.primary,
                fontSize: "1.1rem",
              }}
            >
              {user?.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.palette.text.secondary,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                mt: 0.5,
              }}
            >
              <Email
                fontSize="small"
                sx={{ mr: 1, opacity: 0.7, fontSize: "1rem" }}
              />
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </UserInfoMenuItem>
      <Divider
        sx={{
          my: 0,
          borderColor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(93, 135, 255, 0.2)"
              : "rgba(255, 255, 255, 0.1)",
        }}
      />
      <StyledMenuItem
        onClick={() => {
          handleMenuClose();
          logout();
        }}
        sx={{
          color: (theme) => theme.palette.error.main,
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.error.light + "!important",
            color: "#fff",
            "& .MuiListItemIcon-root": {
              color: "#fff",
            },
          },
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText>Sign Out</ListItemText>
      </StyledMenuItem>
    </Menu>
  </>
);