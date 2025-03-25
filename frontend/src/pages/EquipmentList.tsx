import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';
import { equipmentApi, Equipment } from '../services/api';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'model_number', headerName: 'Model', flex: 1 },
  { field: 'serial_number', headerName: 'Serial Number', flex: 1 },
  { field: 'manufacturer', headerName: 'Manufacturer', flex: 1 },
  { field: 'location', headerName: 'Location', flex: 1 },
  { field: 'status_display', headerName: 'Status', flex: 1 },
  { 
    field: 'next_calibration_date', 
    headerName: 'Next Calibration', 
    flex: 1,
    valueFormatter: (params) => {
      return params.value ? new Date(params.value).toLocaleDateString() : '-';
    }
  },
];

const EquipmentList: React.FC = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await equipmentApi.getAll();
        setEquipment(response.data.results);
      } catch (err) {
        setError('Failed to fetch equipment data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleRowClick = (params: any) => {
    navigate(`/equipment/${params.row.id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Equipment List</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/equipment/new')}
        >
          Add Equipment
        </Button>
      </Box>
      <DataGrid
        rows={equipment}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        onRowClick={handleRowClick}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default EquipmentList; 