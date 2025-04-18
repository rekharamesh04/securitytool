"use client";

import axiosInstance from "@/utils/axiosInstance";
import { getFetcher } from "@/utils/fetcher";
import { Box, CircularProgress, Icon, IconButton, InputAdornment, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useDialogs, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { fetchUrl } from "./constant";
import RoleForm from "./form";

export default function RoleList() {
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchText, setSearchText] = useState("");

  const notifications = useNotifications();
  const dialogs = useDialogs();

  // Build the query string for pagination, sorting, and search
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
  

  // Fetch data with SWR
  const { data, error, isLoading } = useSWR(`${fetchUrl}?${params.toString()}`, getFetcher);

  useEffect(() => {
    if (error && error.status == 403) {
      router.push("/forbidden")
    }
  }, [error,router])

  // Handle deletion of a row
  const handleDelete = useCallback(async (id: number) => {

    const confirmed = await dialogs.confirm("Are you sure to delete this ?", {
      okText: "Yes",
      cancelText: "No",
    });

    if (confirmed) {
      try {
        const response = await axiosInstance.delete(`${fetchUrl}/${id}`);
        // Revalidate the data after deleting the category
        mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true }); // use stable key

        const { data } = response
        notifications.show(data.message, { severity: "success" });

      } catch (err) {
        console.error('Failed to delete the data:', err);
      }
    }
  }
    , [dialogs,notifications,params])
  // Handle editing of a row
  const handleEdit = useCallback(async (id: number) => {
    const result = await dialogs.open((props) => (
      <RoleForm {...props} id={id} />
    ));
    if (result) {
      mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true });
    }
  }, [dialogs,params])

  // Handle new 
  const handleAdd = async () => {
    const result = await dialogs.open((props) => (
      <RoleForm {...props} id="new" />
    ));
    if (result) {
      mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true });
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "Name", width: 200 },
      {
        field: 'actions',
        headerName: "Action",
        type: 'actions',
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
        )
      },
    ],
    [handleDelete, handleEdit]
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <p>Error loading data!</p>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >

        <TextField
          placeholder="Search "
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
        />
      </Box>
    </Box>
  );
}
