'use client';

import { LocationModel } from '@/models/Location.model';
import axiosInstance from '@/utils/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControlLabel, Icon, IconButton, Stack, Switch, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { defaultValues, fetchUrl } from './constant';
import CompanyAutocomplete from '@/components/admin/autocomplete/companyAutocomplete';
import { DialogProps, useNotifications } from '@toolpad/core';

// Validation schema
const validationSchema = yup.object().shape({
    company: yup.object().required('Company is required'),
    name: yup.string().required('Name is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zip: yup.string().required('Zip is required'),
    latitude: yup.number().required('Latitude is required'),
    longitude: yup.number().required('Longitude is required'),
    status: yup.boolean().required('Status is required'),
});

interface FormProps
    extends DialogProps<undefined, string | null> {
    id: any;
}

export default function LocationForm({
    id,
    open,
    onClose,
}: FormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const notifications = useNotifications();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LocationModel>({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    });

    const company = watch("company");

    const bindData = useCallback(async (id:any) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`${fetchUrl}/${id}`);
            const data = {
                ...response.data,
                latitude: parseFloat(response.data.latitude),
                longitude: parseFloat(response.data.longitude),
                status: response.data.status,
            }
            reset(data);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            const { response } = error
            if (response && response.status == 403) {
                router.push("/forbidden")
            }
        }
    }
,[router,reset])
    // Fetch and prefill data for editing
    useEffect(() => {
        if (id && id != 'new') {
            bindData(id);
        }
    }, [id,bindData]);

    // Submit form data
    const onSubmit = async (data: LocationModel) => {
        try {
            const url = id !== 'new' ? `${fetchUrl}/${id}` : `${fetchUrl}/`;
            const method = id !== 'new' ? 'put' : 'post';

            const response = await axiosInstance.request({ url, method, data });
            if (response.status == 200 || response.status == 201) {
                const { data } = response
                notifications.show(data.message, { severity: "success" });
            }

            onClose("true");
        } catch (error) {
            console.error('Error saving location:', error);
            onClose("false");
        }
    };

    if (loading) return <p>Loading...</p>;

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
                        {id != "new" ? 'Update Location' : 'Create Location'}
                    </Typography>
                    <IconButton onClick={() => onClose(null)}>
                        <Icon>close</Icon>
                    </IconButton>
                </Stack>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <CompanyAutocomplete setValue={setValue} value={company} />

                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        {...register('name')}
                    />

                    <TextField
                        label="Dashboard Url"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.dashboardUrl}
                        helperText={errors.dashboardUrl?.message}
                        {...register('dashboardUrl')}
                    />

                    <TextField
                        label="Address"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        {...register('address')}
                    />

                    <TextField
                        label="City"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        {...register('city')}
                    />

                    <TextField
                        label="State"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.state}
                        helperText={errors.state?.message}
                        {...register('state')}
                    />

                    <TextField
                        label="Zip"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.zip}
                        helperText={errors.zip?.message}
                        {...register('zip')}
                    />

                    <TextField
                        label="Latitude"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.latitude}
                        helperText={errors.latitude?.message}
                        {...register('latitude')}
                    />

                    <TextField
                        label="Longitude"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.longitude}
                        helperText={errors.longitude?.message}
                        {...register('longitude')}
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
                            {id !== 'new' ? 'Update' : 'Create'}
                        </Button>
                        <Button type="button" variant="outlined" color="secondary" onClick={() => reset()}>
                            Reset
                        </Button>
                    </Box>

                </DialogContent>
            </form>
        </Dialog>
    );
}
