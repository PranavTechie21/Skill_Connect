// employee/dashboard.tsx
import React, { useState, useEffect } from 'react';
import {Search,MapPin,Bookmark,Bell,MessageSquare,User,FileText,TrendingUp,Clock,CheckCircle,XCircle,AlertCircle,Filter,Plus,Settings,Mail,Star,Calendar,Download,Upload} from 'lucide-react';

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  salary: string;
  matchPercentage: number;
  postedTime: string;
  isNew: boolean;
  companyLogo?: string;
  applicationStatus?: 'pending' | 'reviewed' | 'interview' | 'rejected';
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected';
}

interface UserStats {
  totalApplications: number;
  pendingApplications: number;
  interviewInvitations: number;
  profileCompletion: number;
}

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js'],
    salary: '$120,000 - $150,000',
    matchPercentage: 95,
    postedTime: '2 days ago',
    isNew: true
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    skills: ['React', 'Python', 'PostgreSQL', 'AWS'],
    salary: '$100,000 - $130,000',
    matchPercentage: 88,
    postedTime: '1 week ago',
    isNew: false
  },
  {
    id: '3',
    title: 'UI/UX Developer',
    company: 'DesignStudio',
    location: 'New York, NY',
    skills: ['React', 'Figma', 'CSS', 'JavaScript'],
    salary: '$90,000 - $110,000',
    matchPercentage: 76,
    postedTime: '3 days ago',
    isNew: true
  },
  {
    id: '4',
    title: 'React Native Developer',
    company: 'MobileFirst',
    location: 'Austin, TX',
    skills: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    salary: '$95,000 - $120,000',
    matchPercentage: 82,
    postedTime: '5 days ago',
    isNew: false
  }
];

const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    appliedDate: '2024-01-15',
    status: 'pending'
  },
  {
    id: '2',
    jobId: '2',
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    appliedDate: '2024-01-12',
    status: 'reviewed'
  },
  {
    id: '3',
    jobId: '3',
    jobTitle: 'UI/UX Developer',
    company: 'DesignStudio',
    appliedDate: '2024-01-10',
    status: 'interview'
  }
];

const EmployeeDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalApplications: 12,
    pendingApplications: 3,
    interviewInvitations: 2,
    profileCompletion: 75
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Simulate API call
    setTimeout(() => {
      setRecommendedJobs(mockJobs);
      setRecentApplications(mockApplications);
      setUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
        location: 'San Francisco, CA'
      });
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      reviewed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      interview: { color: 'bg-green-100 text-green-800', icon: TrendingUp },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {job.company.substring(0, 2)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
              {job.title}
            </h3>
            <p className="text-gray-600 text-sm">{job.company}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {job.isNew && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
            {job.matchPercentage}% Match
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <MapPin className="w-4 h-4" />
        <span>{job.location}</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map(skill => (
          <span key={skill} className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="font-semibold text-gray-900">{job.salary}</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
            Quick Apply
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Bookmark className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Posted {job.postedTime}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">Here's your job search dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interviewInvitations}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Complete</p>
                <p className="text-2xl font-bold text-gray-900">{stats.profileCompletion}%</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${stats.profileCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Search Section */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Your Next Opportunity</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search jobs, companies, keywords..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Search
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                  </button>
                  <span className="text-sm text-gray-500">1,234 jobs available</span>
                </div>

                {showAdvancedFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                      <option>Location</option>
                      <option>Remote</option>
                      <option>San Francisco, CA</option>
                      <option>New York, NY</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                      <option>Job Type</option>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                      <option>Experience</option>
                      <option>Entry Level</option>
                      <option>Mid Level</option>
                      <option>Senior Level</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                      <option>Salary Range</option>
                      <option>$50k - $80k</option>
                      <option>$80k - $120k</option>
                      <option>$120k+</option>
                    </select>
                  </div>
                )}
              </div>
            </section>

            {/* Recommended Jobs Section */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Jobs Matched to Your Skills</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All Recommendations →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>

            {/* Recent Applications Section */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All Applications →
                </button>
              </div>
              <div className="space-y-4">
                {recentApplications.map(application => (
                  <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {application.company.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{application.jobTitle}</h3>
                        <p className="text-gray-600 text-sm">{application.company}</p>
                        <p className="text-gray-500 text-xs">Applied on {application.appliedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(application.status)}
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Upload Resume</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <Plus className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Add Skills</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Set Job Alerts</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bookmark className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Saved Jobs (5)</span>
                </button>
              </div>
            </section>

            {/* Profile Completion */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Basic Information</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills Added</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resume Uploaded</span>
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Portfolio Added</span>
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Complete Profile
                </button>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Interview Scheduled</p>
                    <p className="text-xs text-gray-600">DesignStudio - UI/UX Developer</p>
                    <p className="text-xs text-gray-500">Today at 2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">New Message</p>
                    <p className="text-xs text-gray-600">From TechCorp HR</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Viewed</p>
                    <p className="text-xs text-gray-600">By 3 employers this week</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;