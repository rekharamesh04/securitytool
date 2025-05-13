"use client";
import theme from "@/theme/theme";
import { Box, Typography, TextField, InputAdornment, Button, Paper, Badge, Stack, CircularProgress } from "@mui/material";
import { Chip } from "@mui/material";
import { useMemo } from "react";
import {
    DataGrid,
    GridColDef,
    GridSearchIcon,
  } from "@mui/x-data-grid";
import { alpha } from "@mui/system";
import DownloadIcon from "@mui/icons-material/Download";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function ClassifiedDataTab() {

        const columns: GridColDef[] = useMemo(
            () => [
            {
                field: "name",
                headerName: "FILE",
                flex: 1.2,
                minWidth: 200,
                renderCell: ({ row }) => (
                <Box sx={{ paddingTop: 2 }}>
                    <Typography fontWeight={600} variant="body2">
                    {row.datastore}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                    {row.engine}
                    </Typography>
                </Box>
                ),
            },
            {
                field: "sensitiveRecords",
                headerName: "SENSITIVE RECORDS",
                width: 170,
                align: "center",
                headerAlign: "center",
                renderCell: ({ row }) => (
                <Typography variant="body2">{row.sensitive_records}</Typography>
                ),
            },
            {
                field: "account",
                headerName: "SIZE",
                flex: 1,
                minWidth: 200,
                renderCell: ({ row }) => (
                <Chip
                    label={row.account}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 1 }}
                />
                ),
            },
            {
                field: "dataSensitivity",
                headerName: "SENSITIVITY",
                width: 150,
                renderCell: ({ row }) => {
                const sensitivity = row.sensitivity.toUpperCase() as
                    | "RESTRICTED"
                    | "MEDIUM"
                    | "LOW"
                    | "CRITICAL"
                    | "NORMAL"; // Type assertion

                // Define color mapping for sensitivity types
                const colorMap: Record<
                    "RESTRICTED" | "MEDIUM" | "LOW" | "CRITICAL" | "NORMAL",
                    string
                > = {
                    RESTRICTED: "#d32f2f", // Red for High Sensitivity
                    MEDIUM: "#ffa000", // Orange for Medium Sensitivity
                    LOW: "#388e3c", // Green for Low Sensitivity
                    CRITICAL: "#c2185b", // Pink for Critical Sensitivity
                    NORMAL: "#1976d2", // Blue for Normal Sensitivity
                };

                // Get the appropriate color based on sensitivity value
                const backgroundColor = colorMap[sensitivity] || "#9e9e9e"; // Default grey for unknown sensitivity
                const textColor = "#000"; // White text for contrast

                return (
                    <Chip
                    label={sensitivity}
                    size="small"
                    sx={{
                        letterSpacing: 0.5,
                        borderRadius: "6px",
                        color: textColor,
                        backgroundColor: `${backgroundColor}30`, // 50% opacity for background
                        border: `1px solid ${backgroundColor}`,
                        height: "24px",
                        padding: "0 10px",
                    }}
                    />
                );
                },
            },
            {
                field: "data2",
                headerName: "DATA CONTEXT",
                flex: 1,
                renderCell: (params) => {
                const items = params.row.data?.split(",") || [];

                // Color map for known tags
                const colorMap: Record<string, string> = {
                    PERSONAL: "#3f51b5", // Indigo
                    FINANCIAL: "#009688", // Teal
                    HEALTH: "#e91e63", // Pink
                    LEGAL: "#ff9800", // Orange
                    INTERNAL: "#607d8b", // Blue Grey
                };

                return (
                    <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, max-content)"
                    gap={1}
                    sx={{ paddingTop: 2 }}
                    >
                    {items.map((item: string, index: number) => {
                        const label = item.trim().toUpperCase();
                        const baseColor = colorMap[label] || "#616161";

                        return (
                        <Chip
                            key={index}
                            label={label}
                            size="small"
                            sx={{
                            fontWeight: 600,
                            letterSpacing: 0.5,
                            borderRadius: "6px",
                            color: baseColor,
                            backgroundColor: `${baseColor}20`, // ~12.5% opacity
                            border: `1px solid ${baseColor}`,
                            height: "24px",
                            }}
                        />
                        );
                    })}
                    </Box>
                );
                },
            },
            {
                field: "data",
                headerName: "DATA FOUND",
                flex: 1,
                renderCell: (params) => {
                const items = params.row.data?.split(",") || [];

                // Color map for known tags
                const colorMap: Record<string, string> = {
                    PERSONAL: "#3f51b5", // Indigo
                    FINANCIAL: "#009688", // Teal
                    HEALTH: "#e91e63", // Pink
                    LEGAL: "#ff9800", // Orange
                    INTERNAL: "#607d8b", // Blue Grey
                };

                return (
                    <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, max-content)"
                    gap={1}
                    sx={{ paddingTop: 2 }}
                    >
                    {items.map((item: string, index: number) => {
                        const label = item.trim().toUpperCase();
                        const baseColor = colorMap[label] || "#616161";

                        return (
                        <Chip
                            key={index}
                            label={label}
                            size="small"
                            sx={{
                            fontWeight: 600,
                            letterSpacing: 0.5,
                            borderRadius: "6px",
                            color: baseColor,
                            backgroundColor: `${baseColor}20`, // ~12.5% opacity
                            border: `1px solid ${baseColor}`,
                            height: "24px",
                            }}
                        />
                        );
                    })}
                    </Box>
                );
                },
            },
            ],
            [theme ]
        );

        return (
            <Box pt={0} pb={0} px={3}>
            <Box
                sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                }}
            >

        <Box display="flex"
                alignItems="center"
                justifyContent="flex-end"
                gap={1}
                sx={{ ml: "auto" }}>

                <TextField
                    placeholder="Search..."
                    // value={searchText}
                    // onChange={(e) => setSearchText(e.target.value)}
                    variant="standard"
                    fullWidth
                    InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                        <InputAdornment position="start">
                        <GridSearchIcon sx={(theme) => ({
                            color: theme.palette.text.primary,
                            fontSize: "20px"
                        })} />
                        </InputAdornment>
                    ),
                    sx: (theme) => ({
                        fontSize: "1rem",
                        color: theme.palette.text.primary,
                        fontWeight: "500",
                        fontFamily: "monospace",
                    }),
                    }}
                    sx={(theme) => ({
                    background: alpha(theme.palette.primary.light, 0.1),
                    borderRadius: "30px",
                    padding: "3px 30px 3px 10px",
                    maxWidth: "100px",
                    })}
                />

                <Button
                    variant="outlined"
                    // onClick={handleViewDetails}
                    sx={{ textTransform: "none" }}
                >
                    Columns
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                    // Add your download logic here
                    console.log("Downloading...");
                    }}
                >
                    Export CSV
                </Button>
                </Box>
            </Box>


            <Paper
                sx={(theme) => ({
                p: 1.5,
                mb: 3,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "center",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid rgb(212,212,212)",
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                })}
            >
                <Badge color="primary" sx={{ mr: 1 }}>
                <FilterAltIcon color="action" />
                </Badge>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                {/* Filter buttons with dropdown indicators */}
                {[
                    'Sensitivity',
                    'Data Context',
                    "Data Class",
                    "Identity Name",
                    "Trust Level",
                ].map((filter) => (
                    <Button
                    key={filter}
                    variant="outlined"
                    size="small"
                    // onClick={(e) => handleFilterClick(e, filter)}
                    endIcon={<ArrowDropDownIcon />}
                    sx={(theme) => ({
                        textTransform: "none",
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                        "&:hover": {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.action.hover,
                        },
                    })}
                    >
                    {filter}
                    </Button>
                ))}</Stack>


            </Paper>

            <Paper
                sx={(theme) => ({
                boxShadow: theme.shadows[2],
                overflow: "hidden",
                backgroundColor: theme.palette.background.paper,
                })}
            >
                <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                    columns={columns}
                    paginationMode="server"
                    sortingMode="server"
                    // paginationModel={paginationModel}
                    // onPaginationModelChange={setPaginationModel}
                    // onSortModelChange={setSortModel}
                    getRowId={(row) => row._id}
                    sx={(theme) => ({
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[1],
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.mode === 'light' ? '#f7f7f7' : theme.palette.background.default,
                        color: theme.palette.text.primary,
                        fontSize: "14px",
                    },
                    // ✅ Grey header cell background (stronger selector)
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: theme.palette.mode === 'light' ? '#f0f0f0' : theme.palette.background.default,
                        color: "#424242", // Grey text color
                        fontWeight: "600",
                    },

                    "& .MuiDataGrid-columnHeaderTitle": {
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                    },
                    "& .MuiCheckbox-root": {
                        color: theme.palette.text.secondary,
                        "&.Mui-checked": {
                        color: theme.palette.primary.main,
                        },
                    },
                    })}
                    slots={{
                    loadingOverlay: () => (
                        <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        >
                        <CircularProgress size={24} />
                        </Box>
                    ),
                    noRowsOverlay: () => (
                        <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        color="text.secondary"
                        >
                        No locations found
                        </Box>
                    ),
                    }}
                />
                </Box>
            </Paper>
            </Box>
        );
    }