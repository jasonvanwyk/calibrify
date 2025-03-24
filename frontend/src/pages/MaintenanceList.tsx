import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';
import { maintenanceApi, Maintenance } from '../services/api';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'equipment', headerName: 'Equipment', flex: 1 },
  { field: 'maintenance_type', headerName: 'Type', flex: 1 },
  { field: 'scheduled_date', headerName: 'Scheduled Date', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'performed_by', headerName: 'Performed By', flex: 1 },
];

const MaintenanceList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await maintenanceApi.getAll();
        setMaintenance(response.data);
      } catch (err) {
        setError('Failed to fetch maintenance records');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, []);

  const handleRowClick = (params: any) => {
    navigate(`/maintenance/${params.row.id}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
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
        <Typography variant="h4">Maintenance Records</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/maintenance/new')}
        >
          Add Maintenance Record
        </Button>
      </Box>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={maintenance}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10]}
          onRowClick={handleRowClick}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};

export default MaintenanceList; 