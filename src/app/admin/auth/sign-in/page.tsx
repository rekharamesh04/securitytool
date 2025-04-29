"use client";

import useAuth from "@/hooks/useAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useNotifications } from "@toolpad/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function SignIn() {
  const { login } = useAuth();
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
      console.log(error?.message);
      notifications.show("Error in Sign-in", { severity: "error" });
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
          linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95)),
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
          background: "radial-gradient(circle at 10% 20%, rgba(56, 182, 255, 0.1) 0%, rgba(15, 23, 42, 0.8) 90%)",
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          animation: "fadeInUp 0.5s ease-out forwards",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <Card
          elevation={24}
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            position: "relative",
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transform: "translate3d(0, 0, 0)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0 30px 60px -12px rgba(56, 182, 255, 0.3)",
            },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)",
              padding: "24px 0",
              textAlign: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&:before": {
                content: '""',
                position: "absolute",
                top: "-50%",
                left: "-50%",
                right: "-50%",
                bottom: "-50%",
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
                transform: "rotate(30deg)",
                animation: "shimmer 3s infinite linear",
              },
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: "1.75rem",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.025em",
                position: "relative",
                animation: "fadeIn 0.6s ease-out forwards",
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                opacity: 0.9, 
                mt: 1,
                position: "relative",
                fontWeight: 400,
                animation: "fadeIn 0.6s ease-out 0.1s forwards",
              }}
            >
              Sign in to your account
            </Typography>
          </Box>

          <CardContent sx={{ padding: "32px" }}>
            <Box
              sx={{
                animation: "fadeIn 0.4s ease-out 0.2s forwards",
                opacity: 0,
              }}
            >
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  mb: 3,
                  "& .MuiInputLabel-root": {
                    color: "#a1a1aa", // Zinc-300
                    fontSize: "0.875rem",
                    fontFamily: "'Inter', sans-serif",
                    transform: "translate(14px, 16px) scale(1)",
                    "&.Mui-focused": {
                      color: "#6366f1", // Indigo-500
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "&.MuiFormLabel-filled": {
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    fontFamily: "'Inter', sans-serif",
                    "& fieldset": {
                      borderColor: "rgba(161, 161, 170, 0.5)", // Zinc-300 with opacity
                      borderWidth: "1.5px",
                      transition: "border-color 0.3s ease",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(99, 102, 241, 0.8)", // Indigo-500 with opacity
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6366f1", // Indigo-500
                      borderWidth: "2px",
                      boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.25)",
                    },
                    "& .MuiInputBase-input": {
                      color: "#f4f4f5", // Zinc-100
                      padding: "14px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      "&::placeholder": {
                        opacity: 0.6,
                        color: "#a1a1aa", // Zinc-300
                      },
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    marginLeft: 0,
                    fontSize: "0.75rem",
                    fontFamily: "'Inter', sans-serif",
                    color: "#f87171", // Red-400 for error messages
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "0.875rem",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                animation: "fadeIn 0.4s ease-out 0.3s forwards",
                opacity: 0,
              }}
            >
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  mb: 2,
                  "& .MuiInputLabel-root": {
                    color: "#a1a1aa", // Zinc-300
                    fontSize: "0.875rem",
                    fontFamily: "'Inter', sans-serif",
                    transform: "translate(14px, 16px) scale(1)",
                    "&.Mui-focused": {
                      color: "#6366f1", // Indigo-500
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                    "&.MuiFormLabel-filled": {
                      transform: "translate(14px, -9px) scale(0.75)",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    fontFamily: "'Inter', sans-serif",
                    "& fieldset": {
                      borderColor: "rgba(161, 161, 170, 0.5)", // Zinc-300 with opacity
                      borderWidth: "1.5px",
                      transition: "border-color 0.3s ease",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(99, 102, 241, 0.8)", // Indigo-500 with opacity
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6366f1", // Indigo-500
                      borderWidth: "2px",
                      boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.25)",
                    },
                    "& .MuiInputBase-input": {
                      color: "#f4f4f5", // Zinc-100
                      padding: "14px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      "&::placeholder": {
                        opacity: 0.6,
                        color: "#a1a1aa", // Zinc-300
                      },
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    marginLeft: 0,
                    fontSize: "0.75rem",
                    fontFamily: "'Inter', sans-serif",
                    color: "#f87171", // Red-400 for error messages
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "0.875rem",
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{ 
                          color: "#a1a1aa", // Zinc-300
                          "&:hover": {
                            color: "#6366f1", // Indigo-500
                            backgroundColor: "rgba(99, 102, 241, 0.1)",
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
                mb: 3,
                animation: "fadeIn 0.4s ease-out 0.4s forwards",
                opacity: 0,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("rememberMe")}
                    sx={{
                      color: "#a1a1aa", // Zinc-300
                      "&.Mui-checked": {
                        color: "#6366f1", // Indigo-500
                      },
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                      },
                    }}
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#a1a1aa", // Zinc-300
                      fontSize: "0.875rem",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Remember me
                  </Typography>
                }
              />
              <Link
                href="/admin/auth/forgot-password"
                underline="none"
                variant="body2"
                sx={{
                  color: "#a1a1aa", // Zinc-300
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  fontFamily: "'Inter', sans-serif",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "#0ea5e9", // Sky-500
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Box
              sx={{
                animation: "fadeIn 0.4s ease-out 0.5s forwards",
                opacity: 0,
              }}
            >
              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  height: "44px",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "0.025em",
                  fontFamily: "'Inter', sans-serif",
                  color: "white",
                  transition: "all 0.2s ease, transform 0.1s ease",
                  "&:hover": {
                    background: "linear-gradient(90deg, #0d95d8 0%, #5a5cd1 100%)",
                    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  },
                  "&:disabled": {
                    background: "#3f3f46", // Zinc-700
                    color: "#a1a1aa", // Zinc-300
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  "Sign in"
                )}
              </Button>
            </Box>
          </CardContent>
{/* 
          <Box
            sx={{
              padding: "0 32px 24px",
              textAlign: "center",
              animation: "fadeIn 0.4s ease-out 0.6s forwards",
              opacity: 0,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#a1a1aa", // Zinc-300
                fontSize: "0.875rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Don't have an account?{" "}
              <Link
                href="/admin/auth/sign-up"
                underline="none"
                sx={{
                  color: "#0ea5e9", // Sky-500
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "#6366f1", // Indigo-500
                  },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box> */}
        </Card>
      </Box>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(30deg);
          }
          100% {
            transform: translateX(100%) rotate(30deg);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}