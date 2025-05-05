"use client";

import { CompanyModel } from "@/models/Company.model";
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
import { DialogProps, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { defaultValues, fetchUrl } from "./constant";
import { alpha } from "@mui/material/styles";
import theme from "@/theme/theme";
import { Theme } from "@mui/material/styles";

// Define the validation schema using Yup
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  status: yup.boolean().required("Status is required"),
});

interface FormProps extends DialogProps<undefined, string | null> {
  id: any;
}

export default function CompanyForm({ id, open, onClose }: FormProps) {
  const router = useRouter();
  const notifications = useNotifications();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  // Initialize React Hook Form
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<CompanyModel>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.match("image.*")) {
        notifications.show("Please select an image file", {
          severity: "error",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  // Handle form submission
  const onSubmit = async (data: CompanyModel) => {
    console.log("Form Submitted:", data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("status", String(data.status));

    // Add image to form data if it exists
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (existingImage && !imageFile && id !== "new") {
      // For existing images when editing without changes
      formData.append("existingImage", existingImage);
    }

    // Define the endpoint based on whether it's a create or update operation
    const url = id !== "new" ? `${fetchUrl}/${id}` : `${fetchUrl}/`;
    const method = id !== "new" ? "put" : "post";

    try {
      // Send form data to the server
      const response = await axiosInstance.request({
        url,
        method,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
        if (response.data.image) {
          setSelectedImage(response.data.image);
          setExistingImage(response.data.image);
        }
      } catch (error: any) {
        const { response } = error;
        if (response && response.status == 403) {
          router.push("/forbidden");
        }
      }
    },
    [router, reset]
  );

  // Optionally, fetch and prefill form data for editing based on ID
  useEffect(() => {
    if (id && id !== "new") {
      bindData(id);
    } else {
      reset(defaultValues);
      setSelectedImage(null);
      setImageFile(null);
      setExistingImage(null);
    }
  }, [id, bindData, reset]);
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
            {id != "new" ? "Update Company" : "Create Company"}
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
              theme.palette.mode === "light" ? "#f7f7f7" : "black", // Changed to paper for better contrast
          }}
        >
          {/* Name Field */}
          <TextField
            label="Name"
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
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name")}
          />
          <TextField
            label="Company Address"
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
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          {/* Image Upload Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              mt: 2,
              backgroundColor: (theme: Theme) =>
                theme.palette.mode === "light" ? "#f7f7f7" : "black",
              p: 2,
              borderRadius: "16px",
            }}
          >
            <Box>
              <Button
                variant="contained"
                component="label"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    transform: "translateY(-2px)",
                  },
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "16px",
                  boxShadow: theme.shadows[2],
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.3)}, transparent)`,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover:before": {
                    opacity: 1,
                  },
                }}
              >
                <Icon sx={{ fontSize: "24px" }}>cloud_upload</Icon>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  Logo Upload
                </Typography>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  mt: 1,
                  display: "block",
                  fontSize: "0.75rem",
                  color: (theme: Theme) =>
                    theme.palette.mode === "light" ? "#ed1a26" : "white",
                  textAlign: "center",
                }}
              >
                Recommended: 75x75px
              </Typography>
            </Box>

            {(selectedImage || existingImage) && (
              <Box
                sx={{
                  width: "100px",
                  height: "100px",
                  border: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
                  borderRadius: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: theme.shadows[1],
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
              >
                <img
                  src={selectedImage || existingImage || ""}
                  alt="Company Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: alpha(theme.palette.background.default, 0.3),
                    opacity: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "opacity 0.3s ease",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <IconButton
                    color="primary"
                    sx={{
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.9
                      ),
                      "&:hover": {
                        backgroundColor: theme.palette.background.paper,
                      },
                    }}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>

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
            sx={{
              mt: 1,
              ml: 0,
              alignSelf: "flex-start",
            }}
          />

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
