'use client';

import { LocationModel } from "@/models/Location.model";
import theme from "@/theme/theme";
import axiosInstance from "@/utils/axiosInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Icon,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { defaultValues, fetchUrl } from "./constant";
import CompanyAutocomplete from "@/components/admin/autocomplete/companyAutocomplete";
import { DialogProps, useNotifications } from "@toolpad/core";
import { alpha } from "@mui/system";
import { FieldError } from "react-hook-form";
import { Theme } from "@mui/material/styles";


const getErrorMessage = (error: FieldError | undefined): string | undefined => {
  return error?.message;
};

// Validation schema
const validationSchema = yup.object().shape({
    company: yup.object().required("Company is required"),
    name: yup.string().required('Name is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zip: yup.string().required('Zip is required'),
    latitude: yup.number().required('Latitude is required'),
    longitude: yup.number().required('Longitude is required'),
    status: yup.boolean().required('Status is required'),
});

interface FormProps extends DialogProps<undefined, string | null> {
  id: any;
}

export default function LocationForm({
    id,
    open,
    onClose,
}: FormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const notifications = useNotifications();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LocationModel>({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    });

    const company = watch("company");

    const bindData = useCallback(async (id:any) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`${fetchUrl}/${id}`);
            const data = {
                ...response.data,
                latitude: parseFloat(response.data.latitude),
                longitude: parseFloat(response.data.longitude),
                status: response.data.status,
            }
            reset(data);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            const { response } = error
            if (response && response.status == 403) {
                router.push("/forbidden")
            }
        }
    },[router,reset])
    // Fetch and prefill data for editing
    useEffect(() => {
        if (id && id != 'new') {
            bindData(id);
        }
    }, [id,bindData]);

    // Submit form data
    const onSubmit = async (data: LocationModel) => {
        try {
            const url = id !== 'new' ? `${fetchUrl}/${id}` : `${fetchUrl}/`;
            const method = id !== 'new' ? 'put' : 'post';

            const response = await axiosInstance.request({ url, method, data });
            if (response.status == 200 || response.status == 201) {
                const { data } = response
                notifications.show(data.message, { severity: "success" });
            }

            onClose("true");
        } catch (error) {
            console.error('Error saving location:', error);
            onClose("false");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
            <Dialog
              fullWidth
              open={open}
              onClose={() => onClose(null)}
              PaperProps={{
                sx: {
                  borderRadius: "16px",
                  backgroundImage: "none",
                  backgroundColor: (theme: Theme) =>
                    theme.palette.mode === "light" ? "#f7f7f7" : "black",
                  boxShadow: (theme) => theme.shadows[10],
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  maxWidth: "600px",
                  overflow: "hidden",
                },
              }}
            >
              <DialogTitle
                sx={{
                  backgroundColor: (theme: Theme) =>
                    theme.palette.mode === "light" ? "#f7f7f7" : "#383838",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 3,
                  px: 4,
                  position: "relative",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background: `linear-gradient(90deg, transparent, ${theme.palette.divider}, transparent)`,
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: (theme: Theme) =>
                        theme.palette.mode === "light" ? "black" : "white",
                      letterSpacing: "0.5px",
                      fontSize: "1.5rem",
                    }}
                  >
                    {id != "new" ? "Update Location" : "Create Location"}
                  </Typography>
                  <IconButton
                    onClick={() => onClose(null)}
                    sx={{
                      color: (theme: Theme) =>
                        theme.palette.mode === "light" ? "white" : "white",
                      backgroundColor: (theme: Theme) =>
                        theme.palette.mode === "light" ? "#ed1a26" : "#282B73",
                      borderRadius: "8px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.text.secondary, 0.2),
                        transform: "rotate(90deg)",
                      },
                    }}
                  >
                    <Icon>close</Icon>
                  </IconButton>
                </Stack>
              </DialogTitle>
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent
                  sx={{
                    py: 4,
                    px: 4,
                    backgroundColor: (theme: Theme) =>
                      theme.palette.mode === "light" ? "#f7f7f7" : "black",
                  }}
                >
                  <Box sx={{ marginBottom: "5px" }}>
                    <CompanyAutocomplete setValue={setValue} value={company} />
                  </Box>
        
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                      "& .MuiAutocomplete-root": {
                        width: "100%",
                        mb: 1,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        borderRadius: "12px",
                        backgroundColor: alpha(theme.palette.background.paper, 0.1),
                        "& fieldset": {
                          borderColor: alpha(theme.palette.divider, 0.5),
                        },
                        "&:hover fieldset": {
                          borderColor: theme.palette.primary.main,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: (theme: Theme) =>
                          theme.palette.mode === "light" ? "#ed1a26" : "white",
                        fontWeight: 500,
                      },
                    }}
                  >
                    {[
                      { field: "name", label: "Name" },
                      { field: "dashboardUrl", label: "Dashboard Url" },
                      { field: "address", label: "Address" },
                      { field: "city", label: "City" },
                      { field: "state", label: "State" },
                      { field: "zip", label: "Zip" },
                      { field: "latitude", label: "Latitude" },
                      { field: "longitude", label: "Longitude" },
                    ].map(({ field, label }) => (
                      <TextField
                        key={field}
                        label={label}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                          sx: {
                            color: (theme: Theme) =>
                              theme.palette.mode === "light" ? "#ed1a26" : "white",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                          },
                        }}
                        InputProps={{
                          sx: {
                            borderRadius: "12px",
                            backgroundColor: alpha(theme.palette.background.paper, 0.1),
                            color: (theme: Theme) =>
                              theme.palette.mode === "light" ? "#333" : "white",
                            "& fieldset": {
                              borderColor: alpha(theme.palette.divider, 0.5),
                              transition: "border-color 0.3s ease",
                            },
                            "&:hover fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: theme.palette.primary.main,
                              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                            },
                          },
                        }}
                        error={!!errors[field as keyof typeof errors]}
                        helperText={getErrorMessage(
                          errors[field as keyof typeof errors] as FieldError
                        )}
                        {...register(field as keyof LocationModel)}
                      />
                    ))}
                  </Box>
        
                  <FormControlLabel
                    control={
                      <Switch
                        {...register("status")}
                        checked={watch("status")} // Use `watch` to track the current value of `status`
                        onChange={(e) => setValue("status", e.target.checked)} // Update `status` when the Switch is toggled
                        color="primary"
                        sx={{
                          "& .MuiSwitch-switchBase": {
                            color: theme.palette.grey[600],
                            "&.Mui-checked": {
                              color: theme.palette.primary.main,
                            },
                            "&.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: theme.palette.primary.main,
                            },
                          },
                          "& .MuiSwitch-track": {
                            backgroundColor: theme.palette.grey[600],
                            opacity: 0.8,
                          },
                        }}
                      />
                    }
                    // label={watch('status') ? 'Active' : 'Inactive'} // Dynamic label based on the value
                    label={
                      <Typography
                        sx={{
                          color: (theme: Theme) =>
                            theme.palette.mode === "light" ? "#333" : "white",
                          fontWeight: 500,
                        }}
                      >
                        {watch("status") ? "Active" : "Inactive"}
                      </Typography>
                    }
                    sx={{
                      mt: 1,
                      ml: 1,
                      "& .MuiFormControlLabel-label": {
                        color: theme.palette.text.primary,
                      },
                    }}
                  />
        
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                      pt: 2,
                      borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: "12px",
                        boxShadow: "none",
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        fontSize: "0.8rem",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                          transform: "translateY(-2px)",
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        },
                      }}
                    >
                      {id !== "new" ? "Update" : "Create"}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      onClick={() => reset()}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: "12px",
                        borderColor: (theme: Theme) =>
                          theme.palette.mode === "light" ? "#282B73" : "#282B73",
                        color: (theme: Theme) =>
                          theme.palette.mode === "light" ? "#333" : "white",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        fontSize: "0.8rem",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          transform: "translateY(-2px)",
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      }}
                    >
                      Reset
                    </Button>
                  </Box>
                </DialogContent>
              </form>
            </Dialog>
    );
}
