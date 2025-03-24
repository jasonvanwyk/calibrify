import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'model', headerName: 'Model', flex: 1 },
  { field: 'serial_number', headerName: 'Serial Number', flex: 1 },
  { field: 'location', headerName: 'Location', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
];

const EquipmentList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Equipment List
      </Typography>
      <DataGrid
        rows={[]}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  );
};

export default EquipmentList; 