import React from "react";
import { Link } from "react-router-dom";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
            <div className="text-xl font-bold">SkillConnect</div>
          </Link>
          <div className="text-sm text-muted-foreground">Professional Dashboard</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <nav className="space-y-2">
              <Link to="/employee/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Overview</Link>
              <Link to="/applications" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Applications</Link>
              <Link to="/jobs" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Browse Jobs</Link>
              <Link to="/profile" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
            </nav>
          </aside>

          <main className="col-span-1 lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
