"use client";
import {
        Box,
        Typography,
        Divider,
        Chip,
        Checkbox,
        Button,
    } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClassifiedInfo from "@/components/company/data-source/classifiedInfo";

export default function OverviewTab() {

        return (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
                sx={(theme) => ({
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                p: 3,
                backgroundColor:
                    theme.palette.mode === "light"
                    ? "#ffffff"
                    : theme.palette.background.default,
                width: "380px",
                color: theme.palette.text.primary,
                })}
            >
                {/* Main Header */}
                <Typography
                variant="h5"
                sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    mb: 3,
                }}
                >
                Datastore Details
                </Typography>
                <Divider
                sx={{
                    borderColor: "#E0E0E0",
                    marginBottom: "17px",
                    marginTop: "2px",
                }}
                />

            {/* Scan Status Section */}
            <Box sx={{ mb: 3 }}>
            <Typography
                variant="h6"
                sx={{
                fontSize: "16px",
                fontWeight: 600,
                mb: 2,
                }}
            >
                Scan Status
            </Typography>
            <Divider
                sx={{
                borderColor: "#E0E0E0",
                marginBottom: "24px",
                marginTop: "10px",
                }}
            />

            <Box sx={{ pl: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                First discovered
                </Typography>
                <Typography
                variant="body2"
                sx={{
                    color: "#5f6368",

                    mb: 2,
                }}
                >
                06 Sep 2024, 02:20 PM
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                Last seen
                </Typography>
                <Typography
                variant="body2"
                sx={{
                    color: "#5f6368",

                    mb: 2,
                }}
                >
                19 Sep 2024, 02:20 PM
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                Last data refresh
                </Typography>
                <Typography
                variant="body2"
                sx={{
                    color: "#5f6368",
                }}
                >
                13 Sep 2024, 02:20 PM
                </Typography>
            </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

            {/* User Tags Section */}
            <Box sx={{ mb: 3 }}>
            <Typography
                variant="h6"
                sx={{
                fontSize: "16px",
                fontWeight: 600,
                mb: 2,
                }}
            >
                User Tags
            </Typography>
            <Box
                sx={{
                display: "flex",
                alignItems: "center",
                pl: 1,
                }}
            >
                <Chip
                label="No Tags"
                size="small"
                sx={{
                    backgroundColor: "#f5f5f5",
                    color: "#1a1a1a",
                    mr: 1,
                    borderRadius: "4px",
                }}
                />
                <Button
                size="small"
                startIcon={<AddIcon sx={{ fontSize: "16px" }} />}
                sx={{
                    textTransform: "none",
                    fontSize: "14px",
                    p: 0,
                    minWidth: "auto",
                    "&:hover": {
                    backgroundColor: "transparent",
                    },
                }}
                >
                Add / Manage
                </Button>
            </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

            {/* Datastore Contacts Section */}
            <Box>
            <Typography
                variant="h6"
                sx={{
                fontSize: "16px",
                fontWeight: 600,
                mb: 2,
                }}
            >
                Datastore Contacts
            </Typography>
            <Box sx={{ pl: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                    size="small"
                    checked
                    sx={{
                    p: 0,
                    mr: 1,
                    color: "#1976d2",
                    }}
                />
                <Typography variant="body2">Phil Nardone</Typography>
                </Box>
            </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
            <Typography
                variant="h6"
                sx={{
                fontSize: "16px",
                fontWeight: 600,
                mb: 2,
                }}
            >
                Properties
            </Typography>

            <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

            <Typography
                variant="h6"
                sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
                color: "#5f6368",
                }}
            >
                Account
            </Typography>

            <Typography
                variant="h6"
                sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 4,
                }}
            >
                Stark (AWS)
            </Typography>

            <Typography
                variant="h6"
                sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
                color: "#5f6368",
                }}
            >
                Mounted On
            </Typography>

            <Typography
                variant="h6"
                sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 4,
                }}
            >
                Creeds Datastore
            </Typography>

            <Typography
                variant="h6"
                sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
                color: "#5f6368",
                }}
            >
                Datastore Type
            </Typography>

            <Typography
                variant="h6"
                sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 4,
                }}
            >
                S3 Bucket
            </Typography>

            <Typography
                variant="h6"
                sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
                color: "#5f6368",
                }}
            >
                Regions
            </Typography>

            <Typography
                variant="h6"
                sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 4,
                }}
            >
                us-east-1
            </Typography>

            <Typography
                variant="h6"
                sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
                color: "#5f6368",
                }}
            >
                Datastore size
            </Typography>

            <Typography
                variant="h6"
                sx={{
                fontSize: "15px",
                fontWeight: 600,
                mb: 4,
                }}
            >
                867GB
            </Typography>
            </Box>
        </Box>

        <Box
            sx={(theme) => ({
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            p: 3,
            //   backgroundColor: "#ffffff",
            backgroundColor:
                theme.palette.mode === "light"
                ? "#ffffff"
                : theme.palette.background.default,
            fontFamily: "Arial, sans-serif",
            color: theme.palette.text.primary,
            width: "700px",
            })}
        >
            <ClassifiedInfo />
        </Box>
        </Box>
);
}
