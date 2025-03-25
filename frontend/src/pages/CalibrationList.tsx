import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';
import { equipmentApi, Equipment } from '../services/api';
import { formatCalibrationDateTime } from '../utils/dateFormatters';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Equipment', flex: 1 },
  { field: 'serial_number', headerName: 'Serial Number', flex: 1 },
  { 
    field: 'last_calibration_date', 
    headerName: 'Last Calibration', 
    flex: 1,
    valueGetter: (params) => {
      const equipment = params.row as Equipment;
      return formatCalibrationDateTime(
        equipment.last_calibration_date,
        equipment.calibration_interval_type
      );
    }
  },
  { 
    field: 'next_calibration_date', 
    headerName: 'Next Calibration', 
    flex: 1,
    valueGetter: (params) => {
      const equipment = params.row as Equipment;
      return formatCalibrationDateTime(
        equipment.next_calibration_date,
        equipment.calibration_interval_type
      );
    }
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    flex: 1,
    valueGetter: (params) => {
      const equipment = params.row as Equipment;
      return equipment.status_display;
    }
  },
  { 
    field: 'calibration_interval', 
    headerName: 'Interval', 
    flex: 1,
    valueGetter: (params) => {
      const equipment = params.row as Equipment;
      return `${equipment.calibration_interval_value} ${equipment.calibration_interval_type}`;
    }
  },
];

const CalibrationList: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await equipmentApi.getAll();
        // Sort by next calibration date
        const sortedEquipment = response.data.results.sort((a: Equipment, b: Equipment) => {
          if (!a.next_calibration_date) return 1;
          if (!b.next_calibration_date) return -1;
          return new Date(a.next_calibration_date).getTime() - new Date(b.next_calibration_date).getTime();
        });
        setEquipment(sortedEquipment);
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
    navigate(`/calibrations/new?equipment=${params.row.id}`);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Upcoming Calibrations</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/calibrations/new')}
        >
          Record Calibration
        </Button>
      </Box>
      <DataGrid
        rows={equipment}
        columns={columns}
        autoHeight
        onRowClick={handleRowClick}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          sorting: {
            sortModel: [{ field: 'next_calibration_date', sort: 'asc' }],
          },
        }}
      />
    </Box>
  );
};

export default CalibrationList; 