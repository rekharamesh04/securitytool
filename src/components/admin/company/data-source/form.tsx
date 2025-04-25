'use client';

import axiosInstance from '@/utils/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Box, Button, Chip, Dialog, DialogContent, DialogTitle, FormControlLabel, Icon, IconButton, Stack, Switch, TextField, Typography } from '@mui/material';
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
  const bindData = useCallback(async (id:any) => {
    try {
        setLoading(true);
        const response = await axiosInstance.get(`${fetchUrl}/${id}`);
        const data = response.data.data;

        reset({
          ...data,
          company: data.company, // full company object with _id and name
        });

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

          {/* <TextField
            label="Data"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.data}
            helperText={errors.data?.message}
            {...register('data')}
          /> */}

<Autocomplete
  multiple
  freeSolo
  options={[]} // No predefined options
  value={(watch("data") || "").split(",").filter(Boolean)}
  onChange={(_, newValue) => {
    // Join values back to string for form state
    setValue("data", newValue.join(","));
  }}
  renderTags={(value: readonly string[], getTagProps) =>
    value.map((option: string, index: number) => (
      <Chip
        // key={index}
        label={option}
        {...getTagProps({ index })}
        sx={{
          backgroundColor: "#e3f2fd", // Light blue
          color: "#0d47a1",            // Dark blue text
          fontWeight: 500,
          borderRadius: "8px",
          paddingX: "4px",
          margin: "2px",
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
          "& .MuiChip-deleteIcon": {
            color: "#0d47a1",
            ":hover": {
              color: "#1565c0",
            },
          },
        }}
      />
    ))
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Data"
      margin="normal"
      error={!!errors.data}
      helperText={errors.data?.message}
    />
  )}
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
