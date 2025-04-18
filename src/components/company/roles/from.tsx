'use client';

import { RoleModel } from '@/models/Role.model';
import axiosInstance from '@/utils/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid2, Icon, IconButton, Stack, TextField, Typography } from '@mui/material';
import { DialogProps, useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { defaultValues, fetchUrl } from './constant';
import PermissionSelect from './permissions';

// Define the validation schema using Yup
const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
});

interface FormProps
    extends DialogProps<undefined, string | null> {
    id: any;
}

export default function RoleForm({
    id,
    open,
    onClose,
}: FormProps) {
    const router = useRouter();
    const notifications = useNotifications();

    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RoleModel>({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    });

    // Handle form submission
    const onSubmit = async (data: RoleModel) => {
        console.log('Form Submitted:', data);

        // Define the endpoint based on whether it's a create or update operation
        let url = `${fetchUrl}`;
        let method: 'post' | 'put' = 'post';

        if (id != 'new') {
            url = `${fetchUrl}/${id}`;
            method = 'put';
        }

        try {
            // Send form data to the server
            const response = await axiosInstance.request({
                url,
                method,
                data, // Form data
            });

            // Handle success
            console.log('Server Response:', response.data);

            if (response.status == 200 || response.status == 201) {
                const { data } = response
                notifications.show(data.message, { severity: "success" });
            }

            onClose("true");

        } catch (error) {
            // Handle error
            console.error('Error saving user information:', error);
            onClose("false");
        }
    };

    // Optionally, fetch and prefill form data for editing based on ID
    useEffect(() => {
        if (id) {
            // Fetch user data by ID and reset form with the response
            if (id != "new") {
                bindData(id)
            }
        }
    }, [id]);


    const bindData = async (id: any) => {
        try {
            const response = await axiosInstance.get(`${fetchUrl}/${id}`)
            reset(response.data)
        } catch (error: any) {
            const { response } = error
            if (response && response.status == 403) {
                router.push("/forbidden")
            }
        }
    }

    const permissions = watch("permissions")

    return (
        <Dialog fullWidth open={open} onClose={() => onClose(null)}>

            <DialogTitle>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography variant="h5">
                        {id != "new" ? 'Update Role' : 'Create Role'}
                    </Typography>
                    <IconButton onClick={() => onClose(null)}>
                        <Icon>close</Icon>
                    </IconButton>
                </Stack>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ sm: 12, md: 4 }}>
                            {/* Name Field */}
                            <TextField
                                label="Name"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                {...register('name')}
                            />
                        </Grid2>
                        <Grid2 size={{ sm: 12, md: 8 }}>
                            <PermissionSelect value={permissions} onChange={(e: any) => { setValue("permissions", e) }} />
                        </Grid2>
                    </Grid2>

                    <Box marginTop={2} display="flex" justifyContent="space-between">
                        <Button type="submit" variant="contained" color="primary">
                            {id != "new" ? 'Update' : 'Create'}
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            onClick={() => reset()}
                        >
                            Reset
                        </Button>
                    </Box>
                </DialogContent>
            </form>
        </Dialog>
    );
}
