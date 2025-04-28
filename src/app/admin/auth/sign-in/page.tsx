"use client";

import useAuth from "@/hooks/useAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Grid2,
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
      // console.log("Form Data:", data);
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
    // <Box
    //     component="form"
    //     onSubmit={handleSubmit(onSubmit)}
    //     sx={{
    //         position: "relative",
    //         "&:before": {
    //           content: '""',
    //           background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
    //           backgroundSize: "400% 400%",
    //           animation: "gradient 15s ease infinite",
    //           position: "absolute",
    //           height: "100%",
    //           width: "100%",
    //           opacity: "0.3",
    //         },
    //       }}
    // >
    //     <Card>
    //         <CardHeader title="Sign In" />

    //         <CardContent>

    //             <TextField
    //                 fullWidth
    //                 label="Email"
    //                 variant="outlined"
    //                 margin="normal"
    //                 {...register("email", { required: "Email is required" })}
    //                 error={!!errors.email}
    //                 helperText={errors.email?.message}
    //             />

    //             <TextField
    //                 fullWidth
    //                 label="Password"
    //                 type={showPassword ? "text" : "password"}
    //                 variant="outlined"
    //                 margin="normal"
    //                 {...register("password", { required: "Password is required" })}
    //                 error={!!errors.password}
    //                 helperText={errors.password?.message}
    //                 InputProps={{
    //                     endAdornment: (
    //                         <InputAdornment position="end">
    //                             <IconButton onClick={togglePasswordVisibility} edge="end">
    //                                 {showPassword ? <VisibilityOff /> : <Visibility />}
    //                             </IconButton>
    //                         </InputAdornment>
    //                     ),
    //                 }}
    //             />

    //             <Box
    //                 sx={{
    //                     display: "flex",
    //                     justifyContent: "space-between",
    //                     alignItems: "center",
    //                     mt: 2,
    //                 }}
    //             >
    //                 <FormControlLabel
    //                     control={<Checkbox {...register("rememberMe")} color="primary" />}
    //                     label="Remember Me"
    //                 />
    //                 <Link
    //                     component={Link}
    //                     href="/admin/auth/forgot-password"
    //                     underline="hover"
    //                     variant="body2"
    //                     fontWeight="600"
    //                 >
    //                     Forgot Password?
    //                 </Link>
    //             </Box>
    //         </CardContent>

    //         <CardActions>
    //             <Button disabled={loading ? true : false} type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
    //                 {loading && <CircularProgress style={{ width: "15px", height: "15px" }} />}&nbsp; Sign In
    //             </Button>
    //         </CardActions>
    //     </Card>
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
            sx={{
              p: 4,
              zIndex: 1,
              width: "100%",
              maxWidth: "500px",
              borderRadius: "15px",
            }}
          >
            {/* Rest of your card content remains exactly the same */}
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
                Hi, Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: "#60625F" }}>
                Enter your credentials to continue
              </Typography>
            </Box>

            <CardContent>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#6a1b9a", // Purple label
                    "&.Mui-focused": {
                      color: "rgb(33, 150, 243)", // Blue when focused
                    },
                    "&.Mui-error": {
                      color: "#d32f2f", // Red when error
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)", // Light black border
                      borderWidth: 1,
                    },
                    "&:hover fieldset": {
                      borderColor: "#000000", // Black on hover
                      borderWidth: 1,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(33, 150, 243)", // Blue when focused
                      borderWidth: 2,
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "#d32f2f", // Red when error
                      borderWidth: 1,
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f44336", // Light red error message
                    fontWeight: "normal", // Not bold
                    fontSize: "0.75rem",
                    marginLeft: 0,
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
                    color: "#6a1b9a", // Purple label
                    "&.Mui-focused": {
                      color: "rgb(33, 150, 243)", // Blue when focused
                    },
                    "&.Mui-error": {
                      color: "#d32f2f", // Red when error
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)", // Light black border
                      borderWidth: 1,
                    },
                    "&:hover fieldset": {
                      borderColor: "#000000", // Black on hover
                      borderWidth: 1,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(33, 150, 243)", // Blue when focused
                      borderWidth: 2,
                    },
                    "&.Mui-error fieldset": {
                      borderColor: "#d32f2f", // Red when error
                      borderWidth: 1,
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f44336", // Light red error message
                    fontWeight: "normal", // Not bold
                    fontSize: "0.75rem",
                    marginLeft: 0,
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
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register("rememberMe")}
                      sx={{
                        color: "#6a1b9a", // Purple color for checkbox
                        "&.Mui-checked": {
                          color: "#6a1b9a", // Purple color when checked
                        },
                      }}
                    />
                  }
                  label="Remember Me"
                  sx={{ color: "black" }}
                />
                <Link
                  href="/admin/auth/forgot-password"
                  underline="hover"
                  variant="body2"
                  fontWeight="600"
                  sx={{ color: "rgb(103, 58, 183)" }}
                >
                  Forgot Password?
                </Link>
              </Box>
            </CardContent>

            <CardActions>
              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, background: "rgb(103, 58, 183)" }}
              >
                {loading && <CircularProgress size={15} />}&nbsp; Sign In
              </Button>
            </CardActions>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
