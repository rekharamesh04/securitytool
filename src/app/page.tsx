"use client";

import StoreLocator from "@/components/storeLocator/StoreLocator";
import WebLayout from "@/layout/web";
import { Store } from "@/types/store";
import axiosInstance from "@/utils/axiosInstance";
import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Home: React.FC<any> = () => {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axiosInstance.get('/api/company/locations');
        const { locations } = response.data;
        setStores(locations);
      } catch (error) {
        console.error("Failed to fetch store locations", error);
      }
    };

    fetchStores();
  }, []);

  return (
    <WebLayout>
      <Container maxWidth="xl">
        <Box mt={2} mb={2}>
          <Typography variant="h4" align="center">Welcome to Geo Locator</Typography>
        </Box>
        <StoreLocator stores={stores} />
      </Container>
    </WebLayout>
  );
};

export default Home;
