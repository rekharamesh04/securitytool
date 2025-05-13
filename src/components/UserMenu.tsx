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
} from "@mui/material";
// import { AccountCircle, Settings } from "@mui/icons-material";
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
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        },
      }}
    >
      <Avatar
        sx={{
          width: 42,
          height: 42,
          backgroundColor: (theme: Theme) =>
                      theme.palette.mode === "light" ? "#375199" : "#4a6ccc",
          color: (theme: Theme) =>
                          theme.palette.mode === "light" ? "white" : "white",
          fontSize: "1.25rem",
          fontWeight: 500,
        }}
      >
        {user?.name?.charAt(0)}
      </Avatar>
    </Button>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(41, 107, 189, 0.32))",
          mt: 1.5,
          minWidth: 200,
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
            transform: "translateY(-70%) rotate(45deg)",
            zIndex: 0,
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
            flexDirection: "column",
            width: "100%",
            padding: "0 8px",
          }}
        >
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
                color: "(theme) => theme.palette.text.secondary",
                fontSize: "2rem",
                ml: 1
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
                mr: 1
              }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </MenuItem>
      <Divider />
      {/* <MenuItem onClick={() => handleNavigation("/profile")} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigation("/settings")} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider /> */}
      <MenuItem
        onClick={() => {
          handleMenuClose();
          logout();
        }}
        sx={{
          py: 1.5,
          mt: 0.5,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: (theme) => theme.palette.error.light,
            color: "#fff",
            transform: "scale(1.02)",
            "& .MuiListItemIcon-root": {
              color: "#fff",
            },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 36, ml: "20px" }}>
          <Logout fontSize="small" sx={{ transition: "all 0.2s ease" }} />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "1rem" }}>
          Sign Out
        </Typography>
      </MenuItem>
    </Menu>
  </>
);
