"use client";

import { Box, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import React from 'react';

interface FormLayoutProps {
    children: React.ReactNode;
    title: string;
}

const FormLayout: React.FC<FormLayoutProps> = (props) => {
    const { id } = useParams();
    const { children, title } = props

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                {id != "new" ? `Edit ${title}` : `Create ${title}`}
            </Typography>
            {children}
        </Box>
    );
};

export default FormLayout;