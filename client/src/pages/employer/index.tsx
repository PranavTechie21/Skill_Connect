import { Routes, Route } from 'react-router-dom';
import JobManagement from './job-management';
import Candidates from './candidates';
import Profile from './profile';
import Home from '../home';

export default function EmployerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="jobs" element={<JobManagement />} />
      <Route path="candidates" element={<Candidates />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
}