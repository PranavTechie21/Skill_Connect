// employer/dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Mail,
  MoreVertical,
  Eye,
  FileText,
  TrendingUp,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Plus,
  MessageSquare,
  BarChart3,
  Download,
  Settings,
  Bell,
} from "lucide-react";

// Types
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  postedDate: string;
  applicationCount: number;
  newApplications: number;
  status: "active" | "paused" | "closed" | "draft";
}

interface Application {
  id: string;
  candidateName: string;
  candidatePhoto?: string;
  jobTitle: string;
  appliedDate: string;
  matchScore: number;
  skills: string[];
  matchedSkills: string[];
  status: "new" | "reviewing" | "shortlisted" | "interview" | "rejected";
}

interface Candidate {
  id: string;
  name: string;
  headline: string;
  location: string;
  photo?: string;
  skills: string[];
  matchPercentage: number;
  experience: string;
}

interface Stats {
  activeJobs: number;
  totalApplications: number;
  shortlistedCandidates: number;
  positionsFilled: number;
}

const EmployerDashboard: React.FC = () => {
  const [company, setCompany] = useState<any>(null);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );
  const [shortlistedCandidates, setShortlistedCandidates] = useState<
    Candidate[]
  >([]);
  const [stats, setStats] = useState<Stats>({
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    positionsFilled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [jobFilter, setJobFilter] = useState<
    "all" | "active" | "paused" | "closed"
  >("all");

  useEffect(() => {
    fetchEmployerDashboard();
  }, []);

  const fetchEmployerDashboard = async () => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setCompany({
        name: "TechCorp Inc.",
        industry: "Technology",
        size: "100-500 employees",
      });

      setActiveJobs([
        {
          id: "1",
          title: "Senior Frontend Developer",
          department: "Engineering",
          location: "San Francisco, CA",
          postedDate: "2024-01-10",
          applicationCount: 45,
          newApplications: 3,
          status: "active",
        },
        {
          id: "2",
          title: "Product Manager",
          department: "Product",
          location: "Remote",
          postedDate: "2024-01-08",
          applicationCount: 28,
          newApplications: 0,
          status: "active",
        },
        {
          id: "3",
          title: "UX Designer",
          department: "Design",
          location: "New York, NY",
          postedDate: "2024-01-05",
          applicationCount: 32,
          newApplications: 5,
          status: "paused",
        },
      ]);

      setRecentApplications([
        {
          id: "1",
          candidateName: "Sarah Johnson",
          jobTitle: "Senior Frontend Developer",
          appliedDate: "2 hours ago",
          matchScore: 92,
          skills: ["React", "TypeScript", "Node.js", "AWS", "TailwindCSS"],
          matchedSkills: ["React", "TypeScript", "TailwindCSS"],
          status: "new",
        },
        {
          id: "2",
          candidateName: "Michael Chen",
          jobTitle: "Product Manager",
          appliedDate: "5 hours ago",
          matchScore: 88,
          skills: ["Product Strategy", "Agile", "JIRA", "Figma", "SQL"],
          matchedSkills: ["Product Strategy", "Agile", "Figma"],
          status: "reviewing",
        },
        {
          id: "3",
          candidateName: "Emily Davis",
          jobTitle: "UX Designer",
          appliedDate: "1 day ago",
          matchScore: 95,
          skills: [
            "Figma",
            "Sketch",
            "User Research",
            "Prototyping",
            "UI Design",
          ],
          matchedSkills: ["Figma", "User Research", "Prototyping", "UI Design"],
          status: "shortlisted",
        },
      ]);

      setShortlistedCandidates([
        {
          id: "1",
          name: "Alex Rodriguez",
          headline: "Senior Full Stack Developer",
          location: "Austin, TX",
          skills: ["React", "Node.js", "Python", "AWS", "MongoDB"],
          matchPercentage: 94,
          experience: "5+ years",
        },
        {
          id: "2",
          name: "Jessica Williams",
          headline: "Product Designer",
          location: "Remote",
          skills: ["Figma", "UI/UX", "Design Systems", "User Research"],
          matchPercentage: 89,
          experience: "4+ years",
        },
      ]);

      setStats({
        activeJobs: 8,
        totalApplications: 156,
        shortlistedCandidates: 23,
        positionsFilled: 3,
      });

      setLoading(false);
    }, 1500);
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    // Update application status
    console.log(`Updating application ${applicationId} to ${newStatus}`);
    // API call would go here
  };

  const handleJobAction = async (jobId: string, action: string) => {
    // Handle job actions
    console.log(`Job ${jobId} - Action: ${action}`);
    // API call would go here
  };

  const JobPostingCard: React.FC<{ job: Job }> = ({ job }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "active":
          return "bg-green-100 text-green-800";
        case "paused":
          return "bg-yellow-100 text-yellow-800";
        case "closed":
          return "bg-gray-100 text-gray-800";
        case "draft":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{job.department}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Posted {job.postedDate}
              </span>
            </div>
          </div>

          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm">
                <span className="font-semibold text-gray-900">
                  {job.applicationCount}
                </span>
                <span className="text-gray-600"> applications</span>
              </span>
            </div>
            {job.newApplications > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {job.newApplications} new
              </span>
            )}
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              job.status
            )}`}
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => handleJobAction(job.id, "viewApplications")}
            className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
          >
            View All Applications →
          </button>
        </div>
      </div>
    );
  };

  const ApplicationCard: React.FC<{ application: Application }> = ({
    application,
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {application.candidateName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">
                {application.candidateName}
              </h4>
              <p className="text-sm text-gray-600">{application.jobTitle}</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
              {application.matchScore}% match
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {application.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className={`text-xs px-2 py-1 rounded ${application.matchedSkills.includes(skill)
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "bg-gray-100 text-gray-700"
                  }`}
              >
                {skill}
              </span>
            ))}
            {application.skills.length > 4 && (
              <span className="text-xs text-gray-500">
                +{application.skills.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Applied {application.appliedDate}
            </span>

            <div className="flex items-center gap-2">
              <select
                value={application.status}
                onChange={(e) =>
                  handleStatusChange(application.id, e.target.value)
                }
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
              </select>

              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <Mail className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <Eye className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {candidate.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-lg">
            {candidate.name}
          </h4>
          <p className="text-gray-600 text-sm">{candidate.headline}</p>
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            {candidate.location}
          </div>
        </div>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {candidate.matchPercentage}% match
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {candidate.skills.map((skill) => (
          <span
            key={skill}
            className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>Experience: {candidate.experience}</span>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
          View Profile
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
          Message
        </button>
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {company?.name}!
              </h1>
              <p className="text-gray-600">Manage your hiring pipeline</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Post New Job
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeJobs}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalApplications}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.shortlistedCandidates}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Positions Filled
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.positionsFilled}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Job Postings */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Active Job Postings
                </h2>
                <div className="flex items-center gap-4">
                  <select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Jobs</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View All Jobs →
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {activeJobs.map((job) => (
                  <JobPostingCard key={job.id} job={job} />
                ))}
              </div>
            </section>

            {/* Recent Applications */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Applications
                </h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All Applications →
                </button>
              </div>
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-700">
                    Post a New Job
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <Search className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    Search Candidates
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    Schedule Interviews
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    View Analytics
                  </span>
                </button>
              </div>
            </section>

            {/* Shortlisted Candidates */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Shortlisted Candidates
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {shortlistedCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </section>

            {/* Hiring Pipeline Overview */}
            <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hiring Pipeline
              </h3>
              <div className="space-y-3">
                {[
                  {
                    stage: "New Applications",
                    count: 12,
                    color: "bg-blue-500",
                  },
                  { stage: "Under Review", count: 8, color: "bg-yellow-500" },
                  { stage: "Shortlisted", count: 5, color: "bg-purple-500" },
                  { stage: "Interview", count: 3, color: "bg-green-500" },
                  { stage: "Offer Extended", count: 1, color: "bg-indigo-500" },
                  { stage: "Hired", count: 2, color: "bg-teal-500" },
                ].map((item, index) => (
                  <div
                    key={item.stage}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${item.color}`}
                      ></div>
                      <span className="text-sm text-gray-700">
                        {item.stage}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
