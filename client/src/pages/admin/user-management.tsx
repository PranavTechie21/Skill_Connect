import React, { useState } from 'react';
import AdminBackButton from '@/components/AdminBackButton';
import {
  Users, Search, Filter, MoreVertical, Eye, Edit, Trash2, Ban,
  CheckCircle, XCircle, Mail, Phone, MapPin, Calendar, UserCheck,
  Building2, Briefcase, Download, Upload, Plus, Star, Shield,
  Activity, Clock, ArrowUpRight, Zap, Crown, Award, TrendingUp
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'employee' | 'employer';
  status: 'active' | 'suspended' | 'pending';
  location: string;
  joinDate: string;
  lastActive: string;
  stats?: {
    applications?: number;
    interviews?: number;
    jobs?: number;
    hires?: number;
  };
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    type: 'employee',
    status: 'active',
    location: 'San Francisco, CA',
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    stats: { applications: 12, interviews: 3 }
  },
  {
    id: '2',
    name: 'TechCorp Inc.',
    email: 'hr@techcorp.com',
    phone: '+1 (555) 234-5678',
    type: 'employer',
    status: 'active',
    location: 'New York, NY',
    joinDate: '2024-01-10',
    lastActive: '1 day ago',
    stats: { jobs: 8, hires: 5 }
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 345-6789',
    type: 'employee',
    status: 'pending',
    location: 'Austin, TX',
    joinDate: '2024-01-20',
    lastActive: '5 minutes ago',
    stats: { applications: 5, interviews: 1 }
  },
  {
    id: '4',
    name: 'StartupXYZ',
    email: 'contact@startupxyz.com',
    phone: '+1 (555) 456-7890',
    type: 'employer',
    status: 'active',
    location: 'Remote',
    joinDate: '2024-01-18',
    lastActive: '3 hours ago',
    stats: { jobs: 12, hires: 8 }
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 567-8901',
    type: 'employee',
    status: 'suspended',
    location: 'Seattle, WA',
    joinDate: '2023-12-05',
    lastActive: '1 week ago',
    stats: { applications: 8, interviews: 2 }
  },
  {
    id: '6',
    name: 'DesignStudio',
    email: 'hello@designstudio.com',
    phone: '+1 (555) 678-9012',
    type: 'employer',
    status: 'active',
    location: 'Los Angeles, CA',
    joinDate: '2024-01-12',
    lastActive: '5 hours ago',
    stats: { jobs: 6, hires: 3 }
  }
];

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'employee' | 'employer'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const pendingUsers = mockUsers.filter(u => u.status === 'pending').length;
  const suspendedUsers = mockUsers.filter(u => u.status === 'suspended').length;

  const getStatusBadge = (status: string) => {
    const configs = {
      active: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      suspended: 'bg-red-100 text-red-700 border-red-200'
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4"><AdminBackButton /></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/50 animate-pulse-slow">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">Manage all platform users and their accounts</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Total Users</p>
              <p className="text-4xl font-black text-gray-900">{totalUsers}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Active</p>
              <p className="text-4xl font-black text-gray-900">{activeUsers}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Pending</p>
              <p className="text-4xl font-black text-gray-900">{pendingUsers}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-lg">
                  <Ban className="w-6 h-6 text-white" />
                </div>
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Suspended</p>
              <p className="text-4xl font-black text-gray-900">{suspendedUsers}</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-2 border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-6 py-4 rounded-xl font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('employee')}
                className={`px-6 py-4 rounded-xl font-bold transition-all ${
                  filterType === 'employee'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Employees
              </button>
              <button
                onClick={() => setFilterType('employer')}
                className={`px-6 py-4 rounded-xl font-bold transition-all ${
                  filterType === 'employer'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Employers
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold cursor-pointer focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">
                <Download className="w-5 h-5" />
                Export
              </button>
              <button className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-300 overflow-hidden"
            >
              <div className="p-6">
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${
                      user.type === 'employee'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : 'bg-gradient-to-br from-purple-500 to-pink-600'
                    }`}>
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-black text-gray-900">{user.name}</h3>
                        {user.type === 'employer' && (
                          <Crown className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.type === 'employee'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {user.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative group/menu">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-gray-200 py-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-semibold text-gray-700">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-semibold text-gray-700">
                        <Edit className="w-4 h-4" />
                        Edit User
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm font-semibold text-gray-700">
                        <Mail className="w-4 h-4" />
                        Send Email
                      </button>
                      <div className="border-t border-gray-100 my-2"></div>
                      {user.status === 'active' ? (
                        <button className="w-full px-4 py-2 text-left hover:bg-amber-50 flex items-center gap-3 text-sm font-semibold text-amber-600">
                          <Ban className="w-4 h-4" />
                          Suspend User
                        </button>
                      ) : (
                        <button className="w-full px-4 py-2 text-left hover:bg-green-50 flex items-center gap-3 text-sm font-semibold text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Activate User
                        </button>
                      )}
                      <button className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-sm font-semibold text-red-600">
                        <Trash2 className="w-4 h-4" />
                        Delete User
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </span>
                    <span className="text-sm font-bold text-gray-900">{user.location}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined
                    </span>
                    <span className="text-sm font-bold text-gray-900">{user.joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Last Active
                    </span>
                    <span className="text-sm font-bold text-gray-900">{user.lastActive}</span>
                  </div>
                </div>

                {/* Stats */}
                {user.stats && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {user.type === 'employee' ? (
                      <>
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                          <p className="text-xs font-bold text-blue-600 mb-1">Applications</p>
                          <p className="text-2xl font-black text-gray-900">{user.stats.applications}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                          <p className="text-xs font-bold text-green-600 mb-1">Interviews</p>
                          <p className="text-2xl font-black text-gray-900">{user.stats.interviews}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                          <p className="text-xs font-bold text-purple-600 mb-1">Job Postings</p>
                          <p className="text-2xl font-black text-gray-900">{user.stats.jobs}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-200">
                          <p className="text-xs font-bold text-orange-600 mb-1">Hires Made</p>
                          <p className="text-2xl font-black text-gray-900">{user.stats.hires}</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t-2 border-gray-100">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <Eye className="w-5 h-5" />
                    View Profile
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border-2 border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query.</p>
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-black text-gray-900">User Profile</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <XCircle className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ${
                      selectedUser.type === 'employee'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : 'bg-gradient-to-br from-purple-500 to-pink-600'
                    }`}>
                      {selectedUser.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{selectedUser.name}</h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-500 mb-1">TYPE</p>
                      <p className="text-lg font-black text-gray-900 capitalize">{selectedUser.type}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-500 mb-1">STATUS</p>
                      <p className="text-lg font-black text-gray-900 capitalize">{selectedUser.status}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-500 mb-1">LOCATION</p>
                      <p className="text-lg font-black text-gray-900">{selectedUser.location}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-sm font-bold text-gray-500 mb-1">JOINED</p>
                      <p className="text-lg font-black text-gray-900">{selectedUser.joinDate}</p>
                    </div>
                  </div>

                  {selectedUser.stats && (
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                      <h4 className="text-lg font-black text-gray-900 mb-4">Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedUser.stats).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm font-semibold text-gray-600 capitalize">{key}</p>
                            <p className="text-3xl font-black text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                      Edit User
                    </button>
                    <button className="px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all border-2 border-red-200">
                      Delete
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

export default UserManagement;