import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  ThumbsUp, 
  Share, 
  Bookmark,
  Calendar,
  MapPin,
  DollarSign,
  Building,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  Play,
  Pause,
  Heart
} from 'lucide-react';

// Type definitions
interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  applicants: number;
  status: 'active' | 'paused' | 'closed';
  description: string;
  requirements: string[];
}

interface CompanyStory {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  isVideo: boolean;
  duration?: string;
}

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  position: string;
  match: number;
  status: 'new' | 'reviewed' | 'interview' | 'rejected' | 'hired';
  lastActivity: string;
  notes: string;
}

interface Metrics {
  totalViews: number;
  engagementRate: number;
  applications: number;
  hires: number;
}

// Custom hook for employer stories
const useEmployerStories = () => {
  const [stories, setStories] = useState<CompanyStory[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalViews: 0,
    engagementRate: 0,
    applications: 0,
    hires: 0
  });

  useEffect(() => {
    // Mock data initialization
    const mockStories: CompanyStory[] = [
      {
        id: '1',
        title: 'Our Team Building Retreat 2024',
        content: 'Amazing team building activities in the mountains! Building stronger connections and creating unforgettable memories.',
        image: '/api/placeholder/400/300',
        date: '2 hours ago',
        likes: 24,
        comments: 8,
        shares: 3,
        isVideo: false
      },
      {
        id: '2',
        title: 'Meet Our New Office Space',
        content: 'Take a virtual tour of our brand new downtown office featuring state-of-the-art facilities and collaborative spaces.',
        image: '/api/placeholder/400/300',
        date: '1 day ago',
        likes: 56,
        comments: 12,
        shares: 7,
        isVideo: true,
        duration: '2:30'
      },
      {
        id: '3',
        title: 'Employee Spotlight: Sarah Chen',
        content: 'Celebrating Sarah\'s 5-year anniversary with us and her incredible journey from intern to senior developer.',
        image: '/api/placeholder/400/300',
        date: '3 days ago',
        likes: 89,
        comments: 15,
        shares: 4,
        isVideo: false
      }
    ];

    const mockJobs: JobPost[] = [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        salary: '$120,000 - $150,000',
        type: 'Full-time',
        postedDate: '2024-01-15',
        applicants: 24,
        status: 'active',
        description: 'We are looking for an experienced Frontend Developer to join our growing team...',
        requirements: ['React', 'TypeScript', '5+ years experience', 'Team leadership']
      },
      {
        id: '2',
        title: 'Product Manager',
        company: 'Tech Solutions Inc.',
        location: 'Remote',
        salary: '$100,000 - $130,000',
        type: 'Full-time',
        postedDate: '2024-01-10',
        applicants: 18,
        status: 'active',
        description: 'Lead product development initiatives and work with cross-functional teams...',
        requirements: ['Product management', 'Agile methodology', '3+ years experience']
      },
      {
        id: '3',
        title: 'DevOps Engineer',
        company: 'Tech Solutions Inc.',
        location: 'New York, NY',
        salary: '$110,000 - $140,000',
        type: 'Full-time',
        postedDate: '2024-01-05',
        applicants: 12,
        status: 'paused',
        description: 'Manage cloud infrastructure and implement CI/CD pipelines...',
        requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
      }
    ];

    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'Alex Johnson',
        avatar: '/api/placeholder/100/100',
        position: 'Senior Frontend Developer',
        match: 92,
        status: 'interview',
        lastActivity: '2 hours ago',
        notes: 'Strong React background, excellent communication skills'
      },
      {
        id: '2',
        name: 'Maria Garcia',
        avatar: '/api/placeholder/100/100',
        position: 'Product Manager',
        match: 87,
        status: 'reviewed',
        lastActivity: '1 day ago',
        notes: 'Previous experience in SaaS, MBA from Stanford'
      },
      {
        id: '3',
        name: 'David Kim',
        avatar: '/api/placeholder/100/100',
        position: 'DevOps Engineer',
        match: 95,
        status: 'new',
        lastActivity: '3 days ago',
        notes: 'AWS certified, strong Kubernetes experience'
      }
    ];

    setStories(mockStories);
    setJobs(mockJobs);
    setCandidates(mockCandidates);
    setMetrics({
      totalViews: 1247,
      engagementRate: 12.4,
      applications: 54,
      hires: 3
    });
  }, []);

  const createStory = (story: Omit<CompanyStory, 'id'>) => {
    const newStory = { ...story, id: Date.now().toString() };
    setStories(prev => [newStory, ...prev]);
  };

  const likeStory = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { ...story, likes: story.likes + 1 }
        : story
    ));
  };

  const updateCandidateStatus = (candidateId: string, status: Candidate['status']) => {
    setCandidates(prev => prev.map(candidate =>
      candidate.id === candidateId
        ? { ...candidate, status, lastActivity: 'Just now' }
        : candidate
    ));
  };

  return {
    stories,
    jobs,
    candidates,
    metrics,
    createStory,
    likeStory,
    updateCandidateStatus
  };
};

