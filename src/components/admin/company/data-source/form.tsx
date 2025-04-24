'use client';

import axiosInstance from '@/utils/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControlLabel, Icon, IconButton, Stack, Switch, TextField, Typography } from '@mui/material';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { defaultValues, fetchUrl, FormModel, FormProps } from './constant';
import CompanyAutocomplete from '../../autocomplete/companyAutocomplete';

// Validation schema
const validationSchema = yup.object().shape({
  company: yup.object().required('Company is required'),
  datastore: yup.string().required('Datastore is required'),
  account: yup.string().required('Account is required'),
  sensitivity: yup.string().required('Sensitivity is required'),
  sensitive_records: yup.string().required('Sensitive Records is required'),
  data: yup.string().required('Data is required'),
  status: yup.boolean().required(),
});

export default function DataSourceForm({
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
  } = useForm<FormModel>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  // Fetch and prefill data for editing
  const bindData = useCallback(async (id: any) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${fetchUrl}/${id}`);
      const data = {
        ...response.data,
        status: response.data.status,
      };
      reset(data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const { response } = error;
      if (response && response.status === 403) {
        router.push("/forbidden");
      }
    }
  }, [router, reset]);

  useEffect(() => {
    if (id && id !== 'new') {
      bindData(id);
    }
  }, [id, bindData]);

  // Submit form data
  const onSubmit = async (data: FormModel) => {
    try {
      const url = id !== 'new' ? `${fetchUrl}/${id}` : `${fetchUrl}/`;
      const method = id !== 'new' ? 'put' : 'post';

      const response = await axiosInstance.request({ url, method, data });
      if (response.status === 200 || response.status === 201) {
        const { data } = response;
        notifications.show(data.message, { severity: "success" });
      }

      onClose("true");
    } catch (error) {
      console.error('Error saving data source:', error);
      onClose("false");
    }
  };

  const company = watch("company");

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
            {id !== "new" ? 'Update Data Source' : 'Create Data Source'}
          </Typography>
          <IconButton onClick={() => onClose(null)}>
            <Icon>close</Icon>
          </IconButton>
        </Stack>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {/* <TextField
            label="Company"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.company}
            helperText={errors.company?.message}
            {...register('company')}
          /> */}

          <CompanyAutocomplete setValue={setValue} value={company} />

          <TextField
            label="Datastore"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.datastore}
            helperText={errors.datastore?.message}
            {...register('datastore')}
          />

          <TextField
            label="Account"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.account}
            helperText={errors.account?.message}
            {...register('account')}
          />

          <TextField
            label="Sensitivity"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.sensitivity}
            helperText={errors.sensitivity?.message}
            {...register('sensitivity')}
          />

          <TextField
            label="Sensitive Records"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.sensitive_records}
            helperText={errors.sensitive_records?.message}
            {...register('sensitive_records')}
          />

          <TextField
            label="Data"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.data}
            helperText={errors.data?.message}
            {...register('data')}
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
