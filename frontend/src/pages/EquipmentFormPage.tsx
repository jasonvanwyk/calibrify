import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Alert } from '@mui/material';
import EquipmentForm from '../components/EquipmentForm';
import { equipmentApi, Equipment } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const EquipmentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useNotification();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!id) return;

      try {
        const response = await equipmentApi.getById(parseInt(id));
        setEquipment(response.data);
      } catch (err) {
        setError('Failed to fetch equipment data');
        showNotification('Failed to fetch equipment data', 'error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id, showNotification]);

  const handleSubmit = async (data: Partial<Equipment>) => {
    try {
      // Format the data before sending to backend
      const formattedData = {
        ...data,
        // Format purchase_date as YYYY-MM-DD
        purchase_date: data.purchase_date || null,
        // Ensure calibration_interval_value is a number
        calibration_interval_value: Number(data.calibration_interval_value),
        // Ensure notes is a string or null
        notes: data.notes || null,
      };

      console.log('Sending data to backend:', formattedData);

      if (id) {
        await equipmentApi.update(parseInt(id), formattedData);
        showNotification('Equipment updated successfully', 'success');
      } else {
        await equipmentApi.create(formattedData);
        showNotification('Equipment created successfully', 'success');
      }
      navigate('/equipment');
    } catch (err: any) {
      setError('Failed to save equipment data');
      showNotification('Failed to save equipment data', 'error');
      console.error('Error details:', err.response?.data || err);
    }
  };

  const handleCancel = () => {
    navigate('/equipment');
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <EquipmentForm
          initialData={equipment || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Paper>
    </Box>
  );
};

export default EquipmentFormPage; 