// Main Employer Stories Component
const EmployerStories: React.FC = () => {
  const {
    stories,
    jobs,
    candidates,
    metrics,
    createStory,
    likeStory,
    updateCandidateStatus
  } = useEmployerStories();

  const [activeTab, setActiveTab] = useState<'stories' | 'jobs' | 'candidates'>('stories');
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', content: '', isVideo: false });
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateStory = () => {
    if (newStory.title && newStory.content) {
      createStory({
        ...newStory,
        image: '/api/placeholder/400/300',
        date: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0
      });
      setNewStory({ title: '', content: '', isVideo: false });
      setIsCreatingStory(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Candidate['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Employer Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Share your company story and manage your hiring process
              </p>
            </div>
            <button
              onClick={() => setIsCreatingStory(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Create Story</span>
            </button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.totalViews.toLocaleString()}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.engagementRate}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Applications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.applications}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Successful Hires</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.hires}
                  </p>
                </div>
                <ThumbsUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'stories', label: 'Company Stories', count: stories.length },
                { id: 'jobs', label: 'Job Postings', count: jobs.length },
                { id: 'candidates', label: 'Candidates', count: candidates.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stories Tab */}
            {activeTab === 'stories' && (
              <div className="space-y-6">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    {story.isVideo && (
                      <div className="relative">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          {story.duration}
                        </div>
                      </div>
                    )}
                    {!story.isVideo && (
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {story.title}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {story.date}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {story.content}
                      </p>

                      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => likeStory(story.id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-300"
                          >
                            <Heart className="w-5 h-5" />
                            <span>{story.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-300">
                            <MessageCircle className="w-5 h-5" />
                            <span>{story.comments}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors duration-300">
                            <Share className="w-5 h-5" />
                            <span>{story.shares}</span>
                          </button>
                        </div>
                        <button className="text-gray-500 hover:text-yellow-500 transition-colors duration-300">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        job.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : job.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-300">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors duration-300">
                          <MessageCircle className="w-4 h-4" />
                          <span>Contact</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Candidates Tab */}
            {activeTab === 'candidates' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300">
                      <Filter className="w-5 h-5" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                {/* Candidates List */}
                <div className="space-y-4">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {candidate.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                {candidate.position}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${candidate.match}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {candidate.match}%
                                </span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                                {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            {candidate.notes}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>Last activity: {candidate.lastActivity}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <select
                                value={candidate.status}
                                onChange={(e) => updateCandidateStatus(candidate.id, e.target.value as Candidate['status'])}
                                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="new">New</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="interview">Interview</option>
                                <option value="rejected">Rejected</option>
                                <option value="hired">Hired</option>
                              </select>
                              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-300">
                                <MessageCircle className="w-4 h-4" />
                                <span>Message</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-300">
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Active Jobs</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {jobs.filter(job => job.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">New Candidates</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {candidates.filter(c => c.status === 'new').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Interviews</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {candidates.filter(c => c.status === 'interview').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Stories This Month</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {stories.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {candidates.slice(0, 3).map((candidate) => (
                  <div key={candidate.id} className="flex items-center space-x-3">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-semibold">{candidate.name}</span> applied for {candidate.position}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {candidate.lastActivity}
                      </p>
                    </div>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-300 text-sm font-medium">
                  <span>View All Activity</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Team Meeting
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Tomorrow, 10:00 AM
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Interview: Alex Johnson
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Jan 20, 2:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Story Modal */}
      {isCreatingStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Story
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter story title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Story Content
                </label>
                <textarea
                  value={newStory.content}
                  onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share your company story..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVideo"
                  checked={newStory.isVideo}
                  onChange={(e) => setNewStory({ ...newStory, isVideo: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isVideo" className="text-sm text-gray-700 dark:text-gray-300">
                  This is a video story
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsCreatingStory(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStory}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
              >
                Create Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerStories;