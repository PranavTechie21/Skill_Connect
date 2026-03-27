import React, { useState, useEffect, useRef } from 'react';
import AdminBackButton from '@/components/AdminBackButton';
import { useTheme } from '@/components/theme-provider';
import {
  BarChart3, TrendingUp, Users, Briefcase, ArrowUp, ArrowDown,
  Calendar, DollarSign, Target, Activity, PieChart, LineChart,
  UserCheck, Building2, CheckCircle, Clock, Filter, Download,
  Eye, Sparkles, Zap, Star, Award, TrendingDown, FileText
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Pie, Cell, PieChart as RechartsPieChart } from 'recharts';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

// Mock data for demonstration
const mockAnalyticsData = {
  userGrowth: [
    { month: 'Jan', users: 1200, employees: 800, employers: 400 },
    { month: 'Feb', users: 1500, employees: 950, employers: 550 },
    { month: 'Mar', users: 1800, employees: 1100, employers: 700 },
    { month: 'Apr', users: 2200, employees: 1400, employers: 800 },
    { month: 'May', users: 2600, employees: 1650, employers: 950 },
    { month: 'Jun', users: 3100, employees: 2000, employers: 1100 },
  ],
  jobCategories: [
    { name: 'Technology', value: 35, color: '#3b82f6' },
    { name: 'Healthcare', value: 25, color: '#22c55e' },
    { name: 'Finance', value: 20, color: '#a855f7' },
    { name: 'Education', value: 12, color: '#f59e0b' },
    { name: 'Other', value: 8, color: '#ef4444' },
  ],
  recentActivities: [
    { type: 'user', action: 'New user registered', user: 'John Doe', time: '2 minutes ago', color: 'blue' },
    { type: 'job', action: 'Job posted', user: 'Tech Corp', time: '5 minutes ago', color: 'green' },
    { type: 'application', action: 'Application submitted', user: 'Sarah Smith', time: '12 minutes ago', color: 'purple' },
    { type: 'hire', action: 'Candidate hired', user: 'MediCare Inc', time: '25 minutes ago', color: 'orange' },
    { type: 'user', action: 'Profile updated', user: 'Mike Johnson', time: '1 hour ago', color: 'blue' },
  ],
  performanceMetrics: {
    employeeSatisfaction: 92,
    employerSatisfaction: 88,
    placementRate: 76,
    avgTimeToHire: 14,
    timeToHireChange: -3,
  },
  stats: {
    totalUsers: 3100,
    newUsers: 245,
    activeJobs: 487,
    newJobs: 52,
    applications: 1842,
    newApplications: 187,
    successRate: 76,
    successRateChange: 3,
  }
};

type AnalyticsData = typeof mockAnalyticsData;
type TimeRangeKey = '7d' | '30d' | '90d' | '1y';

const round = (value: number) => Math.max(0, Math.round(value));

