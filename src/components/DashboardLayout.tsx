// components/CompanyDashboardLayout.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Box, Snackbar, Typography, IconButton } from '@mui/material';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check for login success flag from session storage
    if (typeof window !== 'undefined') {
      const loginSuccessFlag = sessionStorage.getItem('loginSuccess');
      if (loginSuccessFlag === 'true') {
        setSuccessMessage("Login Successful!");
        setOpenSuccessSnackbar(true);
        sessionStorage.removeItem('loginSuccess'); // Clear the flag after showing
      }
    }
  }, []); // Run once on mount to check for the flag

  const handleCloseSuccessSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {children}

      {/* Success Snackbar for Dashboard */}
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={3000} // Disappear after 3 seconds (as requested)
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Position at bottom-left
        TransitionProps={{
          onEnter: (node: HTMLElement) => {
            node.style.animation = 'slideInFromLeft 0.5s ease-out forwards';
          },
          onExit: (node: HTMLElement) => {
            node.style.animation = 'slideOutToLeft 0.5s ease-in forwards';
          },
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '10px 18px',
          borderRadius: '10px',
          background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)', // Green gradient
          color: 'white',
          boxShadow: '0 4px 12px rgba(0, 255, 0, 0.3)',
          minWidth: '200px',
          justifyContent: 'center',
          // Define keyframes directly within the style block for this component
          '@keyframes slideInFromLeft': {
            '0%': { opacity: 0, transform: 'translateX(-100%)' },
            '100%': { opacity: 1, transform: 'translateX(0)' },
          },
          '@keyframes slideOutToLeft': {
            '0%': { opacity: 1, transform: 'translateX(0)' },
            '100%': { opacity: 0, transform: 'translateX(-100%)' },
          },
        }}>
          {/* Success Icon (Inline SVG) */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17L4 12" />
          </svg>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
            {successMessage}
          </Typography>
          {/* Dismiss button for success toast with hover effect */}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSuccessSnackbar}
            sx={{
              ml: 1,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.2) rotate(90deg)', // Zoom and rotate on hover
              }
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6L18 18" />
            </svg>
          </IconButton>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default DashboardLayout;
