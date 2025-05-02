'use client';

import { LocationModel } from '@/models/Location.model';
import theme from "@/theme/theme";
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
import { alpha } from '@mui/system';

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
        <Dialog fullWidth open={open} onClose={() => onClose(null)} PaperProps={{
            sx: {
                borderRadius: 3,
                backgroundImage: 'none',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
            }
        }}>
            <DialogTitle sx={{
                backgroundColor: theme.palette.mode === 'light' ?
                    theme.palette.grey[100] :
                    theme.palette.background.default,
                borderBottom: `1px solid ${theme.palette.divider}`,
                py: 2,
                px: 3,
            }}>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography variant="h5" sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                    }}>
                        {id != "new" ? 'Update Location' : 'Create Location'}
                    </Typography>
                    <IconButton onClick={() => onClose(null)} sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                            }
                        }}>
                        <Icon>close</Icon>
                    </IconButton>
                </Stack>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{
                    backgroundColor: theme.palette.background.paper,
                }}>
                    <CompanyAutocomplete setValue={setValue} value={company}/>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2,
                    }}>
                                                {[
                            { field: 'name', label: 'Name' },
                            { field: 'dashboardUrl', label: 'Dashboard Url' },
                            { field: 'address', label: 'Address' },
                            { field: 'city', label: 'City' },
                            { field: 'state', label: 'State' },
                            { field: 'zip', label: 'Zip' },
                            { field: 'latitude', label: 'Latitude' },
                            { field: 'longitude', label: 'Longitude' },
                        ].map(({ field, label }) => (
                            <TextField
                                key={field}
                                label={label}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                    sx: {
                                        color: theme.palette.text.secondary,
                                    }
                                }}
                                InputProps={{
                                    sx: {
                                        borderRadius: 2,
                                        backgroundColor: theme.palette.background.paper,
                                        color: theme.palette.text.primary,
                                        '& fieldset': {
                                            borderColor: theme.palette.divider,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    }
                                }}
                                error={!!errors[field as keyof typeof errors]}
                                helperText={errors[field as keyof typeof errors]?.message?.toString() || ''}
                                {...register(field as keyof LocationModel)}
                            />
                        ))}
                                            {/* <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        {...register('name')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    />

                    <TextField
                        label="Dashboard Url"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.dashboardUrl}
                        helperText={errors.dashboardUrl?.message}
                        {...register('dashboardUrl')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    />

                    <TextField
                        label="Address"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        {...register('address')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    />

                    <TextField
                        label="City"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        {...register('city')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    />

                    <TextField
                        label="State"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.state}
                        helperText={errors.state?.message}
                        {...register('state')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    />

                    <TextField
                        label="Zip"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.zip}
                        helperText={errors.zip?.message}
                        {...register('zip')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    />

                    <TextField
                        label="Latitude"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.latitude}
                        helperText={errors.latitude?.message}
                        {...register('latitude')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    />

                    <TextField
                        label="Longitude"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.longitude}
                        helperText={errors.longitude?.message}
                        {...register('longitude')}
                        {...register('longitude')}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    /> */}
                    </Box>

                    <FormControlLabel
                        control={
                            <Switch
                                {...register('status')}
                                checked={watch('status')} // Use `watch` to track the current value of `status`
                                onChange={(e) => setValue('status', e.target.checked)} // Update `status` when the Switch is toggled
                                color="primary"
                                sx={{
                                    '& .MuiSwitch-switchBase': {
                                        color: theme.palette.mode === 'light' ?
                                            theme.palette.grey[400] :
                                            theme.palette.grey[600],
                                        '&.Mui-checked': {
                                            color: theme.palette.primary.main,
                                        },
                                    },
                                    '& .MuiSwitch-track': {
                                        backgroundColor: theme.palette.mode === 'light' ?
                                            theme.palette.grey[400] :
                                            theme.palette.grey[600],
                                    },
                                }}
                            />
                        }
                        // label={watch('status') ? 'Active' : 'Inactive'} // Dynamic label based on the value
                        label={
                            <Typography color={theme.palette.text.primary}>
                                {watch('status') ? 'Active' : 'Inactive'}
                            </Typography>
                        }
                        sx={{
                            mt: 1,
                            ml: 1,
                            '& .MuiFormControlLabel-label': {
                                color: theme.palette.text.primary,
                            }
                        }}
                    />

                    <Box marginTop={4} display="flex" justifyContent="space-between" gap={2}>
                        <Button type="submit" variant="contained" color="primary"                             sx={{
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                boxShadow: 'none',
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                    boxShadow: 'none',
                                    backgroundColor: theme.palette.primary.dark,
                                }
                            }}>
                            {id !== 'new' ? 'Update' : 'Create'}
                        </Button>
                        <Button type="button" variant="outlined" color="secondary" onClick={() => reset()}                             sx={{
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.primary,
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                }
                            }}>
                            Reset
                        </Button>
                    </Box>

                </DialogContent>
            </form>
        </Dialog>
    );
}