const transformByRange = (range: TimeRangeKey): AnalyticsData => {
  const multipliers: Record<TimeRangeKey, number> = {
    '7d': 0.24,
    '30d': 1,
    '90d': 2.7,
    '1y': 9.8,
  };

  const m = multipliers[range];
  const base = mockAnalyticsData;

  const growthLabels: Record<TimeRangeKey, string[]> = {
    '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    '30d': ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    '90d': ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    '1y': ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
  };

  const userGrowth = base.userGrowth.map((row, idx) => {
    const phase = 1 + idx * 0.08;
    const adjustedUsers = row.users * m * phase;
    return {
      month: growthLabels[range][idx] ?? row.month,
      users: round(adjustedUsers),
      employees: round(adjustedUsers * 0.64),
      employers: round(adjustedUsers * 0.36),
    };
  });

  const shiftByRange: Record<TimeRangeKey, number[]> = {
    '7d': [2, -1, 0, -1, 0],
    '30d': [0, 0, 0, 0, 0],
    '90d': [-2, 1, 1, 0, 0],
    '1y': [-4, 2, 1, 1, 0],
  };

  const jobCategories = base.jobCategories.map((cat, idx) => ({
    ...cat,
    value: Math.max(5, cat.value + shiftByRange[range][idx]),
  }));

  const dynamicStats = {
    totalUsers: round(base.stats.totalUsers * m),
    newUsers: round(base.stats.newUsers * (range === '7d' ? 0.35 : range === '1y' ? 6.8 : m)),
    activeJobs: round(base.stats.activeJobs * (range === '1y' ? 2.9 : range === '90d' ? 1.9 : range === '7d' ? 0.55 : 1)),
    newJobs: round(base.stats.newJobs * (range === '7d' ? 0.35 : range === '1y' ? 6 : m)),
    applications: round(base.stats.applications * (range === '1y' ? 3.3 : range === '90d' ? 2.1 : range === '7d' ? 0.45 : 1)),
    newApplications: round(base.stats.newApplications * (range === '7d' ? 0.32 : range === '1y' ? 5.9 : m)),
    successRate: range === '7d' ? 73 : range === '30d' ? 76 : range === '90d' ? 78 : 81,
    successRateChange: range === '7d' ? 1 : range === '30d' ? 3 : range === '90d' ? 4 : 7,
  };

  const performanceMetrics = {
    employeeSatisfaction: range === '7d' ? 89 : range === '30d' ? 92 : range === '90d' ? 93 : 94,
    employerSatisfaction: range === '7d' ? 84 : range === '30d' ? 88 : range === '90d' ? 89 : 91,
    placementRate: range === '7d' ? 71 : range === '30d' ? 76 : range === '90d' ? 79 : 83,
    avgTimeToHire: range === '7d' ? 17 : range === '30d' ? 14 : range === '90d' ? 12 : 10,
    timeToHireChange: range === '7d' ? -1 : range === '30d' ? -3 : range === '90d' ? -4 : -6,
  };

  const activityByRange: Record<TimeRangeKey, string[]> = {
    '7d': ['2 minutes ago', '5 minutes ago', '12 minutes ago', '25 minutes ago', '1 hour ago'],
    '30d': ['Today, 9:25 AM', 'Today, 8:50 AM', 'Today, 8:20 AM', 'Today, 7:35 AM', 'Today, 6:40 AM'],
    '90d': ['1 day ago', '2 days ago', '3 days ago', '4 days ago', '6 days ago'],
    '1y': ['Last week', '2 weeks ago', '3 weeks ago', 'Last month', '2 months ago'],
  };

  const recentActivities = base.recentActivities.map((a, i) => ({
    ...a,
    time: activityByRange[range][i] ?? a.time,
  }));

  return {
    userGrowth,
    jobCategories,
    recentActivities,
    performanceMetrics,
    stats: dynamicStats,
  };
};

