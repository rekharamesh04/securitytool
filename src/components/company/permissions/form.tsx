'use client';

import { PermissionModel } from '@/models/Permission.model';
import axiosInstance from '@/utils/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControlLabel, Icon, IconButton, Stack, Switch, TextField, Typography } from '@mui/material';
import { DialogProps, useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { defaultValues, fetchUrl } from './constant';

// Define the validation schema using Yup
const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
});

interface FormProps
    extends DialogProps<undefined, string | null> {
    id: any;
}

export default function PermissionForm({
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
        setValue,
        watch,
        formState: { errors },
    } = useForm<PermissionModel>({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues
    });

    // Handle form submission
    const onSubmit = async (data: PermissionModel) => {
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
                        {id != "new" ? 'Update Permission' : 'Create Permission'}
                    </Typography>
                    <IconButton onClick={() => onClose(null)}>
                        <Icon>close</Icon>
                    </IconButton>
                </Stack>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>

                <DialogContent>
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

                    <FormControlLabel
                        control={
                            <Switch
                                {...register('status')}
                                checked={watch('status')} // Use `watch` to track the current value of `status`
                                onChange={(e) => setValue('status', e.target.checked)} // Update `status` when the Switch is toggled
                                color="primary"
                            />
                        }
                        label={watch('status') ? 'Active' : 'Inactive'} // Dynamic label based on the value
                    />

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
