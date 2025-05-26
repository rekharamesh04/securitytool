"use client";

import {
  Box,
  Chip,
  CircularProgress,
  Typography,
  Paper,
  Button,
  Menu,
  MenuItem,
  Badge,
  Stack,
  InputAdornment,
  TextField,
  keyframes,
} from "@mui/material";
import { DataGrid, GridColDef, GridSortModel, GridSearchIcon, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import axiosInstance from '@/utils/axiosInstance';
import { useCompanyAuth } from "@/contexts/CompanyAuthContext";
import { useRouter } from "next/navigation";
import {
  FilterAlt as FilterAltIcon,
  FilterAltOff as FilterAltOffIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";

// Animation keyframes (removed unused pulse as per request)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface DataSource {
  _id: string;
  company: {
    _id: string;
    name: string;
  };
  datastore: string;
  account: string;
  sensitivity: string;
  sensitive_records: string;
  data: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
  engine?: string;
  scanStatus?: string;
}

const fetcher = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dataSourceData', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error: any) {
    console.error("Fetcher error:", error.response?.data || error.message);
    throw error;
  }
};

const CompanyDataSource = () => {
  const { user } = useCompanyAuth();
  const companyId = user?.company?._id;
  const router = useRouter();
  const theme = useTheme();

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [cloudProvider, setCloudProvider] = useState<string>("");
  const [infrastructure, setInfrastructure] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<string>("");
  const [dataClass, setDataClass] = useState<string>("");
  const [identityName, setIdentityName] = useState<string>("");
  const [trustLevel, setTrustLevel] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Debounce search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  const handleFilterClick = useCallback((
    event: React.MouseEvent<HTMLElement>,
    filterName: string
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentFilter(filterName);
  }, []);

  const handleFilterClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleFilterSelect = useCallback((value: string) => {
    switch (currentFilter) {
      case "Cloud Provider": setCloudProvider(value); break;
      case "Infrastructure": setInfrastructure(value); break;
      case "Account": setAccount(value); break;
      case "Scan Status": setScanStatus(value); break;
      case "Data Class": setDataClass(value); break;
      case "Identity Name": setIdentityName(value); break;
      case "Trust Level": setTrustLevel(value); break;
    }
    handleFilterClose();
  }, [currentFilter, handleFilterClose]);

  const handleClearFilter = useCallback((filterName: string) => {
    switch (filterName) {
      case "Cloud Provider": setCloudProvider(""); break;
      case "Infrastructure": setInfrastructure(""); break;
      case "Account": setAccount(""); break;
      case "Scan Status": setScanStatus(""); break;
      case "Data Class": setDataClass(""); break;
      case "Identity Name": setIdentityName(""); break;
      case "Trust Level": setTrustLevel(""); break;
    }
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setCloudProvider("");
    setInfrastructure("");
    setAccount("");
    setScanStatus("");
    setDataClass("");
    setIdentityName("");
    setTrustLevel("");
  }, []);

  const handleScanButtonClick = useCallback((id: string) => {
    router.push(`/company/data-source/dataDetails/${id}`);
  }, [router]);

  const columns: GridColDef<DataSource>[] = useMemo(
    () => [
      {
        field: "datastore",
        headerName: "DATASTORE",
        flex: 1.2,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '8px 0'
          }}>
            <Typography fontWeight={600} variant="body2" textAlign="center">
              {row.datastore}
            </Typography>
            {row.engine && (
              <Typography variant="caption" color="text.secondary" textAlign="center">
                {row.engine}
              </Typography>
            )}
          </Box>
        ),
      },
      {
        field: "account",
        headerName: "ACCOUNT",
        flex: 1,
        minWidth: 200,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}>
            <Chip
              label={row.account}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 1 }}
            />
          </Box>
        ),
      },
      {
        field: "sensitivity",
        headerName: "SENSITIVITY",
        width: 150,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => {
          const sensitivity = row.sensitivity.toUpperCase() as
            | "RESTRICTED"
            | "MEDIUM"
            | "LOW"
            | "CRITICAL"
            | "NORMAL";
          const colorMap: Record<
            "RESTRICTED" | "MEDIUM" | "LOW" | "CRITICAL" | "NORMAL",
            string
          > = {
            RESTRICTED: "#d32f2f",
            MEDIUM: "#ffa000",
            LOW: "#388e3c",
            CRITICAL: "#c2185b",
            NORMAL: "#1976d2",
          };
          const backgroundColor = colorMap[sensitivity] || "#9e9e9e";
          const textColor = theme.palette.mode === 'light' ? '#000' : '#fff';
          return (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}>
              <Chip
                label={sensitivity}
                size="small"
                sx={{
                  letterSpacing: 0.5,
                  borderRadius: "6px",
                  color: textColor,
                  backgroundColor: `${backgroundColor}30`,
                  border: `1px solid ${backgroundColor}`,
                  height: "24px",
                  padding: "0 10px",
                }}
              />
            </Box>
          );
        },
      },
      {
        field: "sensitive_records",
        headerName: "SENSITIVE RECORDS",
        width: 170,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}>
            <Typography variant="body2">{row.sensitive_records}</Typography>
          </Box>
        ),
      },
      {
        field: "data",
        headerName: "DATA",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const items = params.row.data?.split(",") || [];
          const colorMap: Record<string, string> = {
            PERSONAL: "#3f51b5",
            FINANCIAL: "#009688",
            HEALTH: "#e91e63",
            LEGAL: "#ff9800",
            INTERNAL: "#607d8b",
          };
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: 1,
                flexWrap: 'wrap',
                padding: '8px 0'
              }}
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
                      backgroundColor: `${baseColor}20`,
                      border: `1px solid ${baseColor}`,
                      height: "24px",
                      padding: "0 10px",
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
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => {
          const status = row.scanStatus;
          const isScanned = status === "Scanned";
          return (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}>
              <Button
                variant="outlined"
                color={isScanned ? "success" : "inherit"}
                onClick={() => handleScanButtonClick(row._id)}
                sx={{
                  px: 2,
                  py: 0.5,
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  borderRadius: "20px",
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                }}
              >
                {isScanned ? "Rescan" : "Scan"}
              </Button>
            </Box>
          );
        },
      },
    ],
    [theme, handleScanButtonClick]
  );

  const backendFetchUrl = '/company/data-sources';

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", (paginationModel.page + 1).toString());
    searchParams.append("limit", paginationModel.pageSize.toString());

    if (debouncedSearchText) searchParams.append("search", debouncedSearchText);
    if (sortModel?.[0]) {
      searchParams.append("sort", sortModel[0].field);
      searchParams.append("order", sortModel[0].sort ?? "");
    }
    if (companyId) searchParams.append("company", companyId);
    else return null;

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
    companyId,
    cloudProvider,
    infrastructure,
    account,
    scanStatus,
    dataClass,
    identityName,
    trustLevel,
    debouncedSearchText,
    sortModel,
  ]);

  const { data, isLoading, error } = useSWR<{
    data: DataSource[];
    total: number;
  }>(params ? `${backendFetchUrl}?${params}` : null, fetcher);

  const [localDataSources, setLocalDataSources] = useState<DataSource[]>([]);

  useEffect(() => {
    if (!isLoading && !error && (!data?.data || data.data.length === 0) && typeof window !== 'undefined') {
      const storedData = localStorage.getItem('dataSourceData');
      if (storedData) {
        try {
          setLocalDataSources(JSON.parse(storedData));
        } catch (e) {
          console.error("Failed to parse data from local storage:", e);
          localStorage.removeItem('dataSourceData');
        }
      }
    } else if (data?.data && data.data.length > 0) {
      setLocalDataSources(data.data);
    }
  }, [data, isLoading, error]);

  const displayData = data?.data || localDataSources || [];
  const total = data?.total || localDataSources?.length || 0;

  const handleViewDetails = useCallback(() => {
    router.push("/company/data-source/dataDetails");
  }, [router]);

  const activeFilters = useMemo(() => [
    { name: "Cloud Provider", value: cloudProvider },
    { name: "Infrastructure", value: infrastructure },
    { name: "Account", value: account },
    { name: "Scan Status", value: scanStatus },
    { name: "Data Class", value: dataClass },
    { name: "Identity Name", value: identityName },
    { name: "Trust Level", value: trustLevel },
  ].filter((filter) => filter.value), [
    cloudProvider,
    infrastructure,
    account,
    scanStatus,
    dataClass,
    identityName,
    trustLevel,
  ]);

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

  const renderFilterMenu = useCallback(() => (
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
  ), [anchorEl, handleFilterClose, currentFilter, handleFilterSelect, filterOptions]);

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography color="error">
          Failed to load data: {error.message}. Please check your network and backend server.
          {typeof window !== 'undefined' && localStorage.getItem('dataSourceData') && (
            <Typography variant="body2" mt={2}>
              Displaying cached data from previous session.
            </Typography>
          )}
        </Typography>
      </Box>
    );
  }

  // Define a consistent style for decent button animations
  const decentButtonStyles = {
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[6], // A more pronounced shadow on hover
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: theme.shadows[2], // Reset shadow on click
    }
  };

  return (
    <Box pt={0} pb={0} px={3} sx={{
      animation: isMounted ? `${fadeIn} 0.5s ease-out` : 'none',
      opacity: isMounted ? 1 : 0
    }}>
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
                    <GridSearchIcon
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
            startIcon={<FilterAltIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              ...decentButtonStyles,
              textTransform: "none",
              borderRadius: "8px",
              px: 2,
              py: 1,
              backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
              color: theme.palette.primary.contrastText,
            }}
          >
            Filters {filterCount > 0 ? `(${filterCount})` : ""}
          </Button>

          {filterCount > 0 && (
            <Button
              variant="contained"
              color="error"
              onClick={handleClearAllFilters}
              sx={{
                ...decentButtonStyles,
                textTransform: "none",
                borderRadius: "8px",
                px: 2,
                py: 1,
                backgroundColor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
              }}
            >
              Clear All
            </Button>
          )}

          <Button
            variant="contained"
            onClick={handleViewDetails}
            sx={{
              ...decentButtonStyles,
              textTransform: "none",
              borderRadius: "8px",
              px: 2,
              py: 1,
              backgroundColor: theme.palette.mode === 'light' ? theme.palette.info.main : theme.palette.info.dark,
              color: theme.palette.info.contrastText,
            }}
          >
            Columns
          </Button>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => console.log("Downloading...")}
            sx={{
              ...decentButtonStyles,
              textTransform: "none",
              borderRadius: "8px",
              px: 2,
              py: 1,
              backgroundColor: theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark,
              color: theme.palette.success.contrastText,
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
          borderRadius: "12px",
          boxShadow: theme.shadows[4], // Decent shadow
          border: theme.palette.mode === 'light' ? '1px solid #e0e0e0' : '1px solid #424242', // Decent gray borders
          backgroundColor: theme.palette.background.paper,
          transition: 'all 0.3s ease-in-out', // Smooth transition for hover effects
          '&:hover': {
            boxShadow: theme.shadows[6], // Subtle elevation on hover
          }
        })}
      >
        <Badge
          badgeContent={filterCount}
          color="primary"
          sx={{
            mr: 1,
            '& .MuiBadge-badge': {
              right: -3,
              top: 13,
              border: `2px solid ${theme.palette.background.paper}`,
              padding: '0 4px',
            }
          }}
        >
          <FilterAltIcon
            sx={{
              color: theme.palette.action.active, // Using action.active for a neutral color
              fontSize: '1.8rem'
            }}
          />
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
                borderRadius: "8px",
                px: 1.5,
                py: 0.5,
                // Decent gray border based on mode
                borderColor: theme.palette.mode === 'light' ? '#bdbdbd' : '#9e9e9e',
                color: theme.palette.text.primary,
                transition: 'all 0.3s ease-in-out', // Smooth transition
                '&:hover': {
                  borderColor: theme.palette.mode === 'light' ? '#757575' : '#e0e0e0', // Darker/lighter gray on hover
                  backgroundColor: alpha(theme.palette.action.hover, 0.5), // Subtle background on hover
                  transform: 'translateY(-1px)', // Slight lift
                },
                minWidth: '120px',
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
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  color: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                  transform: 'translateY(-1px)',
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
          boxShadow: theme.shadows[4],
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px',
          border: 'none',
          animation: isMounted ? `${fadeIn} 0.7s ease-out` : 'none',
          opacity: isMounted ? 1 : 0,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[6],
          }
        })}
      >
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={displayData}
            columns={columns}
            rowCount={total}
            loading={isLoading}
            checkboxSelection
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(newModel) => setRowSelectionModel(newModel)}
            onRowClick={() => handleViewDetails()}
            paginationMode="server"
            sortingMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            getRowId={(row) => row._id}
            sx={(theme) => ({
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.paper, // Changed to match paper for consistent look
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
                color: theme.palette.mode === 'light' ? '#000' : '#fff', // Black for light, white for dark
              },
              '& .MuiDataGrid-columnHeader': {
                '&:focus, &:focus-within': {
                  outline: 'none',
                },
              },
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:focus, &:focus-within': {
                  outline: 'none',
                },
              },
              '& .MuiDataGrid-row': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  },
                },
              },
              '& .MuiDataGrid-virtualScroller': {
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: theme.palette.mode === 'light' ? '#f1f1f1' : '#2a2a2a',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
                  borderRadius: '4px',
                },
              },
              '& .MuiCheckbox-root': {
                color: theme.palette.text.secondary,
                '&.Mui-checked': {
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
                  sx={{
                    background: alpha(theme.palette.background.paper, 0.8),
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              ),
              noRowsOverlay: () => (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  color="text.secondary"
                  sx={{
                    background: alpha(theme.palette.background.paper, 0.8),
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    No data sources found
                  </Typography>
                  <Typography variant="body2">
                    Try adjusting your filters or search query
                  </Typography>
                </Box>
              ),
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CompanyDataSource;