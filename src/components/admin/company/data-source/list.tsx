"use client";

import axiosInstance from "@/utils/axiosInstance";
import { getFetcher } from "@/utils/fetcher";
import {
  Box,
  Chip,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  Paper,
  Button,
  Menu,
  MenuItem,
  Badge,
  Stack,
  Alert,
} from "@mui/material";
import {
  DataGrid,
  GridCloseIcon,
  GridColDef,
  GridRowSelectionModel,
  GridSearchIcon,
  GridSortModel,
} from "@mui/x-data-grid";
import { useDialogs, useNotifications } from "@toolpad/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import { fetchUrl } from "./constant";
import theme from "@/theme/theme";
import DataSourceForm from "./form";
import { useCompanyContext } from "@/contexts/CompanyContext";
import { useRouter } from "next/navigation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { alpha } from "@mui/system";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import ScanProgressDialog from "./scanProgressBar";

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

  const [cloudProvider, setCloudProvider] = useState<string>("");
  const [infrastructure, setInfrastructure] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<string>("");
  const [dataClass, setDataClass] = useState<string>("");
  const [identityName, setIdentityName] = useState<string>("");
  const [trustLevel, setTrustLevel] = useState<string>("");
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentlyScanningId, setCurrentlyScanningId] = useState<string | null>(
    null
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

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

    if (selectedCompany?._id) {
      searchParams.append("company", selectedCompany._id.toString());
    }

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
        (item: any) => item.company._id === selectedCompany._id.toString()
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
          mutate(`${fetchUrl}?${params}`, { revalidate: true });
          const { data } = response;
          notifications.show(data.message, { severity: "success" });
        } catch (err) {
          console.error("Failed to delete the data:", err);
        }
      }
    },
    [dialogs, notifications, params]
  );

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

  const handleScan = async (id: string) => {
    setCurrentlyScanningId(id);
    setScanProgress(0);
    setScanDialogOpen(true);

    // Start fake progress updates
    intervalRef.current = setInterval(() => {
      setScanProgress((prev) => {
        const next = Math.min(prev + 10, 100);
        if (next >= 100 && intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        return next;
      });
    }, 500);

    try {
      const response = await axiosInstance.post(
        `/admin/company/data-source/${id}/scan`
      );
      console.log(response);
      clearInterval(intervalRef.current!);
      setScanProgress(100);

      setTimeout(() => {
        setScanDialogOpen(false);
        setCurrentlyScanningId(null);
      }, 800);

      mutate(`${fetchUrl}?${params}`, { revalidate: true });

      notifications.show(response.data.message || "Scan completed successfully", {
        severity: "success",
      });
    } catch (error: any) {
      clearInterval(intervalRef.current!);
      setScanDialogOpen(false);
      setCurrentlyScanningId(null);

      notifications.show(error?.response?.data?.message || "Scan failed", {
        severity: "error",
      });
    }
  };



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
            sx={{
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              px: 1,
              height: 28,
              letterSpacing: 0.5,
              backgroundColor: 'white',
              color: '#1a237e',
              border: '1px solid #c5cae9',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#e8eaf6',
              },
            }}
          />
        ),
      },
      {
        field: "dataSensitivity",
        headerName: "SENSITIVITY",
        width: 150,
        renderCell: ({ row }) => {
          const sensitivity = row.sensitivity?.toUpperCase() as
            | "RESTRICTED"
            | "confidential"
            | "internal"
            | "public";

          const colorMap: Record<
            "RESTRICTED" | "confidential" | "internal" | "public",
            string
          > = {
           RESTRICTED: "#ff3d3d",
            confidential: "#ffa000",
            internal: "#388e3c",
            public: "#c2185b",
          };

          const backgroundColor = colorMap[sensitivity] || "#9e9e9e";

          return (
            <Chip
              label={sensitivity}
              size="small"
              sx={{
                letterSpacing: 0.5,
                borderRadius: "6px",
                // color: textColor,
                backgroundColor: `${backgroundColor}30`,
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
        headerName: "SENSITIVE RECORDS",
        width: 170,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => {
          if (!row.latestScan) {
            return <Typography variant="body2">0</Typography>;
          }

          const total = row.latestScan.summary?.total_sensitive_items ?? 0;

          return (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2">{total}</Typography>
            </Box>
          );
        },
      },
      {
        field: "data",
        headerName: "DATA",
        flex: 1,
        renderCell: (params) => {
          // Get the categories from the by_category object
          const categories = params.row.latestScan?.summary?.by_category
            ? Object.keys(params.row.latestScan.summary.by_category)
            : [];

          const colorMap: Record<string, string> = {
            PERSONAL: "#3f51b5",
            FINANCIAL: "#009688",
            HEALTH: "#e91e63",
            LEGAL: "#ff9800",
            INTERNAL: "#607d8b",
          };

          return (
            <Box
              display="grid"
              gridTemplateColumns="repeat(2, max-content)"
              gap={1}
              sx={{ paddingTop: 2 }}
            >
              {categories.map((category: string, index: number) => {
                const label = category.trim().toUpperCase();
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
                      backgroundColor: `${baseColor}20`,
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
        width: 160,
        renderCell: ({ row }) => {
          const status = row.scanStatus;
          const isScanned = status === "Scanned";
          const isScanning = currentlyScanningId === row._id;

          return (
            <Button
              variant="outlined"
              color={isScanned ? "success" : "inherit"}
              onClick={() => handleScan(row._id)}
              disabled={isScanning}
              sx={{
                px: 2,
                py: 0.5,
                fontWeight: 500,
                fontSize: "0.75rem",
                borderRadius: "5px",
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed",
                },
              }}
            >
              {isScanning ? "Scanning..." : isScanned ? "Rescan" : "Scan"}
            </Button>
          );
        },
      },
    ],
    [handleDelete, handleEdit, theme, selectedCompany]
  );

  const handleViewDetails = () => {
    router.push("/admin/company/data-source/dataDetails");
  };

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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          gap={2}
          sx={{ ml: "auto" }}
        >
          <TextField
            placeholder="Search data sources..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GridSearchIcon
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                      fontSize: "22px",
                      filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
                      "input:focus ~ &": {
                        transform: "scale(1.15) rotate(5deg)",
                        color: (theme) => theme.palette.primary.dark,
                      },
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <GridCloseIcon
                      fontSize="small"
                      sx={{
                        color: (theme) => theme.palette.primary.main,
                        cursor: "pointer",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                      onClick={() => setSearchText("")}
                    />
                  </Box>
                </InputAdornment>
              ),
              sx: (theme) => ({
                borderRadius: "30px",
                background: `
        linear-gradient(
          to right,
          ${alpha(theme.palette.primary.light, 0.12)},
          ${alpha(theme.palette.background.paper, 0.8)}
        )
      `,
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                width: "137px",
                height: "42px",
                backdropFilter: "blur(8px)",
                border: `1px solid ${alpha(theme.palette.primary.dark, 0.3)}`,
                boxShadow: `0 2px 12px ${alpha(theme.palette.primary.dark, 0.05)}`,
                overflow: "hidden",

                "&.Mui-focused": {
                  width: "280px",
                  background: `
          linear-gradient(
            to right,
            ${alpha(theme.palette.primary.light, 0.2)},
            ${alpha(theme.palette.background.paper, 0.9)}
          )
        `,
                  boxShadow: `0 4px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  "& .MuiSvgIcon-root": {
                    transform: "scale(1.15) rotate(5deg)",
                    color: theme.palette.primary.dark,
                  },
                },

                "&:hover": {
                  background: `
          linear-gradient(
            to right,
            ${alpha(theme.palette.primary.light, 0.18)},
            ${alpha(theme.palette.background.paper, 0.85)}
          )
        `,
                  borderColor: alpha(theme.palette.primary.main, 0.6),
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }),
            }}
            sx={{
              mr: 1,
              position: "relative",
              "& .MuiInputBase-input": {
                py: 1.2,
                px: 0,
                fontSize: "0.95rem",
                fontWeight: 500,
                color: (theme) => theme.palette.text.primary,
                transition: "all 0.4s ease",
                "&::placeholder": {
                  opacity: 0.7,
                  color: (theme) => theme.palette.primary.dark,
                  fontStyle: "normal",
                  letterSpacing: "0.3px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "calc(100% - 40px)",
                  display: "inline-block",
                  verticalAlign: "middle",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                },
                "input:not(:focus)::placeholder": {
                  content: '"Search..."',
                  maxWidth: "60px",
                },
              },
              "&:hover .MuiInputBase-input::placeholder": {
                opacity: 0.9,
              },
              "&.Mui-focused .MuiInputBase-input::placeholder": {
                opacity: 0.5,
                maxWidth: "200px",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "0%",
                height: "2px",
                backgroundColor: (theme) => theme.palette.primary.main,
                transition: "width 0.4s ease",
              },
              "&.Mui-focused::after": {
                width: "80%",
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              textTransform: "none",

            }}
          >
            Add
          </Button>

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              px: 2,
              py: 1,
              borderColor: (theme) => theme.palette.divider,
              "&:hover": {
                borderColor: (theme) => theme.palette.primary.main,
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            Filters {filterCount > 0 ? `(${filterCount})` : ""}
          </Button>

          {filterCount > 0 && (
            <Button
              variant="text"
              color="error"
              onClick={handleClearAllFilters}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              Clear All
            </Button>
          )}

          <Button
            variant="outlined"
            onClick={handleViewDetails}

          >
            Columns
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => console.log("Downloading...")}

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
        <Badge badgeContent={filterCount} color="primary" sx={{ mr: 1 }}>
          <FilterAltIcon color="action" />
        </Badge>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
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
              sx={(theme) => ({
                textTransform: "none",
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                borderRadius: "6px",
                px: 1.5,
                py: 0.5,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.action.hover,
                },
              })}
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
              sx={(theme) => ({
                textTransform: "none",
                color: theme.palette.text.secondary,
                ml: 1,
                "&:hover": {
                  color: theme.palette.error.main,
                },
              })}
            >
              Clear all
            </Button>
          )}
        </Stack>

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
              sx={(theme) => ({
                borderRadius: "16px",
                backgroundColor: theme.palette.action.selected,
                "& .MuiChip-deleteIcon": {
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.error.main,
                  },
                },
              })}
            />
          ))}
        </Box>

        {renderFilterMenu()}
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
            rows={filteredData?.data || []}
            columns={columns}
            rowCount={filteredData?.total || 0}
            loading={isLoading}
            checkboxSelection
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(newModel) =>
              setRowSelectionModel(newModel)
            }
            // onRowClick={() => handleViewDetails()}
            paginationMode="server"
            sortingMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            getRowId={(row) => row._id}
            sx={(theme) => ({
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "#f7f7f7"
                    : theme.palette.background.default,
                color: theme.palette.text.primary,
                fontSize: "14px",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "#f0f0f0"
                    : theme.palette.background.default,
                color: "#424242",
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
              // Fix for selected row styles interfering with Chip
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "transparent", // Remove default selected background
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)", // Optional: Slight hover effect
                },
              },
              "& .MuiDataGrid-cell.Mui-selected": {
                borderColor: "transparent", // Remove cell selection border
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
      <ScanProgressDialog open={scanDialogOpen} progress={scanProgress} />
    </Box>
  );
}
