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
import LocationForm from "../../../company/locations/form";
import { fetchUrl } from "./constant";
import theme from "@/theme/theme";

export default function DataSource() {
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [searchText, setSearchText] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

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

    return searchParams.toString(); // Return a string to use as a stable key
  }, [paginationModel, searchText, sortModel]);

  const { data, isLoading } = useSWR(
    `${fetchUrl}?${params.toString()}`,
    getFetcher
  );
  const handleAdd = async () => {
    const result = await dialogs.open((props) => (
      <LocationForm {...props} id="new" />
    ));
    if (result) {
      mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true });
    }
  };

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
    async (id: number) => {
      const result = await dialogs.open((props) => (
        <LocationForm {...props} id={id} />
      ));
      if (result) {
        mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true });
      }
    },
    [dialogs, params]
  );

  // const columns: GridColDef[] = useMemo(
  //     () => [
  //         {
  //             field: "company",
  //             headerName: "Company",
  //             renderCell: (params: any) => {
  //                 if (params?.row?.company?.name) {
  //                     return (
  //                         <Chip color="primary" label={params.row.company.name} />
  //                     )
  //                 }
  //             },
  //             width: 200,
  //         },
  //         // { field: "name", headerName: "Name", width: 200 },
  //         // { field: "address", headerName: "Address", width: 200 },
  //         // { field: "city", headerName: "City", width: 200 },
  //         // { field: "state", headerName: "State", width: 200 },
  //         // { field: "zip", headerName: "Zip", width: 200 },
  //         {
  //             field: 'actions',
  //             headerName: "Action",
  //             type: 'actions',
  //             width: 100,
  //             renderCell: (params) => (
  //                 <>
  //                     <IconButton
  //                         onClick={() => handleEdit(params.row._id)}
  //                         aria-label="edit"
  //                         color="primary"
  //                     >
  //                         <Icon>edit</Icon>
  //                     </IconButton>
  //                     <IconButton
  //                         onClick={() => handleDelete(params.row._id)}
  //                         aria-label="delete"
  //                         color="error"
  //                     >
  //                         <Icon>delete</Icon>
  //                     </IconButton>
  //                 </>
  //             )
  //         },
  //     ],
  //     [handleDelete, handleEdit]
  // );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "company",
        headerName: "Company",
        flex: 1.2,
        minWidth: 200,
        renderCell: (params: any) => {
          if (params?.row?.company?.name) {
            return <Chip color="primary" label={params.row.company.name} />;
          }
        },
        width: 200,
      },
      {
        field: "name",
        headerName: "Datastore",
        flex: 1.2,
        minWidth: 200,
        renderCell: ({ row }) => (
          <Box>
            <Typography fontWeight={600} variant="body2">
              {row.name}
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
        minWidth: 150,
        renderCell: ({ row }) => (
          <Chip
            label={row.accountName}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 1 }}
          />
        ),
      },
      {
        field: "dataSensitivity",
        headerName: "Sensitivity",
        width: 120,
        renderCell: ({ row }) => (
          <Chip
            label={row.dataSensitivity}
            size="small"
            variant="filled"
            sx={{
              backgroundColor:
                row.dataSensitivity === "Restricted"
                  ? theme.palette.error.light
                  : theme.palette.success.light,
              color: theme.palette.getContrastText(
                row.dataSensitivity === "Restricted"
                  ? theme.palette.error.light
                  : theme.palette.success.light
              ),
            }}
          />
        ),
      },
      // {
      //   field: "sensitiveRecords",
      //   headerName: "Sensitive Records",
      //   width: 140,
      //   align: "center",
      //   headerAlign: "center",
      //   renderCell: ({ row }) => (
      //     <Typography variant="body2">
      //       {row.sensitiveRecords}
      //     </Typography>
      //   ),
      // },
      {
        field: "dataClass",
        headerName: "Data Classes",
        flex: 2,
        minWidth: 250,
        renderCell: ({ row }) => (
          <Box display="flex" gap={1} sx={{ flexWrap: "wrap", maxWidth: 300 }}>
            {row.dataClasses
              ?.slice(0, 3)
              .map((cls: string, index: number) => (
                <Chip
                  key={index}
                  label={cls}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              ))}
            {row.dataClasses?.length > 3 && (
              <Tooltip title={row.dataClasses.slice(3).join(", ")}>
                <Chip
                  label={`+${row.dataClasses.length - 3}`}
                  size="small"
                  sx={{ borderRadius: 1 }}
                />
              </Tooltip>
            )}
          </Box>
        ),
      },
      {
        field: "scanStatus",
        headerName: "Status",
        width: 120,
        renderCell: ({ row }) => (
          <Chip
            label={row.scanStatus}
            size="small"
            variant="filled"
            sx={{
              backgroundColor:
                row.scanStatus === "Scanned"
                  ? theme.palette.success.light
                  : theme.palette.warning.light,
              color: theme.palette.getContrastText(
                row.scanStatus === "Scanned"
                  ? theme.palette.success.light
                  : theme.palette.warning.light
              ),
            }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        align: "center",
        renderCell: ({ row }) => (
          <Box display="flex" gap={0.5}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleEdit(row._id)} size="small" color="primary"
              sx={{
                backgroundColor: "#D4E3F1",
                marginRight: "8px",
                "&:hover": {
                  backgroundColor: "#D4E3F1 !important", // Darker blue on hover
                },
              }}>
                <Icon fontSize="small">edit</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDelete(row._id)}
                size="small"
                color="error"
                sx={{
                  backgroundColor: "#FFDADC",
                  marginRight: "8px",
                  "&:hover": {
                    backgroundColor: "#FFDADC !important", // Darker blue on hover
                  },
                }}
              >
                <Icon fontSize="small">delete</Icon>
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [handleDelete, handleEdit, theme]
  );

  return (
    <Box p={3}>
      {/* <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} gap={2}>
          <TextField
            variant="outlined"
            placeholder="Search locations..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon fontSize="small">search</Icon>
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
            sx={{ flexGrow: 1, maxWidth: 600 }}
          />

          <Button
            startIcon={<Icon>add</Icon>}
            variant="contained"
            onClick={handleAdd}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            New Data
          </Button>
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

      <Paper
        sx={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={data?.data || []}
            columns={columns}
            rowCount={data?.total || 0}
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
