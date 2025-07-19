import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
// ...autres imports

const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    {/* autres routes existantes */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRouter;
