import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { equipmentApi } from '../services/api';

const Dashboard: React.FC = () => {
  const [totalEquipment, setTotalEquipment] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipmentCount = async () => {
      try {
        const response = await equipmentApi.getAll();
        setTotalEquipment(response.data.count);
      } catch (error) {
        console.error('Failed to fetch equipment count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentCount();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Equipment</Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4">{totalEquipment}</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pending Calibrations</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Pending Maintenance</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Overdue Items</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 