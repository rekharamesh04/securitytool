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
  Tooltip,
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
import LocationForm from "./form";
import { Theme } from "@mui/material/styles";
import { Add } from "@mui/icons-material";

export default function LocationList() {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  // Debounce search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const dialogs = useDialogs();

  const notifications = useNotifications();
  // Build the query string for pagination, sorting, and search
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
    async (id: number) => {
      const result = await dialogs.open((props) => (
        <LocationForm {...props} id={id} />
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
      <LocationForm {...props} id="new" />
    ));
    if (result) {
      mutate(`${fetchUrl}?${params}`, { revalidate: true });
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "company",
        headerName: "Company",
        renderCell: (params: any) => {
          if (params?.row?.company?.name) {
            return <Chip color="primary" label={params.row.company.name} />;
          }
        },
        width: 200,
      },
      { field: "name", headerName: "Name", width: 200 },
      { field: "address", headerName: "Address", width: 200 },
      { field: "city", headerName: "City", width: 200 },
      { field: "state", headerName: "State", width: 200 },
      { field: "zip", headerName: "Zip", width: 200 },
      {
        field: "actions",
        headerName: "Action",
        type: "actions",
        width: 100,
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
    ],
    [handleDelete, handleEdit]
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
        <p>Error loading data!</p>
      </Box>
    );
  }

  return (
    <Box>
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
            backgroundColor:
              theme.palette.mode === "light"
                ? alpha(theme.palette.primary.light, 0.2)
                : alpha(theme.palette.primary.dark, 0.2),
            borderRadius: "50px",
            padding: "8px 16px",
            width: 380,
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow:
                "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.08)",
              transform: "translateY(-1px)",
            },
          })}
        >
          <TextField
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GridSearchIcon
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
                      fontSize: "20px",
                      marginLeft: "10px"
                    }}
                  />
                </InputAdornment>
              ),
              sx: {
                  fontSize: "0.95rem",
                  background: (theme: Theme) =>
                    theme.palette.mode === "light" ? "#dee7ff" : "black",
                  borderRadius: "25px",
                  padding: "4px 0px",
                boxShadow: "0 2px 4px rgba(12, 7, 7, 0.1) inset",
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.background.paper, 0.9),
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2) inset",
                },
                "&.Mui-focused": {
                  backgroundColor: (theme) => theme.palette.background.paper,
                  boxShadow: (theme) =>
                    `0 0 0 2px ${theme.palette.primary.light}, 0 2px 4px rgba(0, 0, 0, 0.2) inset`,
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
                },
                "&:hover fieldset": {
                  borderColor: (theme) => theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: (theme) => theme.palette.primary.main,
                  boxShadow: (theme) =>
                    `0 0 0 2px ${theme.palette.primary.light}`,
                },
              },
              flex: 1,
              mr: 2,
            }}
          />

          <Tooltip title="Add New Company" arrow>
            <IconButton
              color="primary"
              sx={{
                color: "white",
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                padding: "10px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                  "0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  transform: "scale(1.1) translateY(-2px)",
                  boxShadow:
                    "0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)",
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                },
                "&:active": {
                  transform: "scale(0.98) translateY(0)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                },
              }}
              onClick={() => handleAdd()}
            >
              <Add sx={{ fontSize: "1.5rem" }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 3,
          }}
        ></Box>
      </Box>

<Box 
  height={400} 
  sx={{ 
    borderRadius: 2,
    border: (theme) => `1px solid ${theme.palette.mode === 'light' ? '#C1C3C0' : '#A8ABA7'}`,
    overflow: 'hidden', // This ensures the border radius is applied properly
    boxShadow: (theme) => theme.shadows[2],
  }}
>
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
      // Remove border from DataGrid since we're applying it to the Box
      border: 'none',
      "& .MuiDataGrid-main": {
        border: (theme: Theme) =>
            theme.palette.mode === "light" ? "black" : "white",
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
      },
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor:
          theme.palette.mode === "light"
            ? "#2c3e50"
            : theme.palette.grey[800],
        color: theme.palette.common.white,
        fontSize: "14px",
        borderTopLeftRadius: 0, // Now handled by the Box container
        borderTopRightRadius: 0,
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
      "& .MuiDataGrid-columnHeader": {
         backgroundColor:
          theme.palette.mode === "light"
            ? "#f7f7f7"
            : "#40413F",
        borderRight: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
        "&:last-child": {
          borderRight: "none",
        },
      },
      "& .MuiDataGrid-columnHeaderTitle": {
        color: (theme: Theme) =>
            theme.palette.mode === "light" ? "black" : "white",
        fontWeight: "600",
      },
      "& .MuiDataGrid-sortIcon": {
        color: (theme: Theme) =>
            theme.palette.mode === "light" ? "white" : "black",
        backgroundColor: theme.palette.mode === "light" ? "#40413F" : "#F2F3F2",
        borderRadius: "10px"
      },
      "& .MuiDataGrid-menuIcon": {
        color: theme.palette.common.white,
      },
      "& .MuiDataGrid-iconButtonContainer": {
        visibility: "visible !important",
      },
      "& .MuiDataGrid-columnSeparator": {
        color: theme.palette.divider,
        display: "none",
      },
      "& .MuiDataGrid-columnHeader:focus-within": {
        outline: "none",
      },
      "& .MuiDataGrid-cell": {
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRight: `1px solid ${theme.palette.divider}`,
        "&:last-child": {
          borderRight: "none",
        },
      },
      "& .MuiDataGrid-cellContent": {
        padding: "8px 0",
      },
      "& .MuiDataGrid-row": {
        "&:nth-of-type(even)": {
          backgroundColor:
            theme.palette.mode === "light"
              ? alpha(theme.palette.grey[100], 0.5)
              : alpha(theme.palette.grey[900], 0.5),
        },
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.light, 0.1),
        },
      },
      "& .MuiDataGrid-footerContainer": {
        borderTop: `2px solid ${theme.palette.divider}`,
        borderBottomLeftRadius: 0, // Now handled by the Box container
        borderBottomRightRadius: 0,
      },
      "& .MuiTablePagination-root": {
        color: theme.palette.text.primary,
      },
    })}
  />
</Box>
    </Box>
  );
}
