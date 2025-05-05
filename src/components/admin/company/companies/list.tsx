"use client";

import axiosInstance from "@/utils/axiosInstance";
import { getFetcher } from "@/utils/fetcher";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
  alpha,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridSearchIcon,
  GridSortModel,
} from "@mui/x-data-grid";
import { useDialogs, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { fetchUrl } from "./constant";
import CompanyForm from "./form";
import { useCompanyContext } from "@/contexts/CompanyContext";

interface Company {
  _id: number;
  name: string;
  // Add other fields if needed
}

export default function CompanyList() {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const { setSelectedCompany } = useCompanyContext();

  // Debounce search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const dialogs = useDialogs();

  const notifications = useNotifications();
  // Build the query string for pagination, sorting, and search
  // Memoized params object
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

    return searchParams.toString(); // Return a string to use as a stable key
  }, [paginationModel, debouncedSearchText, sortModel]);
  // Fetch data with SWR
  const { data, error, isLoading } = useSWR(
    `${fetchUrl}?${params}`,
    getFetcher
  );

  useEffect(() => {
    if (error && error.status == 403) {
      router.push("/forbidden");
    }
  }, [error, router]);

  // Handle deletion of a row
  const handleDelete = useCallback(
    async (id: number) => {
      const confirmed = await dialogs.confirm("Are you sure to delete this ?", {
        okText: "Yes",
        cancelText: "No",
      });

      if (confirmed) {
        try {
          const response = await axiosInstance.delete(`${fetchUrl}/${id}`);
          // Revalidate the data after deleting the category
          mutate(`${fetchUrl}?${params}`, { revalidate: true });

          const { data } = response;
          notifications.show(data.message, { severity: "success" });
        } catch (err) {
          console.error("Failed to delete the data:", err);
        }
      }
    },
    [notifications, dialogs, params]
  );

  // Handle editing of a row
  const handleEdit = useCallback(
    async (id: number) => {
      const result = await dialogs.open((props) => (
        <CompanyForm {...props} id={id} />
      ));
      if (result) {
        mutate(`${fetchUrl}?${params}`, { revalidate: true });
      }
    },
    [dialogs, params]
  );

  // Handle new
  const handleAdd = async () => {
    const result = await dialogs.open((props) => (
      <CompanyForm {...props} id="new" />
    ));
    if (result) {
      mutate(`${fetchUrl}?${params}`, { revalidate: true });
    }
  };

  const handleSetContext = useCallback(
    (company: Company) => {
      console.log("Set context for:", company);
      setSelectedCompany(company);
      notifications.show("Company set successfully!", { severity: "success" });
      // Do other things if needed
    },
    [setSelectedCompany]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        renderCell: (params: any) => {
          if (params?.row?.name) {
            return <Chip color="primary" label={params.row.name} />;
          }
        },
        width: 200,
      },
      {
        field: "image",
        headerName: "Logo",
        width: 80,
        renderCell: (params: any) => {
            const logoUrl = params.row.image || params.row.logo;
            return (
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: logoUrl ? 'transparent' : '#f5f5f5',
                        marginTop: "5px"
                    }}
                >
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt="Company Logo"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <Icon sx={{ color: '#9e9e9e', fontSize: '20px' }}>image</Icon>
                    )}
                </Box>
            );
        },
    },
      {
        field: "actions",
        headerName: "Action",
        type: "actions",
        width: 200,
        renderCell: (params) => (
          <>
            <IconButton
              onClick={() => handleEdit(params.row._id)}
              aria-label="edit"
              color="primary"
              sx={(theme) => ({
                backgroundColor: alpha(theme.palette.primary.light, 0.2),
                marginRight: "8px",
                "&:hover": {
                  backgroundColor: `${alpha(theme.palette.primary.light, 0.3)} !important`,
                },
              })}
            >
              <Icon>edit</Icon>
            </IconButton>
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              aria-label="delete"
              color="error"
              sx={(theme) => ({
                backgroundColor: alpha(theme.palette.error.light, 0.2),
                marginRight: "8px",
                "&:hover": {
                  backgroundColor: `${alpha(theme.palette.error.light, 0.3)} !important`,
                },
              })}
            >
              <Icon>delete</Icon>
            </IconButton>
          </>
        ),
      },
      {
        field: "setContext",
        headerName: "Set Context",
        width: 150,
        renderCell: (params) => (
          <Button
            variant="contained"
            onClick={() => handleSetContext(params.row)}
            sx={(theme) => ({
              backgroundColor: theme.palette.warning.light,
              color: theme.palette.getContrastText(theme.palette.warning.light),
              fontSize: "13px",
              fontWeight: 600,
              padding: "4px 8px",
              marginBottom: "5px",
              textTransform: "lowercase",
              "&:hover": {
                backgroundColor: theme.palette.warning.main,
              },
            })}
          >
            Set Context
          </Button>
        ),
        sortable: false,
        filterable: false,
      },
    ],
    [handleEdit, handleDelete]
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <p style={{ color: "error.main" }}>Error loading data!</p>
      </Box>
    );
  }

  return (
    <Box>
      {/* <Box
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >

        <TextField
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          slotProps={{
            input: {
              endAdornment:
                <InputAdornment position="end">
                  <Icon>search</Icon>
                </InputAdornment>,
            },
          }}

        />

        <IconButton color="primary" onClick={() => handleAdd()}>
          <Icon>add</Icon>
        </IconButton>
      </Box> */}

<Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "999px",
            padding: "10px 15px",
            width: 350,
            boxShadow: theme.shadows[3],
            marginBottom: "10px",
          })}
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
              maxWidth: "100%",
            })}
          />

          <IconButton
            color="primary"
            sx={(theme) => ({
              color: theme.palette.primary.contrastText,
              background: theme.palette.primary.main,
              marginLeft: "20px",
              padding: "8px",
              "&:hover": {
                background: theme.palette.primary.dark,
              },
            })}
            onClick={() => handleAdd()}
          >
            <Icon>add</Icon>
          </IconButton>
        </Box>
      </Box>

      <Box height={400}>
        <DataGrid
          rows={data?.data || []}
          columns={columns}
          rowCount={data?.total || 0}
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
              backgroundColor: theme.palette.mode === 'light' ? '#f7f7f7' : theme.palette.background.default,
              color: theme.palette.text.primary,
              fontSize: "14px",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: theme.palette.mode === 'light' ? '#f7f7f7' : theme.palette.background.default,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: theme.palette.text.primary,
              fontWeight: "600",
            },
            "& .MuiDataGrid-sortIcon": {
              color: theme.palette.text.primary,
            },
            "& .MuiDataGrid-menuIcon": {
              color: theme.palette.text.primary,
            },
            "& .MuiDataGrid-columnSeparator": {
              color: theme.palette.divider,
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-row": {
              "&.Mui-selected": {
                backgroundColor: "transparent !important",
                outline: "none",
                "&:hover": {
                  backgroundColor: "transparent !important",
                },
              },
            },
            "& .MuiDataGrid-cell": {
              "&:focus": {
                outline: "none",
              },
              "&.MuiDataGrid-cell--selected": {
                backgroundColor: "transparent !important",
                border: "none",
              },
            },
            "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox": {
              "& .MuiButtonBase-root": {
                "&.Mui-checked": {
                  color: "inherit",
                },
                "&:hover": {
                  backgroundColor: "transparent",
                },
              },
            },
          })}
        />
      </Box>
    </Box>
  );
}