const Analytics = () => {
  const { theme } = useTheme();
  const darkMode = typeof window !== 'undefined' && (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('30d');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Simulate data fetch based on time range
    setLoading(true);
    setTimeout(() => {
      setAnalyticsData(transformByRange(timeRange));
      setLoading(false);
    }, 500);
  }, [timeRange]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const getRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case '1y': return 'Last year';
      default: return 'Custom range';
    }
  };

  const getExportPayload = () => ({
    exportedAt: new Date().toISOString(),
    timeRange: getRangeLabel(),
    stats: analyticsData.stats,
    performanceMetrics: analyticsData.performanceMetrics,
    userGrowth: analyticsData.userGrowth,
    jobCategories: analyticsData.jobCategories,
    recentActivities: analyticsData.recentActivities,
  });

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const content = JSON.stringify(getExportPayload(), null, 2);
    downloadBlob(new Blob([content], { type: 'application/json' }), `analytics-${timeRange}.json`);
  };

  const exportCSV = () => {
    const lines: string[] = [];
    lines.push('Section,Metric,Value');
    lines.push(`Meta,Exported At,${new Date().toISOString()}`);
    lines.push(`Meta,Time Range,${getRangeLabel()}`);
    lines.push('');
    lines.push('Stats,Metric,Value');
    Object.entries(analyticsData.stats).forEach(([k, v]) => lines.push(`Stats,${k},${v}`));
    lines.push('');
    lines.push('Performance,Metric,Value');
    Object.entries(analyticsData.performanceMetrics).forEach(([k, v]) => lines.push(`Performance,${k},${v}`));
    lines.push('');
    lines.push('User Growth,Month,Users,Employees,Employers');
    analyticsData.userGrowth.forEach((row) => lines.push(`User Growth,${row.month},${row.users},${row.employees},${row.employers}`));
    lines.push('');
    lines.push('Job Categories,Category,Share(%)');
    analyticsData.jobCategories.forEach((row) => lines.push(`Job Categories,${row.name},${row.value}`));
    lines.push('');
    lines.push('Recent Activities,Type,Action,User,Time');
    analyticsData.recentActivities.forEach((row) => {
      lines.push(`Recent Activities,${row.type},"${row.action.replace(/"/g, '""')}","${row.user.replace(/"/g, '""')}",${row.time}`);
    });
    downloadBlob(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' }), `analytics-${timeRange}.csv`);
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const statsSheet = XLSX.utils.json_to_sheet(Object.entries(analyticsData.stats).map(([metric, value]) => ({ metric, value })));
    const perfSheet = XLSX.utils.json_to_sheet(Object.entries(analyticsData.performanceMetrics).map(([metric, value]) => ({ metric, value })));
    const growthSheet = XLSX.utils.json_to_sheet(analyticsData.userGrowth);
    const categorySheet = XLSX.utils.json_to_sheet(analyticsData.jobCategories);
    const activitySheet = XLSX.utils.json_to_sheet(analyticsData.recentActivities);
    XLSX.utils.book_append_sheet(wb, statsSheet, 'Stats');
    XLSX.utils.book_append_sheet(wb, perfSheet, 'Performance');
    XLSX.utils.book_append_sheet(wb, growthSheet, 'UserGrowth');
    XLSX.utils.book_append_sheet(wb, categorySheet, 'Categories');
    XLSX.utils.book_append_sheet(wb, activitySheet, 'Activities');
    XLSX.writeFile(wb, `analytics-${timeRange}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 48;
    doc.setFontSize(18);
    doc.text('Analytics Dashboard Report', 40, y);
    y += 22;
    doc.setFontSize(11);
    doc.text(`Time Range: ${getRangeLabel()}`, 40, y);
    y += 16;
    doc.text(`Exported At: ${new Date().toLocaleString()}`, 40, y);
    y += 26;

    doc.setFontSize(13);
    doc.text('Key Stats', 40, y);
    y += 18;
    doc.setFontSize(11);
    Object.entries(analyticsData.stats).forEach(([k, v]) => {
      doc.text(`${k}: ${v}`, 46, y);
      y += 14;
    });

    y += 10;
    doc.setFontSize(13);
    doc.text('Performance Metrics', 40, y);
    y += 18;
    doc.setFontSize(11);
    Object.entries(analyticsData.performanceMetrics).forEach(([k, v]) => {
      doc.text(`${k}: ${v}`, 46, y);
      y += 14;
    });

    y += 10;
    doc.setFontSize(13);
    doc.text('Top Job Categories', 40, y);
    y += 18;
    doc.setFontSize(11);
    analyticsData.jobCategories.forEach((c) => {
      doc.text(`${c.name}: ${c.value}%`, 46, y);
      y += 14;
    });

    doc.save(`analytics-${timeRange}.pdf`);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'json' | 'csv') => {
    switch (format) {
      case 'pdf':
        exportPDF();
        break;
      case 'excel':
        exportExcel();
        break;
      case 'json':
        exportJSON();
        break;
      case 'csv':
        exportCSV();
        break;
    }
    setExportOpen(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} p-8 relative overflow-hidden`}>
      {/* Animated Background Elements - Only show in light mode */}
      {!darkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-float-slow"></div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 relative z-10">
        <div className="mb-4">
          <AdminBackButton />
        </div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse-slow"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/50">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Analytics Dashboard
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 flex items-center gap-2`}>
                Real-time platform insights and metrics
                <span className={`flex items-center gap-1 px-2 py-0.5 ${darkMode ? 'bg-green-900' : 'bg-green-100'} ${darkMode ? 'text-green-300' : 'text-green-700'} rounded-full text-xs font-bold`}>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  Live
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-6 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} border-2 rounded-xl font-semibold cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all shadow-sm`}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setExportOpen((v) => !v)}
                className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Download className="w-5 h-5 relative z-10 group-hover:animate-bounce" />
                <span className="relative z-10">Export</span>
              </button>

              {exportOpen && (
                <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl overflow-hidden z-30`}>
                  {[
                    { label: 'PDF (.pdf)', value: 'pdf' as const },
                    { label: 'Excel (.xlsx)', value: 'excel' as const },
                    { label: 'CSV (.csv)', value: 'csv' as const },
                    { label: 'JSON (.json)', value: 'json' as const },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleExport(opt.value)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium ${
                        darkMode ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className={`group relative ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-300 overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${darkMode ? 'from-blue-900' : 'from-blue-200'} to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} rounded-full text-xs font-bold`}>
                  <ArrowUp className="w-3 h-3" />
                  12%
                </div>
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-semibold mb-1`}>Total Users</p>
              <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{analyticsData.stats.totalUsers.toLocaleString()}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>+{analyticsData.stats.newUsers} from last month</p>
            </div>
          </div>

          {/* Active Jobs */}
          <div className={`group relative ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-green-300 overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${darkMode ? 'from-green-900' : 'from-green-200'} to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} rounded-full text-xs font-bold`}>
                  <ArrowUp className="w-3 h-3" />
                  8%
                </div>
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-semibold mb-1`}>Active Jobs</p>
              <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{analyticsData.stats.activeJobs.toLocaleString()}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>+{analyticsData.stats.newJobs} from last month</p>
            </div>
          </div>

          {/* Applications */}
          <div className={`group relative ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-purple-300 overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${darkMode ? 'from-purple-900' : 'from-purple-200'} to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} rounded-full text-xs font-bold`}>
                  <ArrowUp className="w-3 h-3" />
                  15%
                </div>
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-semibold mb-1`}>Applications</p>
              <p className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{analyticsData.stats.applications.toLocaleString()}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>+{analyticsData.stats.newApplications} from last month</p>
            </div>
          </div>

          {/* Success Rate */}
          <div className="group relative bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                  <ArrowUp className="w-3 h-3" />
                  3%
                </div>
              </div>
              <p className="text-white/90 text-sm font-semibold mb-1">Success Rate</p>
              <p className="text-4xl font-black mb-2">{analyticsData.stats.successRate}%</p>
              <p className="text-xs text-white/80">+{analyticsData.stats.successRateChange}% improvement</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl p-8 border-2`}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>User Growth</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Monthly registration trends</p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                  <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600"></div>
                  <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Employees</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600"></div>
                  <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Employers</span>
                </div>
              </div>
            </div>
            {/* Bar Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.userGrowth}>
                  <XAxis 
                    dataKey="month" 
                    stroke={darkMode ? '#6b7280' : '#9ca3af'} 
                    fontSize={12}
                    tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  />
                  <YAxis 
                    stroke={darkMode ? '#6b7280' : '#9ca3af'} 
                    fontSize={12}
                    tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                      border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: darkMode ? '#f3f4f6' : '#111827'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                  />
                  <Bar dataKey="users" fill="#3b82f6" name="Total" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="employees" fill="#22c55e" name="Employees" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="employers" fill="#a855f7" name="Employers" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Job Categories */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl p-8 border-2`}>
            <div className="mb-6">
              <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Job Categories</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Distribution by industry</p>
            </div>

            {/* Pie Chart */}
            <div className="h-48 mx-auto mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie 
                    data={analyticsData.jobCategories} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80}
                    label={(entry) => `${entry.value}%`}
                  >
                    {analyticsData.jobCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                      border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: darkMode ? '#f3f4f6' : '#111827'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {analyticsData.jobCategories.map((category, index) => (
                <div key={index} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-all cursor-pointer`}>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: category.color }}></div>
                    <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category.name}</span>
                  </div>
                  <span className={`font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Metrics */}
          <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl p-8 border-2`}>
            <div className="mb-6">
              <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Performance Metrics</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Key performance indicators</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 bg-gradient-to-br ${darkMode ? 'from-blue-900/20 to-indigo-900/20 border-blue-800' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-2xl border-2`}>
                <div className="flex items-center justify-between mb-4">
                  <UserCheck className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <Sparkles className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'} animate-pulse`} />
                </div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Employee Satisfaction</p>
                <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{analyticsData.performanceMetrics.employeeSatisfaction}%</p>
                <div className={`w-full ${darkMode ? 'bg-blue-800' : 'bg-blue-200'} rounded-full h-2`}>
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className={`p-6 bg-gradient-to-br ${darkMode ? 'from-green-900/20 to-emerald-900/20 border-green-800' : 'from-green-50 to-emerald-50 border-green-200'} rounded-2xl border-2`}>
                <div className="flex items-center justify-between mb-4">
                  <Building2 className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <Star className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} animate-spin-slow`} />
                </div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Employer Satisfaction</p>
                <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{analyticsData.performanceMetrics.employerSatisfaction}%</p>
                <div className={`w-full ${darkMode ? 'bg-green-800' : 'bg-green-200'} rounded-full h-2`}>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div className={`p-6 bg-gradient-to-br ${darkMode ? 'from-purple-900/20 to-pink-900/20 border-purple-800' : 'from-purple-50 to-pink-50 border-purple-200'} rounded-2xl border-2`}>
                <div className="flex items-center justify-between mb-4">
                  <Target className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <Zap className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-500'} animate-pulse`} />
                </div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Placement Rate</p>
                <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{analyticsData.performanceMetrics.placementRate}%</p>
                <div className={`w-full ${darkMode ? 'bg-purple-800' : 'bg-purple-200'} rounded-full h-2`}>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>

              <div className={`p-6 bg-gradient-to-br ${darkMode ? 'from-orange-900/20 to-red-900/20 border-orange-800' : 'from-orange-50 to-red-50 border-orange-200'} rounded-2xl border-2`}>
                <div className="flex items-center justify-between mb-4">
                  <Clock className={`w-8 h-8 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                  <Activity className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-500'} animate-bounce`} />
                </div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Avg. Time to Hire</p>
                <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{analyticsData.performanceMetrics.avgTimeToHire}d</p>
                <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'} font-bold`}>{Math.abs(analyticsData.performanceMetrics.timeToHireChange)} days improvement</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-3xl shadow-xl p-8 border-2`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Live Activity</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Real-time updates</p>
              </div>
              <div className={`w-3 h-3 ${darkMode ? 'bg-green-400' : 'bg-green-500'} rounded-full animate-pulse`}></div>
            </div>

            <div className="space-y-4">
              {analyticsData.recentActivities.map((activity, index) => {
                const colorClasses: Record<'blue' | 'green' | 'purple' | 'orange', { bg: string; text: string }> = {
                  blue: { 
                    bg: darkMode ? 'bg-blue-900' : 'bg-blue-100', 
                    text: darkMode ? 'text-blue-400' : 'text-blue-600' 
                  },
                  green: { 
                    bg: darkMode ? 'bg-green-900' : 'bg-green-100', 
                    text: darkMode ? 'text-green-400' : 'text-green-600' 
                  },
                  purple: { 
                    bg: darkMode ? 'bg-purple-900' : 'bg-purple-100', 
                    text: darkMode ? 'text-purple-400' : 'text-purple-600' 
                  },
                  orange: { 
                    bg: darkMode ? 'bg-orange-900' : 'bg-orange-100', 
                    text: darkMode ? 'text-orange-400' : 'text-orange-600' 
                  },
                };
                const colorClass = colorClasses[(activity.color as 'blue' | 'green' | 'purple' | 'orange')] || colorClasses.blue;

                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-2xl transition-all cursor-pointer`}
                  >
                    <div className={`p-2 rounded-xl ${colorClass.bg}`}>
                      {activity.type === 'user' && <Users className={`w-4 h-4 ${colorClass.text}`} />}
                      {activity.type === 'job' && <Briefcase className={`w-4 h-4 ${colorClass.text}`} />}
                      {activity.type === 'application' && <FileText className={`w-4 h-4 ${colorClass.text}`} />}
                      {activity.type === 'hire' && <CheckCircle className={`w-4 h-4 ${colorClass.text}`} />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-sm`}>{activity.action}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{activity.user}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className={`w-full mt-4 py-3 bg-gradient-to-r ${darkMode ? 'from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white' : 'from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700'} rounded-2xl font-bold transition-all`}>
              View All Activity
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(3deg); }
          66% { transform: translate(-20px, 20px) rotate(-3deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 25s ease-in-out infinite;
          animation-delay: -5s;
        }
        .animate-float-slow {
          animation: float 30s ease-in-out infinite;
          animation-delay: -10s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Analytics;








