import { useState } from 'react';
import AdminBackButton from "@/components/AdminBackButton";
import { useTheme } from '@/components/theme-provider';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  DollarSign,
  MapPin,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  Building,
  Target,
  Award,
  Clock4,
  BarChart3,
  PieChart,
  UserCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  PlayCircle
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalApplicants: number;
    conversionRate: number;
    averageTimeToHire: number;
    totalJobs: number;
    activeJobs: number;
  };
  traffic: {
    dates: string[];
    views: number[];
    applicants: number[];
    conversions: number[];
  };
  applicantSources: {
    source: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  topJobs: {
    id: string;
    title: string;
    views: number;
    applicants: number;
    conversionRate: number;
    department: string;
    status: 'active' | 'paused' | 'closed';
  }[];
  demographic: {
    locations: { location: string; applicants: number; growth: number }[];
    experience: { level: string; count: number; trend: 'up' | 'down' }[];
  };
  timeline: {
    date: string;
    events: { type: string; count: number }[];
  }[];
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeMetric, setActiveMetric] = useState<'views' | 'applicants' | 'conversions'>('views');

  const analyticsData: AnalyticsData = {
    overview: {
      totalViews: 12470,
      totalApplicants: 342,
      conversionRate: 2.74,
      averageTimeToHire: 24,
      totalJobs: 15,
      activeJobs: 8
    },
    traffic: {
      dates: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14'],
      views: [650, 720, 800, 750, 850, 900, 920, 880, 950, 1000, 1050, 1100, 1150, 1200],
      applicants: [18, 22, 25, 20, 28, 30, 32, 29, 35, 38, 40, 42, 45, 48],
      conversions: [0.5, 0.6, 0.65, 0.55, 0.7, 0.75, 0.8, 0.72, 0.85, 0.9, 0.95, 1.0, 1.1, 1.2]
    },
    applicantSources: [
      { source: 'LinkedIn', count: 145, percentage: 42.4, color: '#0A66C2' },
      { source: 'Indeed', count: 89, percentage: 26.0, color: '#2164F3' },
      { source: 'Company Website', count: 56, percentage: 16.4, color: '#10B981' },
      { source: 'Glassdoor', count: 32, percentage: 9.4, color: '#0CAA41' },
      { source: 'Other', count: 20, percentage: 5.8, color: '#6B7280' }
    ],
    topJobs: [
      { id: '1', title: 'Senior Frontend Developer', views: 2450, applicants: 68, conversionRate: 2.78, department: 'Engineering', status: 'active' },
      { id: '2', title: 'Product Manager', views: 1890, applicants: 54, conversionRate: 2.86, department: 'Product', status: 'active' },
      { id: '3', title: 'DevOps Engineer', views: 1670, applicants: 42, conversionRate: 2.51, department: 'Engineering', status: 'paused' },
      { id: '4', title: 'UX Designer', views: 1540, applicants: 38, conversionRate: 2.47, department: 'Design', status: 'active' },
      { id: '5', title: 'Data Scientist', views: 1320, applicants: 35, conversionRate: 2.65, department: 'Data', status: 'active' }
    ],
    demographic: {
      locations: [
        { location: 'San Francisco, CA', applicants: 89, growth: 12 },
        { location: 'New York, NY', applicants: 67, growth: 8 },
        { location: 'Remote', applicants: 54, growth: 25 },
        { location: 'Austin, TX', applicants: 38, growth: 15 },
        { location: 'Seattle, WA', applicants: 32, growth: 5 }
      ],
      experience: [
        { level: 'Entry Level (0-2 years)', count: 45, trend: 'up' },
        { level: 'Mid Level (3-5 years)', count: 128, trend: 'up' },
        { level: 'Senior Level (6-10 years)', count: 89, trend: 'down' },
        { level: 'Executive (10+ years)', count: 12, trend: 'up' }
      ]
    },
    timeline: [
      {
        date: 'Today',
        events: [
          { type: 'applications', count: 8 },
          { type: 'views', count: 320 }
        ]
      },
      {
        date: 'Yesterday',
        events: [
          { type: 'applications', count: 12 },
          { type: 'views', count: 280 }
        ]
      }
    ]
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const StatCard = ({ title, value, change, icon: Icon, trend = 'up', subtitle }: any) => (
    <div className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50' 
        : 'bg-gradient-to-br from-white to-gray-50/80 border border-gray-200 shadow-lg'
    } backdrop-blur-sm`}>
      {/* Animated background effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        isDark ? 'bg-gradient-to-br from-blue-500/5 to-purple-500/5' : 'bg-gradient-to-br from-blue-50 to-purple-50'
      }`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${
            isDark ? 'bg-blue-500/20' : 'bg-blue-100'
          } group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <div className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-full ${
            trend === 'up' 
              ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
              : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{change}%</span>
          </div>
        </div>
        
        <div>
          <p className={`text-sm font-medium mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>{title}</p>
          <p className={`text-3xl font-bold mb-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {subtitle && (
            <p className={`text-sm ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  const TrafficChart = () => {
    const maxValue = Math.max(...analyticsData.traffic.views);
    
    return (
      <div className={`relative rounded-2xl p-6 transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50' 
          : 'bg-gradient-to-br from-white to-gray-50/80 border border-gray-200 shadow-lg'
      } backdrop-blur-sm`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className={`text-xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Traffic Overview</h3>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Track views, applicants, and conversions over time</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {['views', 'applicants', 'conversions'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setActiveMetric(metric as any)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                    activeMetric === metric
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}>
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <div className="h-64">
          <div className="flex items-end justify-between h-48 space-x-2 mb-6">
            {analyticsData.traffic[activeMetric].map((value, index) => {
              const height = (value / maxValue) * 100;
              const isPeak = value === Math.max(...analyticsData.traffic[activeMetric]);
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  <div className="relative flex-1 w-full flex items-end">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 group-hover:shadow-lg ${
                        activeMetric === 'views' 
                          ? 'bg-gradient-to-t from-blue-500 to-blue-600' 
                          : activeMetric === 'applicants'
                          ? 'bg-gradient-to-t from-green-500 to-green-600'
                          : 'bg-gradient-to-t from-purple-500 to-purple-600'
                      } ${isPeak ? 'animate-pulse' : ''}`}
                      style={{ height: `${height}%` }}
                    />
                    <div className={`absolute -top-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                      isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    } px-2 py-1 rounded-lg text-xs font-medium shadow-lg`}>
                      {value.toLocaleString()}
                    </div>
                  </div>
                  <span className={`text-xs mt-3 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {analyticsData.traffic.dates[index]}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Page Views</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Applicants</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Conversions</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SourcesChart = () => (
    <div className={`relative rounded-2xl p-6 transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50' 
        : 'bg-gradient-to-br from-white to-gray-50/80 border border-gray-200 shadow-lg'
    } backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Applicant Sources</h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Where your applicants are coming from</p>
        </div>
        <PieChart className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          {analyticsData.applicantSources.map((source, index) => (
            <div 
              key={source.source} 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 rounded-full transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: source.color }}
                />
                <div>
                  <span className={`font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>{source.source}</span>
                  <div className={`w-24 h-1.5 mt-1 rounded-full ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${source.percentage}%`,
                        backgroundColor: source.color
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{source.count}</span>
                <span className={`text-sm ml-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>({source.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0">
              {analyticsData.applicantSources.map((source, index) => {
                const total = analyticsData.applicantSources.reduce((sum, s) => sum + s.percentage, 0);
                const startAngle = analyticsData.applicantSources.slice(0, index).reduce((sum, s) => sum + (s.percentage / total) * 360, 0);
                const endAngle = startAngle + (source.percentage / total) * 360;
                
                return (
                  <div
                    key={source.source}
                    className="absolute inset-0 rounded-full transition-all duration-500 hover:scale-105"
                    style={{
                      background: `conic-gradient(from ${startAngle}deg, ${source.color} 0deg ${endAngle}deg, transparent ${endAngle}deg)`
                    }}
                  />
                );
              })}
            </div>
            <div className={`absolute inset-8 rounded-full ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-lg flex items-center justify-center`}>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {analyticsData.applicantSources.length}
                </div>
                <div className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Sources
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TopJobsList = () => (
    <div className={`relative rounded-2xl p-6 transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50' 
        : 'bg-gradient-to-br from-white to-gray-50/80 border border-gray-200 shadow-lg'
    } backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Top Performing Jobs</h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Jobs with highest engagement and conversion rates</p>
        </div>
        <BarChart3 className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>
      
      <div className="space-y-4">
        {analyticsData.topJobs.map((job, index) => (
          <div 
            key={job.id} 
            className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
              isDark 
                ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                : 'bg-gray-50 hover:bg-gray-100'
            } backdrop-blur-sm border ${
              isDark ? 'border-gray-700/50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                index === 1 ? 'bg-gradient-to-br from-gray-500 to-gray-600' :
                index === 2 ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                'bg-gradient-to-br from-blue-500 to-purple-500'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{job.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.status === 'active' 
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                    job.status === 'paused'
                      ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                      : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>{job.department}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className={`font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{job.views.toLocaleString()}</p>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Views</p>
              </div>
              <div className="text-center">
                <p className={`font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{job.applicants}</p>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Applicants</p>
              </div>
              <div className="text-center">
                <p className="text-green-500 font-bold">{job.conversionRate}%</p>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Conversion</p>
              </div>
              <button className={`opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-lg ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-200 text-gray-500'
              }`}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DemographicChart = () => (
    <div className={`relative rounded-2xl p-6 transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50' 
        : 'bg-gradient-to-br from-white to-gray-50/80 border border-gray-200 shadow-lg'
    } backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Applicant Demographics</h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Geographic and experience level distribution</p>
        </div>
        <UserCheck className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className={`font-semibold mb-4 flex items-center ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <MapPin className="w-4 h-4 mr-2" />
            Top Locations
          </h4>
          <div className="space-y-4">
            {analyticsData.demographic.locations.map((location, index) => (
              <div key={location.location} className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>{location.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-1 text-sm ${
                    location.growth > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {location.growth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{location.growth}%</span>
                  </div>
                  <span className={`font-bold w-12 text-right ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {location.applicants}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className={`font-semibold mb-4 flex items-center ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <Award className="w-4 h-4 mr-2" />
            Experience Levels
          </h4>
          <div className="space-y-4">
            {analyticsData.demographic.experience.map((exp) => (
              <div key={exp.level} className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300">
                <span className={`font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{exp.level}</span>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-1 text-sm ${
                    exp.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {exp.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  </div>
                  <div className={`w-20 h-2 rounded-full ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${(exp.count / 128) * 100}%` }}
                    />
                  </div>
                  <span className={`font-bold w-8 text-right ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {exp.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30'
    }`}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto p-6 max-w-7xl relative">
        {/* Back Button */}
        <div className="mb-6">
          <AdminBackButton />
        </div>

        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-3 bg-gradient-to-r ${
              isDark 
                ? 'from-blue-400 to-purple-400' 
                : 'from-blue-600 to-purple-600'
            } bg-clip-text text-transparent`}>
              Analytics Dashboard
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Track your hiring performance and insights in real-time</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className={`border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/80 border-gray-700 text-white backdrop-blur-sm' 
                  : 'bg-white/80 border-gray-300 text-gray-900 backdrop-blur-sm'
              }`}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
              isDark 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg'
            }`}>
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Enhanced Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Page Views"
            value={analyticsData.overview.totalViews}
            change={12.5}
            icon={Eye}
            trend="up"
            subtitle="Across all job postings"
          />
          <StatCard
            title="Total Applicants"
            value={analyticsData.overview.totalApplicants}
            change={8.3}
            icon={Users}
            trend="up"
            subtitle="Active candidates"
          />
          <StatCard
            title="Conversion Rate"
            value={`${analyticsData.overview.conversionRate}%`}
            change={2.1}
            icon={Target}
            trend="up"
            subtitle="View to application"
          />
          <StatCard
            title="Avg. Time to Hire"
            value={`${analyticsData.overview.averageTimeToHire}d`}
            change={-5.2}
            icon={Clock4}
            trend="down"
            subtitle="Days to fill position"
          />
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <TrafficChart />
          </div>
          <div>
            <TopJobsList />
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SourcesChart />
          <DemographicChart />
        </div>

        {/* Enhanced Quick Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {[
            { icon: Building, label: 'Active Jobs', value: analyticsData.overview.activeJobs, color: 'blue' },
            { icon: DollarSign, label: 'Cost per Hire', value: '$2,450', color: 'green' },
            { icon: Calendar, label: 'Avg. Response Time', value: '2.3 days', color: 'purple' },
            { icon: Award, label: 'Quality Score', value: '8.7/10', color: 'yellow' }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`group relative rounded-2xl p-6 text-center transition-all duration-500 hover:scale-105 ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50' 
                  : 'bg-white border border-gray-200 shadow-lg'
              } backdrop-blur-sm`}
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-3 transition-transform duration-300 group-hover:scale-110 ${
                stat.color === 'blue' ? (isDark ? 'text-blue-400' : 'text-blue-600') :
                stat.color === 'green' ? (isDark ? 'text-green-400' : 'text-green-600') :
                stat.color === 'purple' ? (isDark ? 'text-purple-400' : 'text-purple-600') :
                isDark ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
              <p className={`text-sm mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>{stat.label}</p>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}