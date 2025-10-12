import React, { useState } from 'react';
import AdminBackButton from '@/components/AdminBackButton';
import {
  FileText, Search, Filter, Eye, CheckCircle, XCircle, Clock,
  TrendingUp, Users, Briefcase, Star, Calendar, MapPin, Mail,
  Download, MoreVertical, User, Building2, Award, Zap, Target,
  Activity, ArrowUpRight, ThumbsUp, ThumbsDown, MessageSquare,
  Phone, ExternalLink, ChevronDown, AlertCircle, DollarSign
} from 'lucide-react';

interface Application {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'accepted';
  matchScore: number;
  experience: string;
  location: string;
  salary: string;
  skills: string[];
}

const mockApplications: Application[] = [
  {
    id: '1',
    candidateName: 'John Doe',
    candidateEmail: 'john@example.com',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    appliedDate: '2024-01-20',
    status: 'interview',
    matchScore: 95,
    experience: '5+ years',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    skills: ['React', 'TypeScript', 'Node.js']
  },
  {
    id: '2',
    candidateName: 'Jane Smith',
    candidateEmail: 'jane@example.com',
    jobTitle: 'Product Manager',
    company: 'StartupXYZ',
    appliedDate: '2024-01-19',
    status: 'shortlisted',
    matchScore: 88,
    experience: '3+ years',
    location: 'New York, NY',
    salary: '$100k - $130k',
    skills: ['Product Strategy', 'Agile', 'Analytics']
  },
  {
    id: '3',
    candidateName: 'Mike Johnson',
    candidateEmail: 'mike@example.com',
    jobTitle: 'UX Designer',
    company: 'DesignStudio',
    appliedDate: '2024-01-18',
    status: 'reviewing',
    matchScore: 82,
    experience: '4+ years',
    location: 'Remote',
    salary: '$90k - $110k',
    skills: ['Figma', 'UI/UX', 'Prototyping']
  },
  {
    id: '4',
    candidateName: 'Sarah Wilson',
    candidateEmail: 'sarah@example.com',
    jobTitle: 'Full Stack Engineer',
    company: 'TechCorp Inc.',
    appliedDate: '2024-01-17',
    status: 'pending',
    matchScore: 76,
    experience: '2+ years',
    location: 'Austin, TX',
    salary: '$85k - $105k',
    skills: ['Python', 'React', 'PostgreSQL']
  },
  {
    id: '5',
    candidateName: 'David Brown',
    candidateEmail: 'david@example.com',
    jobTitle: 'DevOps Engineer',
    company: 'CloudTech',
    appliedDate: '2024-01-16',
    status: 'accepted',
    matchScore: 92,
    experience: '6+ years',
    location: 'Seattle, WA',
    salary: '$130k - $160k',
    skills: ['AWS', 'Docker', 'Kubernetes']
  },
  {
    id: '6',
    candidateName: 'Emily Davis',
    candidateEmail: 'emily@example.com',
    jobTitle: 'Marketing Manager',
    company: 'GrowthCo',
    appliedDate: '2024-01-15',
    status: 'rejected',
    matchScore: 68,
    experience: '3+ years',
    location: 'Los Angeles, CA',
    salary: '$80k - $100k',
    skills: ['SEO', 'Content Marketing', 'Analytics']
  }
];

const AdminApplications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalApps = mockApplications.length;
  const pendingApps = mockApplications.filter(a => a.status === 'pending').length;
  const interviewApps = mockApplications.filter(a => a.status === 'interview').length;
  const acceptedApps = mockApplications.filter(a => a.status === 'accepted').length;

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' },
      reviewing: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Eye, label: 'Reviewing' },
      shortlisted: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Star, label: 'Shortlisted' },
      interview: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Users, label: 'Interview' },
      accepted: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Rejected' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4"><AdminBackButton /></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/50 animate-pulse-slow">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Applications Management
              </h1>
              <p className="text-gray-600 mt-1">View and manage all job applications</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <Zap className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Total Applications</p>
              <p className="text-4xl font-black text-gray-900">{totalApps}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Pending Review</p>
              <p className="text-4xl font-black text-gray-900">{pendingApps}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Interviews</p>
              <p className="text-4xl font-black text-gray-900">{interviewApps}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <Award className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Accepted</p>
              <p className="text-4xl font-black text-gray-900">{acceptedApps}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-2 border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by candidate name, job title, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold cursor-pointer focus:border-indigo-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>

            <button className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
              <Download className="w-5 h-5" />
              Export Data
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const statusConfig = getStatusConfig(app.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={app.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-indigo-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {/* Left: Candidate Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {app.candidateName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-gray-900">{app.candidateName}</h3>
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border-2 ${statusConfig.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                          </div>
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold">
                            <Target className="w-4 h-4" />
                            {app.matchScore}% Match
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            <span className="font-semibold">{app.jobTitle}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="w-4 h-4" />
                            <span className="font-semibold">{app.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="font-semibold">{app.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="font-semibold">{app.appliedDate}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {app.skills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-bold transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      <div className="relative group/menu">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-gray-200 py-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-semibold text-gray-700">
                            <Mail className="w-4 h-4" />
                            Email Candidate
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-semibold text-gray-700">
                            <Calendar className="w-4 h-4" />
                            Schedule Interview
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-semibold text-gray-700">
                            <Download className="w-4 h-4" />
                            Download Resume
                          </button>
                          <div className="border-t border-gray-100 my-2"></div>
                          <button className="w-full px-4 py-2 text-left hover:bg-green-50 flex items-center gap-3 text-sm font-semibold text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Accept Application
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-sm font-semibold text-red-600">
                            <XCircle className="w-4 h-4" />
                            Reject Application
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="font-semibold">{app.candidateEmail}</span>
                      </span>
                      <span className="flex items-center gap-2 text-gray-600">
                        <Award className="w-4 h-4" />
                        <span className="font-semibold">{app.experience}</span>
                      </span>
                      <span className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">{app.salary}</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all">
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg">
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border-2 border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query.</p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-black text-gray-900">Application Details</h2>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <XCircle className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {selectedApp.candidateName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{selectedApp.candidateName}</h3>
                      <p className="text-gray-600">{selectedApp.candidateEmail}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-500 mb-1">JOB TITLE</p>
                      <p className="text-lg font-black text-gray-900">{selectedApp.jobTitle}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-500 mb-1">COMPANY</p>
                      <p className="text-lg font-black text-gray-900">{selectedApp.company}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-500 mb-1">LOCATION</p>
                      <p className="text-lg font-black text-gray-900">{selectedApp.location}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-500 mb-1">EXPERIENCE</p>
                      <p className="text-lg font-black text-gray-900">{selectedApp.experience}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-500 mb-1">SALARY</p>
                      <p className="text-lg font-black text-gray-900">{selectedApp.salary}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-500 mb-1">MATCH SCORE</p>
                      <p className="text-lg font-black text-gray-900">{selectedApp.matchScore}%</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-3">SKILLS</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.skills.map(skill => (
                        <span key={skill} className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl text-sm font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Schedule Interview
                    </button>
                    <button className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminApplications;