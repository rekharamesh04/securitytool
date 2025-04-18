"use client";

import axiosInstance from "@/utils/axiosInstance";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import { useNotifications } from "@toolpad/core";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
    token: string;
    password: string;
    confirmPassword: string;
};

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token")

    const notifications = useNotifications();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            if (token) {
                data["token"] = token
            }

            await axiosInstance.post("/company/auth/verify-reset-password", data).then((response: any) => {
                if (response.status == 200 || response.status == 201) {
                    const { data } = response
                    notifications.show(data.message, { severity: "success" });
                    router.push("/company/auth/sign-in")
                }
            })
        } catch (error: any) {
            const { response } = error
            const { data } = response
            notifications.show(data.message, { severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ maxWidth: 400, mx: "auto", mt: 4 }}
        >
            <Card>
                <CardHeader title="Forgot Password" />
                <CardContent>

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

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        margin="normal"
                        {...register("confirmPassword", { required: "Confirm Password is required" })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                </CardContent>

                <CardActions>
                    <Button disabled={loading ? true : false} type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                        {loading && <CircularProgress style={{ width: "15px", height: "15px" }} />}&nbsp;  Save Password
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPasswordForm />
        </Suspense>
    );
}