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
              sx={{
                backgroundColor: "#D4E3F1",
                marginRight: "8px",
                "&:hover": {
                  backgroundColor: "#D4E3F1 !important", // Darker blue on hover
                },
              }}
            >
              <Icon>edit</Icon>
            </IconButton>
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              aria-label="delete"
              color="error"
              sx={{
                backgroundColor: "#FFDADC",
                marginRight: "8px",
                "&:hover": {
                  backgroundColor: "#FFDADC !important", // Darker blue on hover
                },
              }}
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
            sx={{
              backgroundColor: "#FF8D8D",
              color: "black",
              fontSize: "13px",
              fontWeight: 600,
              padding: "4px 8px",
              marginBottom: "5px",
              textTransform: "lowercase",
              "&:hover": {
                backgroundColor: "#FF8D8D !important", // Darker blue on hover
              },
            }}
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
        <p style={{color: "red"}}>Error loading data!</p>
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
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
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
            // Remove row selection highlight
            "& .MuiDataGrid-row": {
              "&.Mui-selected": {
                backgroundColor: "transparent !important",
                outline: "none",
                "&:hover": {
                  backgroundColor: "transparent !important", // Remove hover on selected
                },
              },
            },
            // Cell styles
            "& .MuiDataGrid-cell": {
              // Remove focus outline
              "&:focus": {
                outline: "none",
              },
              // Remove border when selected
              "&.MuiDataGrid-cell--selected": {
                backgroundColor: "transparent !important", // Remove cell selection
                border: "none",
              },
            },

            // Checkbox styles (if you have selection checkboxes)
            "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox":
              {
                "& .MuiButtonBase-root": {
                  "&.Mui-checked": {
                    color: "inherit", // Keep original checkbox color
                  },
                  "&:hover": {
                    backgroundColor: "transparent", // Remove hover background
                  },
                },
              },
          }}
        />
      </Box>
    </Box>
  );
}
