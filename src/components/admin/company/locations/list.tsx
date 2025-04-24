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
            >
              <Icon>edit</Icon>
            </IconButton>
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              aria-label="delete"
              color="error"
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
      {/* <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: 300,
                    backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.1),
                    borderRadius: '999px',
                    padding: '6px 16px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
            >

                <TextField
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                        maxWidth: 300,
                        backgroundColor: 'red',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          paddingRight: '8px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ddd',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ccc',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1976d2',
                        },
                      }}
                    slotProps={{
                        input: {
                            endAdornment:
                                <InputAdornment position="end">
                                    <Icon>search</Icon>
                                </InputAdornment>,
                        },
                    }}
                />

                <IconButton color="primary" sx={{ p: 0, color: 'gray' }} onClick={() => handleAdd()}>
                    <Icon>add</Icon>
                </IconButton>

                <InputBase
        placeholder="Search..."
        sx={{
          ml: 1,
          flex: 1,
          color: 'gray',
          fontSize: '1rem',
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
            </Box> */}
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
                background: "rgb(17, 4, 122)", // 👈 Keeps the same background on hover
                color: "white", // 👈 Prevents color change
              },
            }}
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
          sx={{
            border: "solid 1px rgb(212, 212, 212)",
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Add box shadow here
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
        />
      </Box>
    </Box>
  );
}
