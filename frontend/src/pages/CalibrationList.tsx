import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';
import { calibrationApi, Calibration } from '../services/api';

const columns: GridColDef[] = [
  { field: 'equipment', headerName: 'Equipment', flex: 1 },
  { 
    field: 'calibration_date', 
    headerName: 'Calibration Date', 
    flex: 1,
    valueFormatter: (params) => {
      return new Date(params.value).toLocaleDateString();
    }
  },
  { 
    field: 'next_calibration_date', 
    headerName: 'Next Calibration', 
    flex: 1,
    valueFormatter: (params) => {
      return new Date(params.value).toLocaleDateString();
    }
  },
  { field: 'performed_by', headerName: 'Performed By', flex: 1 },
  { field: 'certificate_number', headerName: 'Certificate Number', flex: 1 },
  { field: 'notes', headerName: 'Notes', flex: 1 },
];

const CalibrationList: React.FC = () => {
  const [calibrations, setCalibrations] = useState<Calibration[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCalibrations = async () => {
      try {
        const response = await calibrationApi.getAll();
        setCalibrations(response.data);
      } catch (error) {
        console.error('Error fetching calibrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalibrations();
  }, []);

  const handleRowClick = (params: any) => {
    navigate(`/calibrations/${params.row.id}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Calibrations</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/calibrations/new')}
        >
          Add Calibration
        </Button>
      </Box>
      <DataGrid
        rows={calibrations}
        columns={columns}
        loading={loading}
        autoHeight
        onRowClick={handleRowClick}
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  );
};

export default CalibrationList; 