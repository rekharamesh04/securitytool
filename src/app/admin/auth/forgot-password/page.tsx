"use client";

import axiosInstance from "@/utils/axiosInstance";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    TextField,
} from "@mui/material";
import { useNotifications } from "@toolpad/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
    email: string;
};

export default function ForgotPassword() {
    const notifications = useNotifications();
    const [loading, setLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            await axiosInstance.post("/admin/auth/forgot-password", data).then((response: any) => {
                if (response.status == 200 || response.status == 201) {
                    const { data } = response
                    notifications.show(data.message, { severity: "success" });
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
                        label="Email"
                        variant="outlined"
                        margin="normal"
                        {...register("email", { required: "Email is required" })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                </CardContent>

                <CardActions>
                    <Button disabled={loading ? true : false} type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                        {loading && <CircularProgress style={{ width: "15px", height: "15px" }} />}&nbsp;  Forgot Password
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}