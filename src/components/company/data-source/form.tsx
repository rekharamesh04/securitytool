'use client';

import axiosInstance from '@/utils/axiosInstance';
import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Box, Button, Chip, Dialog, DialogContent, DialogTitle, FormControlLabel, Icon, IconButton, Stack, Switch, TextField, Typography, useTheme } from '@mui/material';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { defaultValues, fetchUrl, FormModel, FormProps } from '@/components/company/data-source/constant';
import CompanyAutocomplete from '@/components/admin/autocomplete/companyAutocomplete';
import { keyframes } from '@emotion/react';

// Animation for button hover
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Validation schema
const validationSchema = yup.object().shape({
  company: yup.object().required('Company is required'),
  datastore: yup.string().required('Datastore is required'),
  account: yup.string().required('Account is required'),
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
  const theme = useTheme();

  // Datastore options
  const DATASTORE_OPTIONS = [
    {
      group: 'Cloud Services',
      items: ['AWS', 'Azure', 'Google Cloud', 'IBM Cloud']
    },
    {
      group: 'Databases',
      items: [
        'MySQL',
        'PostgreSQL',
        'MongoDB',
        'Oracle',
        'SQL Server',
      ]
    },
    {
      group: 'Email Services',
      items: ['Gmail', 'Outlook', 'Yahoo Mail', 'ProtonMail', 'Zoho Mail']
    },
  ];

  // Flatten for the actual options
  const flattenedOptions = DATASTORE_OPTIONS.flatMap(group =>
    group.items.map(item => ({
      label: item,
      group: group.group
    }))
  );

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
          company: data.company,
        });

        setLoading(false);
    } catch (error: any) {
        setLoading(false);
        const { response } = error
        if (response && response.status == 403) {
            router.push("/forbidden")
        }
    }
  },[router,reset])

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
  const datastore = watch("datastore");

  if (loading) return <p>Loading...</p>;

  return (
    <Dialog 
      fullWidth 
      open={open} 
      onClose={() => onClose(null)}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[10],
        }
      }}
    >
      <DialogTitle sx={{ 
        background: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.primary.main,
        color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.white,
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        padding: '16px 24px',
      }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {id !== "new" ? 'Update Data Source' : 'Create Data Source'}
          </Typography>
          <IconButton 
            onClick={() => onClose(null)}
            sx={{
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.primary.dark,
              }
            }}
          >
            <Icon>close</Icon>
          </IconButton>
        </Stack>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ padding: '24px' }}>
          <CompanyAutocomplete setValue={setValue} value={company} />

          <Autocomplete
            options={flattenedOptions}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.label}
            value={datastore ? { label: datastore, group: '' } : null}
            onChange={(_, newValue) => {
              setValue('datastore', newValue?.label || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Datastore"
                fullWidth
                margin="normal"
                error={!!errors.datastore}
                helperText={errors.datastore?.message}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
                    },
                  },
                }}
              />
            )}
            sx={{
              marginTop: '16px',
              '& .MuiAutocomplete-groupLabel': {
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                fontWeight: 600,
              },
            }}
          />

          <TextField
            label="Account"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.account}
            helperText={errors.account?.message}
            {...register('account')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
                },
              },
            }}
          />

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={(watch("data") || "").split(",").filter(Boolean)}
            onChange={(_, newValue) => {
              setValue("data", newValue.join(","));
            }}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option}
                    {...tagProps}
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
                      color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.primary.contrastText,
                      fontWeight: 500,
                      borderRadius: '8px',
                      paddingX: '4px',
                      margin: '2px',
                      boxShadow: theme.shadows[1],
                      '& .MuiChip-deleteIcon': {
                        color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.primary.contrastText,
                        ':hover': {
                          color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.primary.dark,
                        },
                      },
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows[2],
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Data"
                margin="normal"
                error={!!errors.data}
                helperText={errors.data?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
                    },
                  },
                }}
              />
            )}
          />

          <FormControlLabel
            control={
              <Switch
                {...register('status')}
                checked={watch('status')}
                onChange={(e) => setValue('status', e.target.checked)}
                color="primary"
                sx={{
                  '& .MuiSwitch-switchBase': {
                    '&.Mui-checked': {
                      color: theme.palette.primary.main,
                      '& + .MuiSwitch-track': {
                        backgroundColor: theme.palette.primary.main,
                      },
                    },
                  },
                }}
              />
            }
            label={watch('status') ? 'Active' : 'Inactive'}
            sx={{
              marginTop: '16px',
              '& .MuiFormControlLabel-label': {
                color: theme.palette.text.primary,
                fontWeight: 500,
              },
            }}
          />

          <Box 
            marginTop={4} 
            display="flex" 
            justifyContent="space-between"
            gap={2}
          >
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              sx={{
                borderRadius: '12px',
                padding: '10px 24px',
                fontWeight: 600,
                fontSize: '16px',
                textTransform: 'none',
                boxShadow: theme.shadows[2],
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: theme.shadows[4],
                  animation: `${pulseAnimation} 0.5s ease`,
                },
                transition: 'all 0.3s ease',
                minWidth: '120px',
              }}
            >
              {id !== 'new' ? 'Update' : 'Create'}
            </Button>
            <Button 
              type="button" 
              variant="outlined" 
              color="secondary" 
              onClick={() => reset()}
              sx={{
                borderRadius: '12px',
                padding: '10px 24px',
                fontWeight: 600,
                fontSize: '16px',
                textTransform: 'none',
                boxShadow: theme.shadows[1],
                borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400],
                color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[600],
                  boxShadow: theme.shadows[2],
                  animation: `${pulseAnimation} 0.5s ease`,
                },
                transition: 'all 0.3s ease',
                minWidth: '120px',
              }}
            >
              Reset
            </Button>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  );
}