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
  Menu,
  MenuItem,
  Badge,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridSearchIcon,
  GridSortModel,
} from "@mui/x-data-grid";
import { useDialogs, useNotifications } from "@toolpad/core";
// import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { fetchUrl } from "./constant";
import theme from "@/theme/theme";
import DataSourceForm from "./form";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { useRouter } from "next/navigation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function DataSource() {
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { selectedCompany } = useCompanyContext();
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const router = useRouter();

  const [cloudProvider, setCloudProvider] = useState<string>("AWS");
  const [infrastructure, setInfrastructure] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<string>("");
  const [dataClass, setDataClass] = useState<string>("");
  const [identityName, setIdentityName] = useState<string>("");
  const [trustLevel, setTrustLevel] = useState<string>("");

  // Menu anchor states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFilter, setCurrentFilter] = useState<string>("");

  const handleFilterClick = (
    event: React.MouseEvent<HTMLElement>,
    filterName: string
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentFilter(filterName);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (value: string) => {
    switch (currentFilter) {
      case "Cloud Provider":
        setCloudProvider(value);
        break;
      case "Infrastructure":
        setInfrastructure(value);
        break;
      case "Account":
        setAccount(value);
        break;
      case "Scan Status":
        setScanStatus(value);
        break;
      case "Data Class":
        setDataClass(value);
        break;
      case "Identity Name":
        setIdentityName(value);
        break;
      case "Trust Level":
        setTrustLevel(value);
        break;
    }
    handleFilterClose();
  };

  const handleClearFilter = (filterName: string) => {
    switch (filterName) {
      case "Cloud Provider":
        setCloudProvider("");
        break;
      case "Infrastructure":
        setInfrastructure("");
        break;
      case "Account":
        setAccount("");
        break;
      case "Scan Status":
        setScanStatus("");
        break;
      case "Data Class":
        setDataClass("");
        break;
      case "Identity Name":
        setIdentityName("");
        break;
      case "Trust Level":
        setTrustLevel("");
        break;
    }
  };

  // Debounce search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", (paginationModel.page + 1).toString());
    searchParams.append("limit", paginationModel.pageSize.toString());

    if (debouncedSearchText) {
      searchParams.append("search", debouncedSearchText);
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

    // Add filter parameters
    if (cloudProvider) searchParams.append("cloudProvider", cloudProvider);
    if (infrastructure) searchParams.append("infrastructure", infrastructure);
    if (account) searchParams.append("account", account);
    if (scanStatus) searchParams.append("scanStatus", scanStatus);
    if (dataClass) searchParams.append("dataClass", dataClass);
    if (identityName) searchParams.append("identityName", identityName);
    if (trustLevel) searchParams.append("trustLevel", trustLevel);

    return searchParams.toString();
  }, [
    paginationModel,
    searchText,
    sortModel,
    selectedCompany?._id,
    cloudProvider,
    infrastructure,
    account,
    scanStatus,
    dataClass,
    identityName,
    trustLevel,
    debouncedSearchText,
  ]);

  const { data, isLoading } = useSWR(`${fetchUrl}?${params}`, getFetcher);
  const handleAdd = async () => {
    const result = await dialogs.open((props) => (
      <DataSourceForm {...props} id="new" />
    ));
    if (result) {
      mutate(`${fetchUrl}?${params}`, { revalidate: true });
    }
  };

  const filteredData = useMemo(() => {
    if (!data?.data || !selectedCompany?._id) return data;

    return {
      ...data,
      data: data.data.filter(
        (item: any) => item.company._id === selectedCompany._id.toString() // Compare nested _id
      ),
      total: data.data.filter(
        (item: any) => item.company._id === selectedCompany._id.toString()
      ).length,
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
          mutate(`${fetchUrl}?${params}`, { revalidate: true }); //use stable key

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
        mutate(`${fetchUrl}?${params}`, { revalidate: true });
      }
    },
    [dialogs, params]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Datastore",
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
        headerName: "Account",
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
        headerName: "Sensitivity",
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
      },
      {
        field: "sensitiveRecords",
        headerName: "Sensitive Records",
        width: 170,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Typography variant="body2">{row.sensitive_records}</Typography>
        ),
      },
      {
        field: "data",
        headerName: "DATA",
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
        field: "scanStatus",
        headerName: "SCAN STATUS",
        width: 150,
        renderCell: ({ row }) => {
          const status = row.scanStatus;
          const isScanned = status === "Scanned";

          return (
            <Button
              variant="contained"
              color={isScanned ? "success" : "warning"} // Keep green/yellow color based on status
              sx={{
                minWidth: "50px",
                fontSize: "0.875rem",
                textTransform: "none",
              }}
              onClick={() => {
                console.log(`Clicked on status: ${status}`);
              }}
            >
              Scan {/* Always show "Scan" */}
            </Button>
          );
        },
      },
      // {
      //   field: "actions",
      //   headerName: "Actions",
      //   width: 120,
      //   align: "center",
      //   renderCell: ({ row }) => (
      //     <Box display="flex" gap={0.5} sx={{ paddingTop: 2 }}>
      //       <Tooltip title="Edit">
      //         <IconButton onClick={() => handleEdit(row._id)} size="small">
      //           <Icon fontSize="small">edit</Icon>
      //         </IconButton>
      //       </Tooltip>
      //       <Tooltip title="Delete">
      //         <IconButton
      //           onClick={() => handleDelete(row._id)}
      //           size="small"
      //           color="error"
      //         >
      //           <Icon fontSize="small">delete</Icon>
      //         </IconButton>
      //       </Tooltip>
      //     </Box>
      //   ),
      // },
    ],
    [handleDelete, handleEdit, theme, selectedCompany]
  );

  const handleViewDetails = () => {
    router.push("/admin/company/data-source/details");
  };
  // Filter chip data
  const activeFilters = [
    { name: "Cloud Provider", value: cloudProvider },
    { name: "Infrastructure", value: infrastructure },
    { name: "Account", value: account },
    { name: "Scan Status", value: scanStatus },
    { name: "Data Class", value: dataClass },
    { name: "Identity Name", value: identityName },
    { name: "Trust Level", value: trustLevel },
  ].filter((filter) => filter.value);

  const filterCount = activeFilters.length;

  // Options for each filter (you can replace with your actual options)
  const filterOptions: Record<string, string[]> = {
    "Cloud Provider": ["AWS", "Azure", "GCP", "Alibaba Cloud"],
    Infrastructure: ["Production", "Development", "Staging", "Test"],
    Account: ["Account 1", "Account 2", "Account 3"],
    "Scan Status": ["Scanned", "Not Scanned", "In Progress", "Failed"],
    "Data Class": ["PII", "Financial", "Health", "Legal"],
    "Identity Name": ["User 1", "User 2", "Service Account"],
    "Trust Level": ["High", "Medium", "Low"],
  };

  const renderFilterMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleFilterClose}
      PaperProps={{
        style: {
          maxHeight: 300,
          width: "20ch",
        },
      }}
    >
      {filterOptions[currentFilter]?.map((option) => (
        <MenuItem key={option} onClick={() => handleFilterSelect(option)}>
          {option}
        </MenuItem>
      ))}
    </Menu>
  );

  const handleClearAllFilters = () => {
    setCloudProvider("");
    setInfrastructure("");
    setAccount("");
    setScanStatus("");
    setDataClass("");
    setIdentityName("");
    setTrustLevel("");
  };

  if (!selectedCompany)
    return <Alert severity="warning">Please Set Company Context</Alert>;

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
        {/* <Typography
          sx={{
            fontSize: "1.35rem !important",
            color: "#30312F !important",
            fontWeight: "600 !important",
            position: "relative",
            top: "2.5rem",
          }}
        >
          Company: {selectedCompany?.name}
        </Typography> */}

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
          p: 1.5,
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          alignItems: "center",
          borderRadius: "8px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Badge badgeContent={filterCount} color="primary" sx={{ mr: 1 }}>
          <FilterAltIcon color="action" />
        </Badge>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          {/* Filter buttons with dropdown indicators */}
          {[
            "Cloud Provider",
            "Infrastructure",
            "Account",
            "Scan Status",
            "Data Class",
            "Identity Name",
            "Trust Level",
          ].map((filter) => (
            <Button
              key={filter}
              variant="outlined"
              size="small"
              onClick={(e) => handleFilterClick(e, filter)}
              endIcon={<ArrowDropDownIcon />}
              sx={{
                textTransform: "none",
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "action.hover",
                },
              }}
            >
              {filter}
            </Button>
          ))}

          {filterCount > 0 && (
            <Button
              variant="text"
              size="small"
              startIcon={<FilterAltOffIcon fontSize="small" />}
              onClick={handleClearAllFilters}
              sx={{
                textTransform: "none",
                color: "text.secondary",
                ml: 1,
                "&:hover": {
                  color: "error.main",
                },
              }}
            >
              Clear all
            </Button>
          )}
        </Stack>

        {/* Active filter chips - shown in a separate row when space is limited */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mt: filterCount > 0 ? 1 : 0,
            width: "100%",
          }}
        >
          {activeFilters.map((filter) => (
            <Chip
              key={filter.name}
              label={`${filter.name}: ${filter.value}`}
              onDelete={() => handleClearFilter(filter.name)}
              sx={{
                borderRadius: "16px",
                backgroundColor: "action.selected",
                "& .MuiChip-deleteIcon": {
                  color: "text.secondary",
                  "&:hover": {
                    color: "error.main",
                  },
                },
              }}
            />
          ))}
        </Box>

        {renderFilterMenu()}
      </Paper>

      <Paper
        sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}
      >
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredData?.data || []}
            columns={columns}
            rowCount={filteredData?.total || 0}
            loading={isLoading}
            // ← here’s the checkbox column
            checkboxSelection
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(newModel) =>
              setRowSelectionModel(newModel)
            }
            onRowClick={() => handleViewDetails()}
            paginationMode="server"
            sortingMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            getRowId={(row) => row._id}
            sx={{
              border: "1px solid rgb(212,212,212)",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f7f7f7",
                color: "black",
                fontSize: "14px",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "black",
                fontWeight: 600,
              },
              "& .MuiCheckbox-root": {
                color: "#9e9e9e", // gray when unchecked
                "&.Mui-checked": {
                  color: "#1976d2", // gray when checked
                },
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
