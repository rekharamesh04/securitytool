'use client';
import CompanyIcon from '@mui/icons-material/BusinessCenter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationIcon from '@mui/icons-material/LocationCity';
import StorageIcon from '@mui/icons-material/Storage';
import UserIcon from '@mui/icons-material/People';
import RoleIcon from '@mui/icons-material/SupervisedUserCircle';
import PermissionIcon from '@mui/icons-material/VerifiedUser';
import ListIcon from '@mui/icons-material/List';
import { type Navigation } from '@toolpad/core/AppProvider';
import * as React from 'react';

// Beautiful icon color palette
const iconColors = {
  dashboard: '#6C5DD3',      // Royal purple (Dashboard)
  company: '#FF754C',        // Vibrant coral (Companies)
  'company-list': '#7FBA7A', // Soft sage green (Lists)
  'company-users': '#FFA2C0',// Blush pink (Users)
  locations: '#3E8EF7',      // Bright azure (Locations)
  'data-source': '#FFCE73',  // Warm gold (Data)
  permissions: '#4CE0B3',    // Mint teal (Permissions)
  roles: '#A0D7E7',          // Sky blue (Roles)
  users: '#ED6A9C',          // Rosy pink (Users)
};

const adminNavigation: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'admin',
        title: 'Dashboard',
        icon: <DashboardIcon sx={{
          fontSize: "1.25rem",
          color: iconColors.dashboard,
          transition: "all 0.3s ease",
          '&:hover': { transform: "scale(1.1)" }
        }}/>,
    },
    {
        segment: 'admin/company',
        title: 'Companies',
        icon: <CompanyIcon sx={{
          fontSize: "1.25rem",
          color: iconColors.company,
          transition: "all 0.3s ease",
          '&:hover': { transform: "scale(1.1)" }
        }}/>,
        children: [
            {
                segment: 'company-list',
                title: 'Company Lists',
                icon: <ListIcon sx={{
                  fontSize: "1.15rem",
                  color: iconColors['company-list'],
                  transition: "all 0.3s ease",
                  '&:hover': { transform: "scale(1.1)" }
                }}/>,
            },
            {
                segment: 'company-users',
                title: 'Company Users',
                icon: <UserIcon sx={{
                  fontSize: "1.15rem",
                  color: iconColors['company-users'],
                  transition: "all 0.3s ease",
                  '&:hover': { transform: "scale(1.1)" }
                }}/>,
            },
            {
                segment: 'locations',
                title: 'Locations',
                icon: <LocationIcon sx={{
                  fontSize: "1.15rem",
                  color: iconColors.locations,
                  transition: "all 0.3s ease",
                  '&:hover': { transform: "scale(1.1)" }
                }}/>,
            },
            {
                segment: 'data-source',
                title: 'Data Source',
                icon: <StorageIcon sx={{
                  fontSize: "1.15rem",
                  color: iconColors['data-source'],
                  transition: "all 0.3s ease",
                  '&:hover': { transform: "scale(1.1)" }
                }}/>,
            },
        ]
    },
    {
        kind: 'header',
        title: 'Access control',
    },
    {
        segment: 'admin/user/permissions',
        title: 'Permissions',
        icon: <PermissionIcon sx={{
          fontSize: "1.25rem",
          color: iconColors.permissions,
          transition: "all 0.3s ease",
          '&:hover': { transform: "scale(1.1)" }
        }}/>,
    },
    {
        segment: 'admin/user/roles',
        title: 'Roles',
        icon: <RoleIcon sx={{
          fontSize: "1.25rem",
          color: iconColors.roles,
          transition: "all 0.3s ease",
          '&:hover': { transform: "scale(1.1)" }
        }}/>,
    },
    {
        segment: 'admin/user/users',
        title: 'Users',
        icon: <UserIcon sx={{
          fontSize: "1.25rem",
          color: iconColors.users,
          transition: "all 0.3s ease",
          '&:hover': { transform: "scale(1.1)" }
        }}/>,
    },
];

export default adminNavigation;