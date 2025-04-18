'use client';

import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationIcon from '@mui/icons-material/LocationCity';
import PersonIcon from '@mui/icons-material/Person';
import RoleIcon from '@mui/icons-material/SupervisedUserCircle';
import PermissionIcon from '@mui/icons-material/VerifiedUser';
import { type Navigation } from '@toolpad/core/AppProvider';
import * as React from 'react';

const adminNavigation: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'company',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'company/locations',
        title: 'Locations',
        icon: <LocationIcon />,
    },
    {
        segment: 'company/users',
        title: 'Users',
        icon: <PersonIcon />,
    },
    {
        kind: 'header',
        title: 'Access control',
    },
    {
        segment: 'company/permissions',
        title: 'Permissions',
        icon: <PermissionIcon />,
    },
    {
        segment: 'company/roles',
        title: 'Roles',
        icon: <RoleIcon />,
    },
];


export default adminNavigation