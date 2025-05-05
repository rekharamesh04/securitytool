"use client";

import axiosInstance from "@/utils/axiosInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControlLabel,
  Icon,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useNotifications } from "@toolpad/core";
import { DialogProps } from "@toolpad/core/useDialogs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import CompanyAutocomplete from "../../autocomplete/companyAutocomplete";
import CompanyUserModel, { defaultValues, fetchUrl } from "./constant";
import { alpha } from "@mui/material/styles";
import theme from "@/theme/theme";
import { Theme } from "@mui/material/styles";

// Define the validation schema using Yup
const validationSchema = yup.object().shape({
  company: yup.object().required("Company is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  status: yup.boolean().required("Status is required"),
  isAdmin: yup.boolean().required("Is Admin is required"),
});

interface FormProps extends DialogProps<undefined, string | null> {
  id: any;
}

export default function CompanyUserForm({ id, open, onClose }: FormProps) {
  const router = useRouter();
  const notifications = useNotifications();
  // Initialize React Hook Form
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<CompanyUserModel>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  const company = watch("company");

  // Handle form submission
  const onSubmit = async (data: CompanyUserModel) => {
    console.log("Form Submitted:", data);

    // Define the endpoint based on whether it's a create or update operation
    let url = `${fetchUrl}/`;
    let method: "post" | "put" = "post";

    if (id != "new") {
      url = `${fetchUrl}/${id}`;
      method = "put";
    }

    try {
      // Send form data to the server
      const response = await axiosInstance.request({
        url,
        method,
        data, // Form data
      });

      // Handle success
      console.log("Server Response:", response.data);

      if (response.status == 200 || response.status == 201) {
        const { data } = response;
        notifications.show(data.message, { severity: "success" });
      }

      onClose("true");
    } catch (error) {
      // Handle error
      console.error("Error saving user information:", error);
      onClose("false");
    }
  };

  const bindData = useCallback(
    async (id: any) => {
      try {
        const response = await axiosInstance.get(`${fetchUrl}/${id}`);
        reset(response.data);
      } catch (error: any) {
        const { response } = error;
        if (response && response.status == 403) {
          router.push("/forbidden");
        }
      }
    },
    [reset, router]
  );

  // Optionally, fetch and prefill form data for editing based on ID
  useEffect(() => {
    if (id) {
      // Fetch user data by ID and reset form with the response
      if (id != "new") {
        bindData(id);
      }
    }
  }, [id, bindData]);
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
            {id != "new" ? "Update User" : "Create User"}
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
          <Box
            sx={{
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
            <CompanyAutocomplete setValue={setValue} value={company} />
          </Box>

          {/* Name Field */}
          <Box sx={{ marginTop: "10px" }}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register("name")}
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
                  color: theme.palette.text.primary,
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
            />

            {/* Email Field */}

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
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
                  color: theme.palette.text.primary,
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
            />

            {/* Password Field */}
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
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
                  color: theme.palette.text.primary,
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
            />
          </Box>

          <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
            {/* Status Field */}
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
              sx={{ ml: 0 }}
            />
            <FormControlLabel
              control={
                <Switch
                  {...register("isAdmin")}
                  checked={!!watch("isAdmin")}
                  onChange={(e) => setValue("isAdmin", e.target.checked)}
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
              label={
                <Typography
                  sx={{
                    color: (theme: Theme) =>
                      theme.palette.mode === "light" ? "#333" : "white",
                    fontWeight: 500,
                  }}
                >
                  Admin User
                </Typography>
              }
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              type="submit"
              variant="contained"
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
              {id != "new" ? "Update" : "Create"}
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
