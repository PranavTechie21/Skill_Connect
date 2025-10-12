import React from 'react';
import AdminBackButton from '@/components/AdminBackButton';
import { Briefcase, Building2, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

type Job = {
  id: string;
  title: string;
  company: string;
  location?: string;
  postedDate: string;
  status: 'active' | 'paused' | 'closed';
  applications: number;
};

const mockJobs: Job[] = [
  { id: 'j1', title: 'Senior Frontend Engineer', company: 'TechCorp Inc.', location: 'San Francisco, CA', postedDate: '2024-09-01', status: 'active', applications: 42 },
  { id: 'j2', title: 'Product Manager', company: 'StartupXYZ', location: 'Remote', postedDate: '2024-08-25', status: 'paused', applications: 18 },
  { id: 'j3', title: 'Backend Engineer', company: 'DesignStudio', location: 'Los Angeles, CA', postedDate: '2024-08-20', status: 'active', applications: 27 }
];

export default function JobManagement(): JSX.Element {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4">
        <AdminBackButton />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Job Postings</h1>
            <p className="text-sm text-gray-500">Manage active and historic job postings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl">Create Job</button>
        </div>
      </div>

      <div className="space-y-4">
        {mockJobs.map((job) => (
          <div key={job.id} className="p-4 border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {job.company.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg">{job.title}</h3>
                <div className="text-sm text-gray-500 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{job.company}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{job.postedDate}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{job.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${job.status === 'active' ? 'bg-emerald-50 text-emerald-700' : job.status === 'paused' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-700'}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100"><Eye className="w-4 h-4" /></button>
                <button className="p-2 rounded-lg hover:bg-gray-100"><Edit className="w-4 h-4" /></button>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 