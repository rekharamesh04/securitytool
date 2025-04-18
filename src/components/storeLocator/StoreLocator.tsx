'use client';

import { Store } from "@/types/store";
import { Box, Button, Grid2, List, ListItem, ListItemText, Paper } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useDialogs } from "@toolpad/core";
import React from "react";
import StoreViewDetail from "./storeDetail";
interface StoreLocatorProps {
    stores: Store[];
}

const StoreLocator: React.FC<StoreLocatorProps> = ({ stores }) => {
    const dialogs = useDialogs();

    const mapContainerStyle = {
        width: "100%",
        height: "500px",
    };

    const defaultCenter = {
        lat: stores?.[0]?.latitude || 0,
        lng: stores?.[0]?.longitude || 0,
    };


    const handleDashboardClick = (store: any) => {
        localStorage.setItem("location_id", store.location_id);
        console.log("store", store)
        window.open(store.dashboardUrl, "_blank");
    }

    const handleStoreClick = async (store: Store) => {
        await dialogs.open((props) => (
            <StoreViewDetail {...props} store={store} />
        ));
    }


    return (
        <Box>
            <Grid2 container spacing={2} justifyContent="center">
                <Grid2 size={{
                    xs: 12,
                    sm: 12,
                    md: 4,
                    lg: 4,
                    xl: 4,
                }}>
                    <List>
                        {stores.map((store) => (
                            <ListItem
                                key={store.name}
                                component={Paper}
                                sx={{
                                    mb: 1,
                                    display: {
                                        xs: "block",
                                        sm: "flex",
                                        md: "flex",
                                        lg: "flex",
                                        xl: "flex",
                                    }
                                }}
                            >
                                <ListItemText primary={store.name} secondary={store.address} />
                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 0,
                                        whiteSpace: "nowrap",
                                        minWidth: "150px"
                                    }}
                                    onClick={() => handleDashboardClick(store)}>View Dashboard</Button>
                            </ListItem>
                        ))}
                    </List>
                </Grid2>
                <Grid2 size={{
                    xs: 12,
                    sm: 12,
                    md: 8,
                    lg: 8,
                    xl: 8,
                }}>
                    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={defaultCenter}
                            zoom={12}
                        >
                            {stores.map((store) => (
                                <Marker
                                    key={store.name}
                                    position={{ lat: store.latitude, lng: store.longitude }}
                                    onClick={() => handleStoreClick(store)}
                                />
                            ))}
                        </GoogleMap>
                    </LoadScript>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default StoreLocator;
