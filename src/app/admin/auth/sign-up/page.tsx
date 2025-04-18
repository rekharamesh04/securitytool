"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    IconButton,
    InputAdornment,
    Link,
    TextField,
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
    const notifications = useNotifications();
    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true)
            console.log("Form Data:", data);

        } catch (error: any) {
            notifications.show(error.message, { severity: "error" })
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

                <CardContent>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        {...register("username", { required: "Username is required" })}
                        error={!!errors.username}
                        helperText={errors.username?.message}
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
                        <Link
                            component={Link}
                            href="/admin/auth/sign-in"
                            underline="hover"
                            variant="body2"
                            fontWeight="600"
                        >
                            Already have account?
                        </Link>
                    </Box>

                </CardContent>

                <CardActions>
                    <Button disabled={loading ? true : false} type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                        {loading && <CircularProgress style={{ width: "15px", height: "15px" }} />}&nbsp;  Sign Up
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}