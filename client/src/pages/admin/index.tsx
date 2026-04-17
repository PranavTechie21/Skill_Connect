import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './dashboard';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<AdminDashboard />} />
      <Route path="jobs" element={<AdminDashboard />} />
      <Route path="companies" element={<AdminDashboard />} />
      <Route path="analytics" element={<AdminDashboard />} />
      <Route path="applications" element={<AdminDashboard />} />
      <Route path="approvals" element={<AdminDashboard />} />
      <Route path="employees" element={<AdminDashboard />} />
      <Route path="stories" element={<AdminDashboard />} />
      <Route path="settings" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
