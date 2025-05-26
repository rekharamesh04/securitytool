"use client";

import useAuth from "@/hooks/useAuth"; // Assuming this is your admin auth hook
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
  Snackbar, // Import Snackbar directly for custom toasts
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from '@mui/material/styles';
import { Theme } from "@mui/material/styles";
import { useRouter } from 'next/navigation';
import { AxiosError } from "axios"; // Import AxiosError for specific error handling

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function SignIn() {
  const { login } = useAuth(); // Your admin auth hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // State for managing error Snackbar
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // State for button shake animation
  const [isShaking, setIsShaking] = useState(false);

  const theme = useTheme();
  const router = useRouter();

  // Handler to close the error Snackbar
  const handleCloseErrorSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorSnackbar(false);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true); // Set loading to true immediately upon submission
    setIsShaking(false); // Reset shake animation before new attempt

    try {
      await login(data);
      // On successful login: Set a flag in sessionStorage and redirect immediately
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminLoginSuccess', 'true'); // Correct key for admin
      }
      router.push("/admin"); // Redirect to the admin dashboard
    } catch (error: any) {
      // On failed login: Determine specific error message and show error toast
      let currentErrorMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof AxiosError) {
        // Check if it's an AxiosError and if it has a response status 401 or 404
        if (error.response && (error.response.status === 401 || error.response.status === 404)) {
          currentErrorMessage = "Invalid Credentials. Please try again.";
          setIsShaking(true); // Trigger shake animation for invalid credentials
        } else if (error.message) {
          // Use the Axios error message if available and not a 401/404
          currentErrorMessage = error.message;
        }
      } else if (error.message) {
        // Fallback for non-Axios errors that have a message
        currentErrorMessage = error.message;
      }

      setErrorMessage(currentErrorMessage);
      setOpenErrorSnackbar(true); // Open the error Snackbar
    } finally {
      setLoading(false); // Always set loading to false after the attempt
    }
  };

  const ArrowIcon = ({ theme }: { theme: Theme }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transition: "transform 0.2s ease",
      }}
    >
      <path
        d="M9 6L15 12L9 18"
        stroke={theme.palette.mode === 'dark' ? '#818cf8' : '#6366f1'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const HomeIcon = ({ theme }: { theme: Theme }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        stroke={theme.palette.mode === 'dark' ? '#a5b4fc' : '#6366f1'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22V12H15V22"
        stroke={theme.palette.mode === 'dark' ? '#a5b4fc' : '#6366f1'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

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
        position: 'relative',
      }}
    >
      <Box
        onClick={() => router.push('/')}
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          padding: '12px 20px',
          borderRadius: '12px',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(255, 255, 255, 0.85)',
          border: (theme) =>
            `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(228, 228, 231, 0.5)'}`,
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 4px 15px -3px rgba(165, 180, 252, 0.3)'
              : '0 4px 15px -3px rgba(99, 102, 241, 0.2)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 10,
          animation: "fadeIn 0.6s ease-out forwards",
          backdropFilter: 'blur(8px)',
          "&:hover": {
            transform: 'translateY(-3px) scale(1.02)',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.25)'
                : 'rgba(255, 255, 255, 0.95)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 8px 25px -5px rgba(165, 180, 252, 0.4), 0 4px 10px -4px rgba(165, 180, 252, 0.3)'
                : '0 8px 25px -5px rgba(99, 102, 241, 0.3), 0 4px 10px -4px rgba(99, 102, 241, 0.2)',
            "& .home-icon": {
              transform: 'scale(1.2) rotate(-5deg)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
            },
            "& .home-text": {
              letterSpacing: '0.03em',
              textShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 2px 8px rgba(165, 180, 252, 0.5)'
                  : '0 2px 8px rgba(99, 102, 241, 0.3)'
            }
          },
        }}
      >
        <Box
          className="home-icon"
          sx={{
            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}
        >
          <HomeIcon theme={theme} />
        </Box>
        <Typography
          className="home-text"
          variant="h6"
          sx={{
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.02em',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, #e0e7ff 0%, #a5b4fc 100%)'
                : 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              width: '0%',
              height: '2px',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #a5b4fc 0%, #818cf8 100%)'
                  : 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
              transition: 'width 0.3s ease',
            },
            '&:hover:after': {
              width: '100%'
            }
          }}
        >
          Homepage
        </Typography>
      </Box>
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
                  // Apply shake animation if isShaking is true
                  animation: isShaking ? 'shakeZoom 0.5s ease-in-out forwards' : 'none',
                  '@keyframes shakeZoom': {
                    '0%': { transform: 'translateX(0) scale(1)' },
                    '25%': { transform: 'translateX(-15px) scale(1.04)' }, // More aggressive shake and zoom
                    '50%': { transform: 'translateX(15px) scale(1.04)' },  // More aggressive shake and zoom
                    '75%': { transform: 'translateX(-15px) scale(1.04)' }, // More aggressive shake and zoom
                    '100%': { transform: 'translateX(0) scale(1)' },
                  },
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
                onAnimationEnd={() => setIsShaking(false)} // Reset shake state after animation ends
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  "Sign in"
                )}
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
                mb: 2,
                animation: "fadeIn 0.4s ease-out 0.6s forwards",
                opacity: 0,
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: (theme) => theme.palette.mode === 'dark' ? 'white' : '#6b7280',
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.025em",
                  transition: "color 0.2s ease",
                }}
              >
                Login to
              </Typography>
              <Box
                sx={{
                  width: "1px",
                  height: "16px",
                  background: (theme) => theme.palette.mode === 'dark' ? '#3f3f46' : '#e4e4e7',
                  mx: 0.5,
                }}
              />
              <Typography
                component="span"
                sx={{
                  color: (theme) => theme.palette.mode === 'dark' ? '#818cf8' : '#6366f1',
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.025em",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: (theme) => theme.palette.mode === 'dark' ? '#a5b4fc' : '#4f46e5',
                  },
                }}
              >
                Company Dashboard
                <ArrowIcon theme={theme} />
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2000} // Disappear after 2 seconds
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position at top-right
        TransitionProps={{
          onEnter: (node: HTMLElement) => { // Apply animation on enter
            node.style.animation = 'slideInFromRight 0.5s ease-out forwards';
          },
          onExit: (node: HTMLElement) => { // Apply animation on exit
            node.style.animation = 'slideOutToRight 0.5s ease-in forwards';
          },
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '10px 18px', // Adjusted padding
          borderRadius: '10px', // Slightly smaller border-radius
          background: 'linear-gradient(90deg, #F44336 0%, #E57373 100%)', // Red gradient
          color: 'white',
          boxShadow: '0 4px 12px rgba(255, 0, 0, 0.3)',
          minWidth: '200px', // Ensure decent width
          justifyContent: 'space-between', // Space between message and dismiss icon
          // Define keyframes directly within the style block for this component
          '@keyframes slideInFromRight': {
            '0%': { opacity: 0, transform: 'translateX(100%)' },
            '100%': { opacity: 1, transform: 'translateX(0)' },
          },
          '@keyframes slideOutToRight': {
            '0%': { opacity: 1, transform: 'translateX(0)' },
            '100%': { opacity: 0, transform: 'translateX(100%)' },
          },
        }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}> {/* Smaller font size */}
            {errorMessage}
          </Typography>
          {/* Dismiss button for error toast */}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseErrorSnackbar}
            sx={{ ml: 1 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6L18 18" />
            </svg>
          </IconButton>
        </Box>
      </Snackbar>

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
