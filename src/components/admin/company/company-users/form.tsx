'use client';

import axiosInstance from '@/utils/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormControlLabel, Icon, IconButton, Stack, Switch, TextField, Typography } from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useNotifications } from '@toolpad/core';
import { DialogProps } from "@toolpad/core/useDialogs";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import CompanyAutocomplete from '../../autocomplete/companyAutocomplete';
import CompanyUserModel, { defaultValues, fetchUrl } from './constant';

// Define the validation schema using Yup
const validationSchema = yup.object().shape({
    company: yup.object().required('Company is required'),
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    status: yup.boolean().required('Status is required'),
    isAdmin: yup.boolean().required("Is Admin is required"),
});


interface FormProps
    extends DialogProps<undefined, string | null> {
    id: any;
}

export default function CompanyUserForm({
    id,
    open,
    onClose,
}: FormProps) {
    const router = useRouter();
    const notifications = useNotifications();
    // Initialize React Hook Form
    const {
        handleSubmit,
        reset,
        setValue,
        watch,
        register,
        formState: { errors },
    } = useForm<CompanyUserModel>({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues
    });

    const company = watch("company")

    // Handle form submission
    const onSubmit = async (data: CompanyUserModel) => {
        console.log('Form Submitted:', data);

        // Define the endpoint based on whether it's a create or update operation
        let url = `${fetchUrl}/`;
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



    const bindData = useCallback(async (id: any) => {
        try {
            const response = await axiosInstance.get(`${fetchUrl}/${id}`)
            reset(response.data)
        } catch (error: any) {
            const { response } = error
            if (response && response.status == 403) {
                router.push("/forbidden")
            }
        }
    },[reset,router])
    
    // Optionally, fetch and prefill form data for editing based on ID
    useEffect(() => {
        if (id) {
            // Fetch user data by ID and reset form with the response
            if (id != "new") {
                bindData(id)
            }
        }
    }, [id,bindData]);
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
                        {id != "new" ? 'Update User' : 'Create User'}
                    </Typography>
                    <IconButton onClick={() => onClose(null)}>
                        <Icon>close</Icon>
                    </IconButton>
                </Stack>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>


                <DialogContent>

                    <CompanyAutocomplete setValue={setValue} value={company} />

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

                    {/* Email Field */}

                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register('email')}
                    />



                    {/* Password Field */}
                    <TextField
                        label="Password"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register('password')}
                    />


                    {/* Status Field */}
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

                    <FormControlLabel
                        control={
                            <Switch
                                {...register("isAdmin")}
                                checked={!!watch("isAdmin")}
                                onChange={(e) => setValue("isAdmin", e.target.checked)}
                                color="primary"
                            />
                        }
                        label={"Is Admin"}
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
