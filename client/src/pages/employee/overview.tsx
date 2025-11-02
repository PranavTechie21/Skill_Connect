import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
} from 'lucide-react';
import { useTheme } from "@/components/theme-provider";

const Overview = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const [totalJobs, setTotalJobs] = useState(0);
  
  useEffect(() => {
    // Fetch total jobs count from your API
    const fetchTotalJobs = async () => {
      try {
        const response = await fetch('/api/jobs/count');
        const data = await response.json();
        setTotalJobs(data.count);
      } catch (error) {
        console.error('Error fetching total jobs:', error);
      }
    };

    fetchTotalJobs();
  }, []);

  const stats = [
    {
      label: 'Total Applications',
      value: '3',
      description: '↑ 23% from last month',
      icon: BriefcaseIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Pending Review',
      value: '0',
      description: 'Awaiting response',
      icon: ClockIcon,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Interviews',
      value: '1',
      description: '↑ 2 new this week',
      icon: CheckCircleIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Total Jobs',
      value: totalJobs.toString(),
      description: 'Available positions',
      icon: BriefcaseIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="p-6">
      {/* Welcome Message */}
      <div className={`mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName || 'User'}! 👋
        </h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Let's find your dream job today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className={`text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {stat.value}
            </p>
            <p className={`text-sm mt-2 ${
              darkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;