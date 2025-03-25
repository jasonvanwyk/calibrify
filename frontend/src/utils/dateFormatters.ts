// ============================================================================
// File Path: frontend/src/utils/dateFormatters.ts
// Description: Utility functions for formatting dates and times
// ============================================================================

import { Equipment } from '../services/api';

export const formatCalibrationDateTime = (
  date: string | null,
  intervalType: Equipment['calibration_interval_type']
): string => {
  if (!date) return '-';
  
  const calibrationDate = new Date(date);
  const today = new Date();
  const isToday = calibrationDate.toDateString() === today.toDateString();
  
  if (intervalType === 'hourly') {
    if (isToday) {
      return calibrationDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    }
    return calibrationDate.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
  
  // For daily, weekly, monthly, yearly - just show the date
  return calibrationDate.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}; 