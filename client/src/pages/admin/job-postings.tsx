import React, { useState, useEffect } from 'react';
import AdminBackButton, { useAdminEmbedded } from '@/components/AdminBackButton';
import {
  Briefcase, Search, Plus, Edit, Trash2, MoreVertical, DollarSign, MapPin, Building2, Users, CheckCircle, XCircle, Clock, Filter, Pause, Play, Save, TrendingUp, Eye, PauseCircle
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { adminService } from '@/lib/admin-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CompanyForSelect {
  id: string;
  name: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  status: 'Active' | 'Paused' | 'Expired';
  applications: number;
  createdAt: string;
}

export default function JobPostings() {
  const { embedded } = useAdminEmbedded();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyForSelect[]>([]);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    jobType: 'Full-time',
    salaryMin: '',
    salaryMax: '',
    companyId: '',
  });
  
  const { theme } = useTheme();
  const darkMode = typeof window !== 'undefined' && (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));

  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewJob(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handlePostJob = async () => {
    setFormLoading(true);
    setFormError(null);

    if (!newJob.title || !newJob.companyId) {
      setFormError('Job Title and Company are required.');
      setFormLoading(false);
      return;
    }

    try {
      const payload = {
        ...newJob,
        employerId: user?.id,
        salaryMin: newJob.salaryMin ? parseInt(newJob.salaryMin, 10) : undefined,
        salaryMax: newJob.salaryMax ? parseInt(newJob.salaryMax, 10) : undefined,
      };

      const response = await apiFetch('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post job.');
      }

      toast({ title: "Success", description: "Job posted successfully." });
      setIsModalOpen(false);
      setNewJob({ title: '', description: '', requirements: '', location: '', jobType: 'Full-time', salaryMin: '', salaryMax: '', companyId: '' });
      fetchJobs(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setFormError(errorMessage);
      toast({ title: "Error", description: `Failed to post job: ${errorMessage}`, variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getJobs();
      // Assuming getJobs returns jobs posted by admin or has a way to filter them
      // For now, we'll map the response to the local Job interface
      const adminJobs = data.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company?.name || 'Admin Posted',
        location: job.location,
        jobType: job.jobType,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax, // Corrected from salaryMax
        status: (job.status || 'pending').charAt(0).toUpperCase() + (job.status || 'pending').slice(1),
        applications: job.applicationsCount || 0,
        createdAt: job.createdAt,
      }));
      setJobs(adminJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast({ title: "Error", description: "Could not fetch job data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const fetchCompaniesForSelect = async () => {
      try {
        const companiesData = await adminService.getCompanies();
        setCompanies(companiesData.map((c: any) => ({ id: c.id, name: c.name })));
      } catch (error) {
        console.error("Failed to fetch companies for select:", error);
        toast({ title: "Error", description: "Could not load companies for the form.", variant: "destructive" });
      }
    };
    fetchCompaniesForSelect();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All Status' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'Active').length;
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0);
  const avgApplications = totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : '0.0';

  const stats = [
    { label: 'Total Jobs', value: totalJobs.toLocaleString(), change: 'All admin-posted jobs', icon: Briefcase, color: 'bg-orange-500', bgLight: 'bg-orange-50' },
    { label: 'Active Postings', value: activeJobs.toLocaleString(), change: `${totalJobs > 0 ? Math.round((activeJobs / totalJobs) * 100) : 0}% active rate`, icon: CheckCircle, color: 'bg-green-500', bgLight: 'bg-green-50' },
    { label: 'Total Applications', value: totalApplications.toLocaleString(), change: 'Across all jobs', icon: Users, color: 'bg-blue-500', bgLight: 'bg-blue-50' },
    { label: 'Avg. Applications', value: avgApplications, change: 'Per job posting', icon: TrendingUp, color: 'bg-purple-500', bgLight: 'bg-purple-50' }
  ];

  return (
    <div className={`${embedded ? '' : `min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} p-8`}`}>
      {/* Header */}
      <div className={`${embedded ? 'mb-6' : `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}`}>
        <div className={`${embedded ? '' : 'max-w-7xl mx-auto px-6 py-6'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="mr-4"><AdminBackButton /></div>
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-4 rounded-2xl shadow-lg shadow-orange-500/40">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-4xl font-black ${darkMode ? 'text-white' : 'bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent'}`}>Admin Job Postings</h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Create and manage jobs posted by admin team</p>
              </div>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-amber-800 transition-all shadow-lg">
                  <Plus className="w-5 h-5" />
                  Post New Job
                </button>
              </DialogTrigger>
              <DialogContent className={`sm:max-w-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <DialogHeader>
                  <DialogTitle>Post a New Job</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new job posting.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                  {formError && <p className="text-red-500 text-sm">{formError}</p>}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" value={newJob.title} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="companyId" className="text-right">Company</Label>
                    <Select onValueChange={(value) => handleSelectChange('companyId', value)} value={newJob.companyId}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map(company => (
                          <SelectItem key={company.id} value={company.id.toString()}>{company.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">Location</Label>
                    <Input id="location" value={newJob.location} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="jobType" className="text-right">Job Type</Label>
                    <Select onValueChange={(value) => handleSelectChange('jobType', value)} value={newJob.jobType}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="salaryMin" className="text-right">Salary Range</Label>
                    <div className="col-span-3 grid grid-cols-2 gap-2">
                      <Input id="salaryMin" type="number" placeholder="Min" value={newJob.salaryMin} onChange={handleInputChange} />
                      <Input id="salaryMax" type="number" placeholder="Max" value={newJob.salaryMax} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">Description</Label>
                    <Textarea id="description" value={newJob.description} onChange={handleInputChange} className="col-span-3" rows={4} />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="requirements" className="text-right pt-2">Requirements</Label>
                    <Textarea id="requirements" value={newJob.requirements} onChange={handleInputChange} className="col-span-3" rows={4} />
                  </div>
                </div>
                <DialogFooter>
                  <button type="submit" onClick={handlePostJob} disabled={formLoading} className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors ${
                    formLoading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                  }`}>
                    <Save className="w-5 h-5" />
                    {formLoading ? 'Posting...' : 'Post Job'}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className={`${embedded ? '' : 'max-w-7xl mx-auto px-6 py-8'}`}>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl shadow-lg border-2 p-6 hover:shadow-xl transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${darkMode ? stat.color + '/20' : stat.bgLight} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className={`w-2 h-2 rounded-full ${stat.color} animate-pulse`}></div>
              </div>
              <div>
                <h3 className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium mb-1`}>{stat.label}</h3>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{stat.value}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl shadow-xl border-2`}>
          {/* Search and Filter Bar */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'} w-5 h-5`} />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-11 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none cursor-pointer ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Expired</option>
                </select>
                <button className={`px-4 py-3 rounded-lg transition-colors ${
                  darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-400' : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                }`}>
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {filteredJobs.map((job) => (
              <div key={job.id} className={`p-6 ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} transition-colors`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`bg-orange-500 w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                      AP
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                          <div className={`flex items-center gap-3 text-sm mb-3 flex-wrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              Admin Team
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {job.jobType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Job Details Grid */}
                      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg p-4 mb-4 ${
                        darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                      }`}>
                        <div>
                          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Salary Range</p>
                          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.salaryMin && job.salaryMax ? `$${job.salaryMin/1000}k - $${job.salaryMax/1000}k` : 'N/A'}</p>
                        </div>
                        <div>
                          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Applications</p>
                          <p className="font-bold text-sm text-blue-500">{job.applications} applied</p>
                        </div>
                        <div>
                          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.status}</p>
                        </div>
                        <div>
                          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Posted Date</p>
                          <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Expiry Info */}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      darkMode ? (
                        job.status === 'Active' ? 'bg-green-900/30 text-green-400' :
                        job.status === 'Paused' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-gray-800 text-gray-300'
                      ) : (
                        job.status === 'Active' ? 'bg-green-100 text-green-700' :
                        job.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      )
                    }`}>
                      {job.status === 'Active' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                      {job.status === 'Paused' && <PauseCircle className="w-4 h-4 inline mr-1" />}
                      {job.status === 'Expired' && <XCircle className="w-4 h-4 inline mr-1" />}
                      {job.status}
                    </span>
                    <div className="flex gap-2">
                      <button className={`p-2 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                      }`}>
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                      }`}>
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'
                      }`}>
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                      }`}>
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="p-12 text-center">
              <Briefcase className={`w-16 h-16 ${darkMode ? 'text-gray-700' : 'text-gray-300'} mx-auto mb-4`} />
              <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No job postings found</p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}