import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  CircularProgress, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { equipmentApi, Equipment } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { formatCalibrationDateTime } from '../utils/dateFormatters';

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await equipmentApi.getById(parseInt(id!));
        setEquipment(response.data);
      } catch (err) {
        setError('Failed to fetch equipment details');
        showNotification('Failed to fetch equipment details', 'error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id, showNotification]);

  const handleDelete = async () => {
    if (!id) return;
    
    setDeleteLoading(true);
    try {
      await equipmentApi.delete(parseInt(id));
      showNotification('Equipment deleted successfully', 'success');
      navigate('/equipment');
    } catch (err) {
      setError('Failed to delete equipment');
      showNotification('Failed to delete equipment', 'error');
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
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

  if (!equipment) {
    return (
      <Box p={3}>
        <Alert severity="error">Equipment not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Equipment Details</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/equipment/${id}/edit`)}
            sx={{ mr: 2 }}
          >
            Edit Equipment
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Equipment
          </Button>
        </Box>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">{equipment.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Model Number
            </Typography>
            <Typography variant="body1">{equipment.model_number}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Serial Number
            </Typography>
            <Typography variant="body1">{equipment.serial_number}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Manufacturer
            </Typography>
            <Typography variant="body1">{equipment.manufacturer}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body1">{equipment.category}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Location
            </Typography>
            <Typography variant="body1">{equipment.location}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Purchase Date
            </Typography>
            <Typography variant="body1">
              {new Date(equipment.purchase_date).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Typography variant="body1">{equipment.status_display}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Last Calibration Date
            </Typography>
            <Typography variant="body1">
              {formatCalibrationDateTime(
                equipment.last_calibration_date,
                equipment.calibration_interval_type
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Next Calibration Date
            </Typography>
            <Typography variant="body1">
              {formatCalibrationDateTime(
                equipment.next_calibration_date,
                equipment.calibration_interval_type
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Calibration Interval
            </Typography>
            <Typography variant="body1">
              {equipment.calibration_interval_value} {equipment.calibration_interval_type}
            </Typography>
          </Grid>
          {equipment.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="body1">{equipment.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Equipment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this equipment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipmentDetail; 