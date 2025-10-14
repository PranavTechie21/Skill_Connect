import { useState } from 'react';
import { Search, Filter, Star, MapPin, Briefcase, Mail, Phone, Download, Eye, CheckCircle, XCircle, Clock, TrendingUp, Users, Award } from 'lucide-react';

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const stats = [
    { label: 'Total Applications', value: '847', icon: Users, trend: '+12%', color: 'from-blue-500 to-cyan-500' },
    { label: 'Shortlisted', value: '142', icon: Star, trend: '+8%', color: 'from-purple-500 to-pink-500' },
    { label: 'In Review', value: '89', icon: Clock, trend: '+23%', color: 'from-orange-500 to-red-500' },
    { label: 'Hired', value: '34', icon: Award, trend: '+5%', color: 'from-green-500 to-emerald-500' }
  ];

  const candidates = [
    {
      id: 1,
      name: 'Sarah Chen',
      position: 'Senior Full Stack Developer',
      location: 'San Francisco, CA',
      experience: '7 years',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
      status: 'shortlisted',
      rating: 4.8,
      salary: '$140k - $160k',
      appliedDate: '2 days ago',
      matchScore: 95,
      avatar: 'SC'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      position: 'DevOps Engineer',
      location: 'Austin, TX',
      experience: '5 years',
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'Python', 'Terraform'],
      status: 'new',
      rating: 4.6,
      salary: '$120k - $140k',
      appliedDate: '1 day ago',
      matchScore: 88,
      avatar: 'MJ'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'UX/UI Designer',
      location: 'New York, NY',
      experience: '6 years',
      skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems'],
      status: 'interview',
      rating: 4.9,
      salary: '$110k - $130k',
      appliedDate: '5 days ago',
      matchScore: 92,
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Data Scientist',
      location: 'Seattle, WA',
      experience: '4 years',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'R'],
      status: 'shortlisted',
      rating: 4.7,
      salary: '$130k - $150k',
      appliedDate: '3 days ago',
      matchScore: 90,
      avatar: 'DK'
    },
    {
      id: 5,
      name: 'Priya Sharma',
      position: 'Product Manager',
      location: 'Boston, MA',
      experience: '8 years',
      skills: ['Agile', 'Product Strategy', 'Analytics', 'Leadership', 'Jira'],
      status: 'new',
      rating: 4.8,
      salary: '$145k - $165k',
      appliedDate: '12 hours ago',
      matchScore: 87,
      avatar: 'PS'
    },
    {
      id: 6,
      name: 'Alex Thompson',
      position: 'Backend Developer',
      location: 'Remote',
      experience: '6 years',
      skills: ['Java', 'Spring Boot', 'Microservices', 'MongoDB', 'Redis'],
      status: 'rejected',
      rating: 4.4,
      salary: '$115k - $135k',
      appliedDate: '1 week ago',
      matchScore: 78,
      avatar: 'AT'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      shortlisted: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      interview: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return colors[status] || colors.new;
  };

  const getStatusIcon = (status) => {
    const icons = {
      new: Clock,
      shortlisted: Star,
      interview: Eye,
      rejected: XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const filteredCandidates = candidates.filter(c => 
    (filterStatus === 'all' || c.status === filterStatus) &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Candidate Applications
          </h1>
          <p className="text-gray-400">Manage and review applications from top talent</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" 
                     style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className="flex items-center text-green-400 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.trend}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search candidates by name or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'new', 'shortlisted', 'interview', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl font-medium capitalize transition-all ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-900/50 text-gray-400 hover:text-gray-200 border border-slate-700/50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Match Score Badge */}
              <div className="absolute top-4 right-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  candidate.matchScore >= 90 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  candidate.matchScore >= 80 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {candidate.matchScore}% Match
                </div>
              </div>

              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {candidate.avatar}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{candidate.name}</h3>
                  <p className="text-gray-400 mb-2">{candidate.position}</p>
                  
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                    {getStatusIcon(candidate.status)}
                    <span className="capitalize">{candidate.status}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  {candidate.location}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Briefcase className="w-4 h-4" />
                  {candidate.experience} experience
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  {candidate.rating} rating
                </div>
                <div className="text-gray-400 text-sm">
                  <span className="text-green-400 font-semibold">{candidate.salary}</span> expected
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {candidate.skills.slice(0, 4).map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-900/50 border border-slate-700/50 rounded-lg text-xs text-gray-300">
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 4 && (
                  <span className="px-3 py-1 bg-slate-900/50 border border-slate-700/50 rounded-lg text-xs text-gray-400">
                    +{candidate.skills.length - 4} more
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className="text-gray-500 text-sm">Applied {candidate.appliedDate}</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-700/50 rounded-lg transition-all group/btn">
                    <Mail className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-400 transition-colors" />
                  </button>
                  <button className="p-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-700/50 rounded-lg transition-all group/btn">
                    <Download className="w-4 h-4 text-gray-400 group-hover/btn:text-purple-400 transition-colors" />
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCandidates.length === 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No candidates found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}