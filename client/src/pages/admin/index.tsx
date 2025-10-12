import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './dashboard';
import AdminSettings from './settings';
import UserManagement from './user-management';
import JobPostings from './job-postings';
import CompanyManagement from './employers';
import Analytics from './analytics';
import AdminEmployees from './employees';
import AdminApplications from './applications';
import AdminApprovals from './approvals';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
  <Route path="jobs" element={<JobPostings />} />
      <Route path="companies" element={<CompanyManagement />} />
  <Route path="analytics" element={<Analytics />} />
  <Route path="applications" element={<AdminApplications />} />
  <Route path="approvals" element={<AdminApprovals />} />
  <Route path="employees" element={<AdminEmployees />} />
  <Route path="settings" element={<AdminSettings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
