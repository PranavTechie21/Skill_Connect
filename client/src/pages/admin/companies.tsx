import React, { useState, useEffect } from 'react';
import AdminBackButton, { useAdminEmbedded } from '@/components/AdminBackButton';
import { useTheme } from '@/components/theme-provider';
import { Building2, Search, Plus, Edit, Trash2, MoreVertical, Mail, MapPin, Globe, Users, CheckCircle, XCircle, Clock, Filter, ExternalLink } from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  size: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  logo?: string;
}

export default function AdminCompanies() {
  const { theme } = useTheme();
  const { embedded } = useAdminEmbedded();
  const darkMode = typeof window !== 'undefined' && (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      toast({ title: "Error", description: "Could not fetch company data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleUpdateStatus = async (companyId: string, status: 'approved' | 'rejected') => {
    try {
      await adminService.updateCompany(companyId, { status });
      toast({ title: "Success", description: `Company status updated to ${status}.` });
      fetchCompanies();
    } catch (error) {
      console.error("Failed to update company status:", error);
      toast({ title: "Error", description: "Could not update company status.", variant: "destructive" });
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.industry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      approved: { color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', icon: CheckCircle },
      pending: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400', icon: Clock },
      rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400', icon: XCircle },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const stats = {
    total: companies.length,
    approved: companies.filter((c) => c.status === 'approved').length,
    pending: companies.filter((c) => c.status === 'pending').length,
    rejected: companies.filter((c) => c.status === 'rejected').length,
  };

  return (
    <div className={`${embedded ? '' : `min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} p-8`}`}>
      <div className={`${embedded ? 'space-y-6' : 'max-w-7xl mx-auto'}`}>
        <div className={`${embedded ? 'mb-6' : 'mb-8'}`}>
          <div className="mb-4"><AdminBackButton /></div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/40">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-4xl font-black ${darkMode ? 'text-white' : 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent'}`}>Companies Management</h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Manage and verify company accounts</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all shadow-lg">
              <Plus className="w-5 h-5" />
              Add Company
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {[
              { label: 'Total Companies', value: stats.total, icon: Building2, accent: 'from-purple-500 to-indigo-600' },
              { label: 'Approved', value: stats.approved, icon: CheckCircle, accent: 'from-green-500 to-emerald-600' },
              { label: 'Pending', value: stats.pending, icon: Clock, accent: 'from-amber-500 to-orange-600' },
              { label: 'Rejected', value: stats.rejected, icon: XCircle, accent: 'from-red-500 to-rose-600' },
            ].map((stat) => (
              <div key={stat.label} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl p-6 shadow-lg border-2 hover:shadow-xl transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.accent} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-semibold mb-1`}>{stat.label}</p>
                <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl shadow-xl border-2 w-full`}>
          {/* Search and Filter Bar */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'} w-5 h-5`} />
                <input
                  type="text"
                  placeholder="Search companies by name, industry, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-11 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Companies List */}
          <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {filteredCompanies.map((company) => {
              const statusConfig = getStatusConfig(company.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div
                  key={company.id}
                  className={`p-6 ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'} transition-colors`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                        {company.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{company.name}</h3>
                          <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${statusConfig.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                          <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Building2 className="w-4 h-4" />
                            <span className="font-semibold">{company.industry || 'N/A'}</span>
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <MapPin className="w-4 h-4" />
                            <span className="font-semibold">{company.location || 'N/A'}</span>
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Globe className="w-4 h-4" />
                            <span className="font-semibold">{company.size || 'N/A'}</span>
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">{new Date(company.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className={`rounded-2xl p-4 mb-4 ${darkMode ? 'bg-gray-700/40' : 'bg-gray-50'}`}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Website</p>
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm font-semibold flex items-center gap-1 break-all ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
                              >
                                {company.website || 'N/A'} <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <div>
                              <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Company Size</p>
                              <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{company.size || 'N/A'}</p>
                            </div>
                            <div>
                              <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Joined</p>
                              <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{new Date(company.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {company.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateStatus(company.id, 'approved')} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-green-500/10 text-green-400' : 'hover:bg-green-50 text-green-600'}`}><CheckCircle className="w-5 h-5" /></button>
                          <button onClick={() => handleUpdateStatus(company.id, 'rejected')} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'}`}><XCircle className="w-5 h-5" /></button>
                        </>
                      )}
                      <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}><Edit className="w-5 h-5" /></button>
                      <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'}`}><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredCompanies.length === 0 && (
            <div className="p-12 text-center">
              <Building2 className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>No companies found</p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}