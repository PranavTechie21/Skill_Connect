import React, { useState } from 'react';
import AdminBackButton from '@/components/AdminBackButton';
import { Users, Search, Plus, Edit, Trash2, MoreVertical, Mail, Calendar, MapPin, Briefcase, Award, TrendingUp, Clock, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function AdminEmployees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');

  const stats = [
    { label: 'Total Employees', value: '893', change: '↑ 12 new this week', icon: Users, color: 'bg-green-500', bgLight: 'bg-green-50' },
    { label: 'Active Users', value: '756', change: '85% active rate', icon: CheckCircle, color: 'bg-blue-500', bgLight: 'bg-blue-50' },
    { label: 'Job Applications', value: '1,234', change: '↑ 45 this month', icon: Briefcase, color: 'bg-purple-500', bgLight: 'bg-purple-50' },
    { label: 'Profile Views', value: '8,421', change: '↑ 324 today', icon: Eye, color: 'bg-orange-500', bgLight: 'bg-orange-50' }
  ];

  const employees = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'JD',
      status: 'Active',
      joined: '2024-01-15',
      lastActive: '2 hours ago',
      location: 'San Francisco, CA',
      skills: ['React', 'Node.js', 'TypeScript'],
      applications: 5,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'JS',
      status: 'Active',
      joined: '2024-01-20',
      lastActive: '5 minutes ago',
      location: 'New York, NY',
      skills: ['Python', 'Django', 'PostgreSQL'],
      applications: 8,
      color: 'bg-indigo-500'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'SJ',
      status: 'Active',
      joined: '2024-01-12',
      lastActive: '30 minutes ago',
      location: 'Austin, TX',
      skills: ['UI/UX', 'Figma', 'Design Systems'],
      applications: 3,
      color: 'bg-teal-500'
    },
    {
      id: 4,
      name: 'Michael Chen',
      email: 'michael@example.com',
      avatar: 'MC',
      status: 'Pending',
      joined: '2024-01-25',
      lastActive: '1 day ago',
      location: 'Seattle, WA',
      skills: ['Java', 'Spring Boot', 'AWS'],
      applications: 2,
      color: 'bg-purple-500'
    },
    {
      id: 5,
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      avatar: 'ER',
      status: 'Active',
      joined: '2024-01-08',
      lastActive: '3 hours ago',
      location: 'Miami, FL',
      skills: ['Marketing', 'SEO', 'Content'],
      applications: 6,
      color: 'bg-pink-500'
    },
    {
      id: 6,
      name: 'David Kim',
      email: 'david@example.com',
      avatar: 'DK',
      status: 'Active',
      joined: '2024-01-18',
      lastActive: '1 hour ago',
      location: 'Los Angeles, CA',
      skills: ['iOS', 'Swift', 'Mobile'],
      applications: 4,
      color: 'bg-orange-500'
    },
    {
      id: 7,
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      avatar: 'LA',
      status: 'Inactive',
      joined: '2024-01-05',
      lastActive: '2 weeks ago',
      location: 'Boston, MA',
      skills: ['Data Science', 'Python', 'ML'],
      applications: 1,
      color: 'bg-gray-500'
    },
    {
      id: 8,
      name: 'Alex Martinez',
      email: 'alex@example.com',
      avatar: 'AM',
      status: 'Active',
      joined: '2024-01-22',
      lastActive: '10 minutes ago',
      location: 'Chicago, IL',
      skills: ['DevOps', 'Docker', 'Kubernetes'],
      applications: 7,
      color: 'bg-cyan-500'
    }
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All Status' || employee.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="mr-4"><AdminBackButton /></div>
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-2xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
                <p className="text-gray-500 mt-1">Manage and monitor employee accounts</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgLight} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className={`w-2 h-2 rounded-full ${stat.color} animate-pulse`}></div>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Search and Filter Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search employees by name, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-green-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`${employee.color} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {employee.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{employee.name}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mb-2">
                        <Mail className="w-4 h-4" />
                        {employee.email}
                      </p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {employee.location}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    employee.status === 'Active' ? 'bg-green-100 text-green-700' :
                    employee.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {employee.status}
                  </span>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-4 bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Applications</p>
                    <p className="font-bold text-gray-900">{employee.applications}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Joined</p>
                    <p className="font-semibold text-gray-900 text-xs">{employee.joined}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Active</p>
                    <p className="font-semibold text-gray-900 text-xs">{employee.lastActive}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    <Eye className="w-4 h-4" />
                    View Profile
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No employees found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}