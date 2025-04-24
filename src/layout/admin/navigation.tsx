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

const adminNavigation: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'admin',
        title: 'Dashboard',
        icon: <DashboardIcon sx={{fontSize: "1.15rem", marginLeft: "12px"}}/>,
    },
    {
        segment: 'admin/company',
        title: 'Companies',
        icon: <CompanyIcon sx={{fontSize: "1.15rem", marginLeft: "12px"}}/>,
        children: [
            {
                segment: 'company-list',
                title: 'Company Lists',
                icon: <ListIcon sx={{fontSize: "1.15rem", marginLeft: "12px"}}/>,
            },
            {
                segment: 'company-users',
                title: 'Company Users',
                icon: <UserIcon sx={{fontSize: "1.15rem", marginLeft: "12px"}}/>,
            },
            {
                segment: 'locations',
                title: 'Locations',
                icon: <LocationIcon sx={{fontSize: "1.15rem", marginLeft: "12px"}}/>,
            },
            {
                segment: 'data-source',
                title: 'Data Source',
                icon: <StorageIcon sx={{fontSize: "1.15rem", marginLeft: "12px"}}/>,
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
        icon: <PermissionIcon sx={{fontSize: "1.15rem", marginLeft: "12px"}}/>,
    },
    {
        segment: 'admin/user/roles',
        title: 'Roles',
        icon: <RoleIcon sx={{fontSize: "1.15rem", marginLeft: "12px"}}/>,
    },
    {
        segment: 'admin/user/users',
        title: 'Users',
        icon: <UserIcon sx={{fontSize: "1.15rem", marginLeft: "12px"}}/>,
    },
];


export default adminNavigation