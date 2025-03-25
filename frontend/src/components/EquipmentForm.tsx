import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Equipment } from '../services/api';

// Define the form data type (excluding read-only and auto-generated fields)
type EquipmentFormData = Pick<Equipment, 
  'name' | 
  'model_number' | 
  'serial_number' | 
  'manufacturer' | 
  'category' | 
  'location' | 
  'purchase_date' | 
  'calibration_interval_type' |
  'calibration_interval_value' |
  'notes'
>;

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  model_number: yup.string().required('Model number is required'),
  serial_number: yup.string().required('Serial number is required'),
  manufacturer: yup.string().required('Manufacturer is required'),
  category: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  purchase_date: yup.string().required('Purchase date is required'),
  calibration_interval_type: yup
    .string()
    .oneOf(['hourly', 'daily', 'weekly', 'monthly', 'yearly'], 'Invalid interval type')
    .required('Calibration interval type is required'),
  calibration_interval_value: yup
    .number()
    .required('Calibration interval value is required')
    .min(1, 'Interval value must be at least 1'),
  notes: yup.string().nullable(),
}) as yup.ObjectSchema<EquipmentFormData>;

interface EquipmentFormProps {
  initialData?: Partial<EquipmentFormData>;
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  onCancel: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EquipmentFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {initialData ? 'Edit Equipment' : 'Add New Equipment'}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Model Number"
            {...register('model_number')}
            error={!!errors.model_number}
            helperText={errors.model_number?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Serial Number"
            {...register('serial_number')}
            error={!!errors.serial_number}
            helperText={errors.serial_number?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Manufacturer"
            {...register('manufacturer')}
            error={!!errors.manufacturer}
            helperText={errors.manufacturer?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Category"
            {...register('category')}
            error={!!errors.category}
            helperText={errors.category?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Location"
            {...register('location')}
            error={!!errors.location}
            helperText={errors.location?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Purchase Date"
            InputLabelProps={{ shrink: true }}
            {...register('purchase_date', {
              required: 'Purchase date is required',
              validate: (value: string | null) => {
                if (!value) return 'Purchase date is required';
                return !isNaN(new Date(value).getTime()) || 'Invalid date';
              }
            })}
            error={!!errors.purchase_date}
            helperText={errors.purchase_date?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Calibration Interval Type</InputLabel>
            <Select
              label="Calibration Interval Type"
              {...register('calibration_interval_type')}
              error={!!errors.calibration_interval_type}
            >
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
            {errors.calibration_interval_type && (
              <Typography color="error" variant="caption">
                {errors.calibration_interval_type.message}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Calibration Interval Value"
            {...register('calibration_interval_value')}
            error={!!errors.calibration_interval_value}
            helperText={errors.calibration_interval_value?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notes"
            {...register('notes')}
            error={!!errors.notes}
            helperText={errors.notes?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EquipmentForm; 