"use client";

import axiosInstance from "@/utils/axiosInstance";
import { getFetcher } from "@/utils/fetcher";
import {
  Box,
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
          mutate(`${fetchUrl}?${params}`, { revalidate: true }); // use stable key

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
        mutate(`${fetchUrl}?${params}`, { revalidate: true }); // use stable key
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
      mutate(`${fetchUrl}?${params}`, { revalidate: true }); // use stable key
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
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
                      marginLeft: "10px",
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
          borderRadius: "10px",
          border: (theme) =>
            `1px solid ${theme.palette.mode === "light" ? "#C1C3C0" : "#A8ABA7"}`,
          overflow: "hidden", // This ensures the border radius is applied properly
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
            border: "`1px solid ${theme.palette.divider}`",
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
                  ? "#f7f7f7"
                  : theme.palette.background.default,
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
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
            },
          })}
        />
      </Box>
    </Box>
  );
}
