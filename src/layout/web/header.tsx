'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <img src="/continental-battery-logo-horizontal.svg" alt="Logo" style={{ marginRight: '16px', height: '40px' }} />
                <Typography variant="h6" style={{ flexGrow: 1 }}></Typography>
                <img src="/logo.png" alt="Logo" style={{ marginRight: '16px', height: '40px' }} />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
