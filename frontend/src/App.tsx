import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EquipmentList from "./pages/EquipmentList";
import EquipmentDetail from "./pages/EquipmentDetail";
import EquipmentFormPage from "./pages/EquipmentFormPage";
import CalibrationList from "./pages/CalibrationList";
import CalibrationFormPage from "./pages/CalibrationFormPage";
import MaintenanceList from "./pages/MaintenanceList";
import { NotificationProvider } from "./contexts/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/equipment" element={<EquipmentList />} />
            <Route path="/equipment/new" element={<EquipmentFormPage />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/equipment/:id/edit" element={<EquipmentFormPage />} />
            <Route path="/calibrations" element={<CalibrationList />} />
            <Route path="/calibrations/new" element={<CalibrationFormPage />} />
            <Route path="/maintenance" element={<MaintenanceList />} />
          </Routes>
        </Layout>
      </Box>
    </NotificationProvider>
  );
}

export default App;
