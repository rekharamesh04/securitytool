"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid2,
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
  username: string;
  password: string;
};

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const notification = useNotifications();
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      console.log("Form Data:", data);
      //  notification.show("Sign-up Successful",{severity:"success"})
    } catch (error: any) {
      notification.show(error.message, { severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    // <Box
    //     component="form"
    //     onSubmit={handleSubmit(onSubmit)}
    //     sx={{ maxWidth: 400, mx: "auto", mt: 4 }}
    // >
    //     {/* Username Field */}
    //     <TextField
    //         fullWidth
    //         label="Username"
    //         variant="outlined"
    //         margin="normal"
    //         {...register("username", { required: "Username is required" })}
    //         error={!!errors.username}
    //         helperText={errors.username?.message}
    //     />

    //     {/* Password Field */}
    //     <TextField
    //         fullWidth
    //         label="Password"
    //         type={showPassword ? "text" : "password"}
    //         variant="outlined"
    //         margin="normal"
    //         {...register("password", { required: "Password is required" })}
    //         error={!!errors.password}
    //         helperText={errors.password?.message}
    //         InputProps={{
    //             endAdornment: (
    //                 <InputAdornment position="end">
    //                     <IconButton onClick={togglePasswordVisibility} edge="end">
    //                         {showPassword ? <VisibilityOff /> : <Visibility />}
    //                     </IconButton>
    //                 </InputAdornment>
    //             ),
    //         }}
    //     />

    //     {/* Remember Me and Forgot Password */}
    //     <Box
    //         sx={{
    //             display: "flex",
    //             justifyContent: "space-between",
    //             alignItems: "center",
    //             mt: 2,
    //         }}
    //     >

    //         <Link
    //             component={Link}
    //             href="/admin/auth/sign-in"
    //             underline="hover"
    //             variant="body2"
    //             fontWeight="600"
    //         >
    //             Already have account?
    //         </Link>
    //     </Box>

    //     {/* Submit Button */}
    //     <Button disabled={loading ? true : false} type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
    //         {loading && <CircularProgress style={{ width: "15px", height: "15px" }} />}&nbsp;  Sign Up
    //     </Button>
    // </Box>
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        position: "relative",
        "&:before": {
          content: '""',
          background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
          position: "absolute",
          height: "100%",
          width: "100%",
          opacity: "0.3",
        },
      }}
    >
      <Grid2
        container
        spacing={0}
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Grid2
          size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            elevation={9}
            sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
          >
            <Box textAlign="center">
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "rgb(103, 58, 183)",
                  fontSize: "1.25rem",
                  fontFamily: "Roboto, sans-serif",
                  lineHeight: 1.167,
                }}
              >
                Create Your Account
              </Typography>
              <Typography variant="body1" sx={{ color: "#60625F" }}>
                Join us to get started
              </Typography>
            </Box>

            <CardContent>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                {...register("username", {
                  required: {
                    value: true,
                    message: "Username is required",
                  },
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#6a1b9a",
                    "&.Mui-focused": {
                      color: "rgb(33, 150, 243)",
                    },
                    "&.Mui-error": {
                      color: "#d32f2f",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                      borderWidth: 1,
                    },
                    "&:hover fieldset": {
                      borderColor: "#000000",
                      borderWidth: 1,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(33, 150, 243)",
                      borderWidth: 2,
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "#d32f2f",
                      borderWidth: 1,
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f44336",
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    marginLeft: 0,
                    "&.Mui-error": {
                      color: "#f44336",
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#6a1b9a",
                    "&.Mui-focused": {
                      color: "rgb(33, 150, 243)",
                    },
                    "&.Mui-error": {
                      color: "#d32f2f",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                      borderWidth: 1,
                    },
                    "&:hover fieldset": {
                      borderColor: "#000000",
                      borderWidth: 1,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(33, 150, 243)",
                      borderWidth: 2,
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "#d32f2f",
                      borderWidth: 1,
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f44336",
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    marginLeft: 0,
                    "&.Mui-error": {
                      color: "#f44336",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{ color: "#6a1b9a" }}
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
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Link
                  href="/admin/auth/sign-in"
                  underline="hover"
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "rgb(103, 58, 183)" }}
                >
                  Already have an account?
                </Link>
              </Box>
            </CardContent>

            <CardActions>
              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  background: "rgb(103, 58, 183)",
                  "&:hover": {
                    backgroundColor: "rgb(81, 45, 145)",
                  },
                }}
              >
                {loading && <CircularProgress size={15} />}&nbsp; Sign Up
              </Button>
            </CardActions>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
