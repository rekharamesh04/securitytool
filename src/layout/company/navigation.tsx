"use client";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LocationIcon from "@mui/icons-material/LocationCity";
import StorageIcon from "@mui/icons-material/Storage";
import PersonIcon from "@mui/icons-material/Person";
import RoleIcon from "@mui/icons-material/SupervisedUserCircle";
import PermissionIcon from "@mui/icons-material/VerifiedUser";
import { type Navigation } from "@toolpad/core/AppProvider";
import * as React from "react";

const iconColors = {
  dashboard: "#6C5DD3", // Royal purple (Dashboard)
  company: "#FF754C", // Vibrant coral (Companies)
  "company-list": "#7FBA7A", // Soft sage green (Lists)
  "company-users": "#FFA2C0", // Blush pink (Users)
  locations: "#3E8EF7", // Bright azure (Locations)
  "data-source": "#FFCE73", // Warm gold (Data)
  permissions: "#4CE0B3", // Mint teal (Permissions)
  roles: "#A0D7E7", // Sky blue (Roles)
  users: "#ED6A9C", // Rosy pink (Users)
};

const adminNavigation: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "company",
    title: "Dashboard",
    icon: (
      <DashboardIcon
        sx={{
          fontSize: "1.15rem",
          marginLeft: "12px",
          color: iconColors["data-source"],
          transition: "all 0.3s ease",
          "&:hover": { transform: "scale(1.1)" },
        }}
      />
    ),
  },
  {
    segment: "company/locations",
    title: "Locations",
    icon: (
      <LocationIcon
        sx={{
          fontSize: "1.15rem",
          marginLeft: "12px",
          color: iconColors["data-source"],
          transition: "all 0.3s ease",
          "&:hover": { transform: "scale(1.1)" },
        }}
      />
    ),
  },
  {
    segment: "company/data-source",
    title: "Data Source",
    icon: (
      <StorageIcon
        sx={{
          fontSize: "1.15rem",
          marginLeft: "12px",
          color: iconColors["data-source"],
          transition: "all 0.3s ease",
          "&:hover": { transform: "scale(1.1)" },
        }}
      />
    ),
  },
  {
    segment: "company/users",
    title: "Users",
    icon: (
      <PersonIcon
        sx={{
          fontSize: "1.15rem",
          marginLeft: "12px",
          color: iconColors["data-source"],
          transition: "all 0.3s ease",
          "&:hover": { transform: "scale(1.1)" },
        }}
      />
    ),
  },
  {
    kind: "header",
    title: "Access control",
  },
  {
    segment: "company/permissions",
    title: "Permissions",
    icon: (
      <PermissionIcon
        sx={{
          fontSize: "1.15rem",
          marginLeft: "12px",
          color: iconColors["data-source"],
          transition: "all 0.3s ease",
          "&:hover": { transform: "scale(1.1)" },
        }}
      />
    ),
  },
  {
    segment: "company/roles",
    title: "Roles",
    icon: (
      <RoleIcon
        sx={{
          fontSize: "1.15rem",
          marginLeft: "12px",
          color: iconColors["data-source"],
          transition: "all 0.3s ease",
          "&:hover": { transform: "scale(1.1)" },
        }}
      />
    ),
  },
];

export default adminNavigation;
