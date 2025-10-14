import { Outlet } from 'react-router-dom';

export default function EmployerLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}