"use client";

import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from "next/navigation";

const ForbiddenPage: React.FC<any> = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.push("/")
    };

    return (
        <Container style={{ textAlign: 'center', marginTop: '20%' }}>
            <Typography variant="h1" component="h2" gutterBottom>
                403
            </Typography>
            <Typography variant="h5" component="h3" gutterBottom>
                Forbidden
            </Typography>
            <Typography variant="body1" gutterBottom>
                You do not have permission to access this page.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGoBack}>
                Go Back
            </Button>
        </Container>
    );
};

export default ForbiddenPage;