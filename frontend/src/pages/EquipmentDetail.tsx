import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid } from '@mui/material';

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Equipment Details
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Equipment ID
            </Typography>
            <Typography variant="body1">{id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">-</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Model
            </Typography>
            <Typography variant="body1">-</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Serial Number
            </Typography>
            <Typography variant="body1">-</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Location
            </Typography>
            <Typography variant="body1">-</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Typography variant="body1">-</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EquipmentDetail; 