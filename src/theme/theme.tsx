"use client";

import { createTheme } from '@mui/material/styles';

// Define the custom theme options
const themeOptions = {
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    palette: {
        primary: {
            main: '#282B73', // Primary color
            light: '#575A9C', // Lighter version of primary
            dark: '#1A1C4C', // Darker version of primary
            contrastText: '#ffffff', // Text color for primary backgrounds
        },
        secondary: {
            main: '#ed1a26', // Secondary color
            light: '#ff5d5f', // Lighter version of secondary
            dark: '#a40016', // Darker version of secondary
            contrastText: '#ffffff', // Text color for secondary backgrounds
        },
        background: {
            default: '#fbfcfe', // Default background color
            paper: '#ffffff',   // Background for paper components
        },
        color : {
            default: '#0037d3',
            paper: '#ffffff',   // Background for paper components
        },
        text: {
            primary: '#333', // Text on default background
            secondary: '#ed1a26', // Secondary text color
            disabled: '#9e9e9e', // Disabled text
        },
        error: {
            main: '#f44336', // Standard error color
        },
        warning: {
            main: '#ffa726', // Standard warning color
        },
        info: {
            main: '#2196f3', // Standard info color
        },
        success: {
            main: '#4caf50', // Standard success color
        },
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: {
            fontFamily: "'Playfair Display', serif",
            fontSize: '3.5rem',
            fontWeight: 700,
        },
        h2: {
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.75rem',
            fontWeight: 600,
        },
        h3: {
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '15px',
            fontWeight: 500,
            fontStyle: 'normal',
        },
    },
};

// Create the theme
const theme = createTheme(themeOptions,
    {
        transitions: {
          easing: {
            easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
          },
          duration: {
            leavingScreen: 300,
            enteringScreen: 300,
          }
        },
    },
);

export default theme;
