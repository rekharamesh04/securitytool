"use client";

import axiosInstance from "@/utils/axiosInstance";
import { getFetcher } from "@/utils/fetcher";
import {
  Box,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Paper,
  Tooltip,
  Alert,
  Button,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridSearchIcon,
  GridSortModel,
} from "@mui/x-data-grid";
import { useDialogs, useNotifications } from "@toolpad/core";
// import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { fetchUrl } from "./constant";
import theme from "@/theme/theme";
import DataSourceForm from "./form";
import { useCompanyContext } from "@/contexts/CompanyContext";

export default function DataSource() {
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [searchText, setSearchText] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { selectedCompany } = useCompanyContext();

  console.log(selectedCompany?._id)

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", (paginationModel.page + 1).toString());
    searchParams.append("limit", paginationModel.pageSize.toString());

    if (searchText) {
      searchParams.append("search", searchText);
    }

    if (sortModel?.[0]) {
      searchParams.append("sort", sortModel[0].field);
      searchParams.append("order", sortModel[0].sort ?? "");
    }

    // Add company filter if company is selected
    if (selectedCompany?._id) {
      // Convert _id to string explicitly
      searchParams.append("company", selectedCompany._id.toString());
    }


    return searchParams.toString(); // Return a string to use as a stable key
  }, [paginationModel, searchText, sortModel]);

  const { data, isLoading } = useSWR(
    `${fetchUrl}?${params.toString()}`,
    getFetcher
  );

  const handleAdd = async () => {
    const result = await dialogs.open((props) => (
      <DataSourceForm {...props} id="new" />
    ));
    if (result) {
      mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true });
    }
  };

  const filteredData = useMemo(() => {
    if (!data?.data || !selectedCompany?._id) return data;

    return {
      ...data,
      data: data.data.filter((item: any) =>
        item.company._id === selectedCompany._id.toString() // Compare nested _id
      ),
      total: data.data.filter((item: any) =>
        item.company._id === selectedCompany._id.toString()
      ).length
    };
  }, [data, selectedCompany?._id]);

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = await dialogs.confirm("Are you sure to delete this ?", {
        okText: "Yes",
        cancelText: "No",
      });

      if (confirmed) {
        try {
          const response = await axiosInstance.delete(`${fetchUrl}/${id}`);
          // Revalidate the data after deleting the category
          mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true }); //use stable key

          const { data } = response;
          notifications.show(data.message, { severity: "success" });
        } catch (err) {
          console.error("Failed to delete the data:", err);
        }
      }
    },
    [dialogs, notifications, params]
  );

  // Handle editing of a row
  const handleEdit = useCallback(
    async (id: string) => {
      const result = await dialogs.open((props) => (
        <DataSourceForm {...props} id={id} />
      ));
      if (result) {
        mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true });
      }
    },
    [dialogs, params]
  );


  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "DATASTORE",
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
        field: "account",
        headerName: "ACCOUNT",
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
          const sensitivity = row.sensitivity.toUpperCase() as 'RESTRICTED' | 'MEDIUM' | 'LOW' | 'CRITICAL' | 'NORMAL'; // Type assertion

          // Define color mapping for sensitivity types
          const colorMap: Record<'RESTRICTED' | 'MEDIUM' | 'LOW' | 'CRITICAL' | 'NORMAL', string> = {
            RESTRICTED: "#d32f2f",    // Red for High Sensitivity
            MEDIUM: "#ffa000",   // Orange for Medium Sensitivity
            LOW: "#388e3c",      // Green for Low Sensitivity
            CRITICAL: "#c2185b", // Pink for Critical Sensitivity
            NORMAL: "#1976d2",   // Blue for Normal Sensitivity
          };

          // Get the appropriate color based on sensitivity value
          const backgroundColor = colorMap[sensitivity] || "#9e9e9e";  // Default grey for unknown sensitivity
          const textColor = "#000"; // White text for contrast

          return (
            <Chip
              label={sensitivity}
              size="small"
              sx={{
                // fontWeight: 600,
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
      }
      ,
      {
        field: "sensitiveRecords",
        headerName: "SENSITIVE RECORDS",
        width: 170,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Typography  variant="body2" sx={{ paddingTop: 2 }}>
            {row.sensitive_records}
          </Typography>
        ),
      },
      {
        field: "data",
        headerName: "DATA",
        flex: 1,
        renderCell: (params) => {
          const items = params.row.data?.split(',') || [];

          // Color map for known tags
          const colorMap: Record<string, string> = {
            PERSONAL: "#3f51b5",    // Indigo
            FINANCIAL: "#009688",   // Teal
            HEALTH: "#e91e63",      // Pink
            LEGAL: "#ff9800",       // Orange
            INTERNAL: "#607d8b",    // Blue Grey
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
        field: "scanStatus",
        headerName: "STATUS",
        width: 150,
        renderCell: ({ row }) => {
          const status = row.scanStatus;
          const isScanned = status === "Scanned";

          return (
            <Button
              variant="contained"
              color={isScanned ? "success" : "warning"} // Color based on status
              sx={{
                minWidth: "100px", // Set a fixed width for consistency
                fontSize: "0.875rem",
                textTransform: "none",
              }}
              onClick={() => {
                // You can add custom logic for the button click, like editing the status
                console.log(`Clicked on status: ${status}`);
              }}
            >
              {status}
            </Button>
          );
        },
      },
      {
        field: "actions",
        headerName: "ACTIONS",
        width: 120,
        align: "center",
        renderCell: ({ row }) => (
          <Box display="flex" gap={0.5} sx={{ paddingTop: 2 }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleEdit(row._id)} size="small">
                <Icon fontSize="small">edit</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDelete(row._id)} size="small" color="error">
                <Icon fontSize="small">delete</Icon>
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [handleDelete, handleEdit, theme,selectedCompany]
  );

  if (!selectedCompany) return  <Alert severity="warning">
  Please Set Company Context
</Alert>;

  return (
    <Box pt={0} pb={0} px={3}>
       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography sx={{ fontSize: '1.5rem !important', flexGrow: 1,lineHeight: 1 }}>Company: {selectedCompany?.name}</Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", // 🔥 aligns inner Box to the end (right)
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: "999px",
            padding: "10px 15px",
            width: 350,
            boxShadow: `
                                  rgba(100, 134, 169, 0.18) 24px 17px 40px 4px,
                                  rgba(100, 134, 169, 0.15) -12px -10px 30px 2px  `,
            marginBottom: "10px",
          }}
        >
          <TextField
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="standard"
            fullWidth
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <GridSearchIcon sx={{ color: "black", fontSize: "20px" }} />
                </InputAdornment>
              ),
              sx: {
                fontSize: "1rem",
                color: "black",
                fontWeight: "500",
                fontFamily: "monospace",
              },
            }}
            sx={{
              background: "#edf3ff",
              borderRadius: "30px",
              padding: "3px 30px 3px 10px",
              maxWidth: "100%",
            }}
          />

          <IconButton
            color="primary"
            sx={{
              color: "white",
              background: "rgb(17, 4, 122)",
              marginLeft: "20px",
              padding: "8px",
              "&:hover": {
                background: "rgb(17, 4, 122)",
                color: "white", // 👈 Prevents color change
              },
            }}
            onClick={() => handleAdd()}
          >
            <Icon>add</Icon>
          </IconButton>
        </Box>
      </Box>
      </Box>

      <Paper
        sx={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredData?.data || []}
            columns={columns}
            rowCount={filteredData?.total || 0}
            loading={isLoading}
            paginationMode="server"
            sortingMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            getRowId={(row) => row._id}
            sx={{
              border: "solid 1px rgb(212, 212, 212)",
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              // This targets the entire header container
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f7f7f7", // Red background for header
                color: "black", // White text for better contrast
                fontSize: "14px",
              },
              // This targets individual header cells
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f7f7f7",
              },
              // This targets the header titles
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "black",
                fontWeight: "600",
              },
              // This targets the sort icon
              "& .MuiDataGrid-sortIcon": {
                color: "black",
              },
              // This targets the menu icon
              "& .MuiDataGrid-menuIcon": {
                color: "black",
              },
              // This targets the column separator
              "& .MuiDataGrid-columnSeparator": {
                color: "rgba(224, 224, 224, 1)",
              },
              "& .MuiDataGrid-columnHeader:focus-within": {
                outline: "none",
              },
            }}
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
