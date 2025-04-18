"use client";

import useAuth from "@/hooks/useAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Link,
    TextField,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
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
            console.log(error?.message)
            notifications.show("Error in Sign-in", { severity: "error" })
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
            sx={{ maxWidth: 400, mx: "auto", mt: 4 }}
        >
            <Card>
                <CardHeader title="Sign In" />

                <CardContent>

                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        {...register("email", { required: "Email is required" })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
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
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility} edge="end">
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
                            control={<Checkbox {...register("rememberMe")} color="primary" />}
                            label="Remember Me"
                        />
                        <Link
                            component={Link}
                            href="/admin/auth/forgot-password"
                            underline="hover"
                            variant="body2"
                            fontWeight="600"
                        >
                            Forgot Password?
                        </Link>
                    </Box>
                </CardContent>

                <CardActions>
                    <Button disabled={loading ? true : false} type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                        {loading && <CircularProgress style={{ width: "15px", height: "15px" }} />}&nbsp; Sign In
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}