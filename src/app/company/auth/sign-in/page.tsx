"use client";

import useCompanyAuth from "@/hooks/useCompanyAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useNotifications } from "@toolpad/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function SignIn() {
  const { login } = useCompanyAuth();
  // const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const notifications = useNotifications();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await login(data);
      notifications.show("Sign-in Successful", { severity: "success" });
    } catch (error: any) {
      notifications.show(error.message, { severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        backgroundImage: `
          linear-gradient(rgba(70, 39, 139, 0.9), rgba(25, 18, 75, 0.9)),
          url('https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=2232&q=80')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        "&:before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 90%)",
          zIndex: 0,
        },
      }}
    >
      <Card
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
            padding: "20px 0",
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: "1.75rem",
              fontFamily: "'Poppins', sans-serif",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Welcome Back
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
            Sign in to continue
          </Typography>
        </Box>

        <CardContent sx={{ padding: "30px" }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              mb: 3,
              "& .MuiInputLabel-root": {
                color: "#6a11cb",
                "&.Mui-focused": {
                  color: "#2575fc",
                },
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "#C1C3C0",
                },
                "&:hover fieldset": {
                  borderColor: "#6a11cb",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2575fc",
                  borderWidth: "2px",
                },
                "& .MuiInputBase-input": { 
                  color: "#2575fc",
                },
              },
            }}
            InputProps={{
              style: {
                fontSize: "16px",
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": {
                color: "#6a11cb",
                "&.Mui-focused": {
                  color: "#2575fc",
                },
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "#C1C3C0",
                },
                "&:hover fieldset": {
                  borderColor: "#6a11cb",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2575fc",
                  borderWidth: "2px",
                },
                "& .MuiInputBase-input": { 
                  color: "#2575fc",
                },
              },
            }}
            InputProps={{
              style: {
                fontSize: "16px",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{ color: "#6a11cb" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
              mb: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  {...register("rememberMe")}
                  sx={{
                    color: "#6a11cb",
                    "&.Mui-checked": {
                      color: "#2575fc",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#555" }}>
                  Remember Me
                </Typography>
              }
            />
            <Link
              href="/admin/auth/forgot-password"
              underline="hover"
              variant="body2"
              sx={{
                color: "#2575fc",
                fontWeight: 600,
                "&:hover": {
                  color: "#6a11cb",
                },
              }}
            >
              Forgot Password?
            </Link>
          </Box>
        </CardContent>

        <CardActions sx={{ padding: "0 30px 30px" }}>
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              height: "48px",
              borderRadius: "8px",
              background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              color: "white",
              "&:hover": {
                background: "linear-gradient(to right, #5a0cb0 0%, #1a65e0 100%)",
                boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
              },
              "&:disabled": {
                background: "#ccc",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Sign In"
            )}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}