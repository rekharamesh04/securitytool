'use client';

import CompanyIcon from '@mui/icons-material/BusinessCenter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationIcon from '@mui/icons-material/LocationCity';
import UserIcon from '@mui/icons-material/People';
import RoleIcon from '@mui/icons-material/SupervisedUserCircle';
import PermissionIcon from '@mui/icons-material/VerifiedUser';
import ListIcon from '@mui/icons-material/List';
import { type Navigation } from '@toolpad/core/AppProvider';
import * as React from 'react';

const adminNavigation: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'admin',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'admin/company',
        title: 'Companies',
        icon: <CompanyIcon />,
        children: [
            {
                segment: '/',
                title: 'Company Lists',
                icon: <ListIcon />,
            },
            {
                segment: 'company-users',
                title: 'Company Users',
                icon: <UserIcon />,
            },
            {
                segment: 'locations',
                title: 'Locations',
                icon: <LocationIcon />,
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
        icon: <PermissionIcon />,
    },
    {
        segment: 'admin/user/roles',
        title: 'Roles',
        icon: <RoleIcon />,
    },
    {
        segment: 'admin/user/users',
        title: 'Users',
        icon: <UserIcon />,
    },
];


export default adminNavigation