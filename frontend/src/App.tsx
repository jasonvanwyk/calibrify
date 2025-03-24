import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EquipmentList from "./pages/EquipmentList";
import EquipmentDetail from "./pages/EquipmentDetail";
import CalibrationList from "./pages/CalibrationList";
import MaintenanceList from "./pages/MaintenanceList";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/calibrations" element={<CalibrationList />} />
          <Route path="/maintenance" element={<MaintenanceList />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;
