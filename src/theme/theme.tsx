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
            default: '#ffffff', // Default background color
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
        fontFamily: "'Roboto', 'Arial', sans-serif",

    },
    // typography: {
    //     fontFamily: "'Roboto', 'Arial', sans-serif",
    //     body1: {
    //         fontSize: '0.85rem',
    //     },
    //     button: {
    //         fontSize: '0.8rem',
    //         textTransform: 'none',
    //     },
    // },
};

// Create the theme
const theme = createTheme(themeOptions);

export default theme;
