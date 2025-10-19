import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, AreaChart, Area, CartesianGrid, Legend } from "recharts";
import { Users, Briefcase, TrendingUp, MessageCircle, Activity, ClipboardList } from "lucide-react";
import { Eye, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { PieChart as LucidePieChart } from "lucide-react";

const Dashboards = () => {
  // Define COLORS array for PieChart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];


  const [userGrowthData, setUserGrowthData] = useState([]);
  const [jobCategoriesData, setJobCategoriesData] = useState([]);
  const [applicationStatusData, setApplicationStatusData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [quickStatsData, setQuickStatsData] = useState({ totalUsers: 0, activeJobs: 0, applicationsToday: 0, successfulMatches: 0 });
  const [topJobListingsData, setTopJobListingsData] = useState([]);

  const useMockData = () => {
    console.warn("API failed. Falling back to mock data for dashboard.");
    setUserGrowthData([
      { month: 'Jan', users: 65 }, { month: 'Feb', users: 99 }, { month: 'Mar', users: 150 },
      { month: 'Apr', users: 121 }, { month: 'May', users: 176 }, { month: 'Jun', users: 195 },
    ]);
    setJobCategoriesData([
      { name: 'Technology', value: 400 }, { name: 'Marketing', value: 300 },
      { name: 'Sales', value: 300 }, { name: 'Design', value: 200 },
    ]);
    setApplicationStatusData([
      { name: 'Accepted', value: 550 }, { name: 'Rejected', value: 50 },
      { name: 'Pending', value: 200 }, { name: 'Interview', value: 375 },
    ]);
    setEngagementData([
      { day: 'Mon', messages: 100, applications: 50 }, { day: 'Tue', messages: 120, applications: 60 },
      { day: 'Wed', messages: 90, applications: 45 }, { day: 'Thu', messages: 150, applications: 70 },
      { day: 'Fri', messages: 180, applications: 90 },
    ]);
    setQuickStatsData({
      totalUsers: 5432,
      activeJobs: 123,
      applicationsToday: 89,
      successfulMatches: 45,
    });
    setTopJobListingsData([
      { title: 'Frontend Developer', views: 5000, applications: 150 },
      { title: 'Backend Developer', views: 4500, applications: 120 },
      { title: 'UI/UX Designer', views: 3000, applications: 90 },
      { title: 'Data Scientist', views: 2500, applications: 70 },
      { title: 'Product Manager', views: 2000, applications: 60 },
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch dashboard data: ${response.status} ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text();
          console.error("Non-JSON response received:", responseText);
          throw new TypeError(`Expected JSON response but received ${contentType}. Response body: ${responseText.substring(0, 200)}...`);
        }

        const data = await response.json();
        setUserGrowthData(data.userGrowthData);
        setJobCategoriesData(data.jobCategoriesData);
        setApplicationStatusData(data.applicationStatusData);
        setEngagementData(data.engagementData);
        setQuickStatsData(data.quickStatsData[0]);
        setTopJobListingsData(data.topJobListingsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        useMockData(); // Use mock data on API failure
      }
    };

    fetchData();
  }, []);

  // Custom pie chart rendering with better visibility in both modes
  interface PieChartData {
    name: string;
    value: number;
    [key: string]: string | number;
  }

  const renderPieChart = (data: PieChartData[], height: number = 300) => (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}
          label={(props) => {
            const { value, payload } = props;
            const numericValue = value as number;
            const typedPayload = payload as { name: string; value: number };
            return `${typedPayload.name}: ${((numericValue / (data.reduce((a, b) => a + b.value, 0))) * 100).toFixed(0)}%`;
          }}
        >
          {data.map((entry: PieChartData, index: number) => (
            <Cell 
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]} 
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            color: '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
          }} 
        />
      </RechartsPieChart>
    </ResponsiveContainer>   
  );

  // Animation variants for framer-motion
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="min-h-screen p-6 text-center mb-12"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <br></br>
      <h1 className=" justify-center text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4">Dashboard</h1>
      <br></br>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <TabsTrigger value="overview" className="data-[state=active]:bg-pink-400 data-[state=active]:text-white dark:data-[state=active]:bg-pink-500">
            <Users className="mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="jobs" className="data-[state=active]:bg-pink-400 data-[state=active]:text-white dark:data-[state=active]:bg-pink-500">
            <Briefcase className="mr-2" /> Jobs
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-pink-400 data-[state=active]:text-white dark:data-[state=active]:bg-pink-500">
            <TrendingUp className="mr-2" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-pink-400 data-[state=active]:text-white dark:data-[state=active]:bg-pink-500">
            <MessageCircle className="mr-2" /> Engagement
          </TabsTrigger>
        </TabsList>
        <br />

        <TabsContent value="overview">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={sectionVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userGrowthData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#333' }} />
                    <Bar dataKey="users" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPieChart(jobCategoriesData)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Users</span>
                    <span>{quickStatsData.totalUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Jobs</span>
                    <span>{quickStatsData.activeJobs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Applications Today</span>
                    <span>{quickStatsData.applicationsToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Successful Matches</span>
                    <span>{quickStatsData.successfulMatches}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="jobs">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={sectionVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={applicationStatusData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#333' }} />
                    <Bar dataKey="value" fill="#82ca9d">
                      {applicationStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase />
                  Top Job Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {topJobListingsData.map((job, index) => (
                    <li 
                      key={index} 
                      className="flex justify-between items-center p-4 rounded-lg transition-colors duration-200"
                    >
                      <span>
                        {job.title}
                      </span>
                      <div className="flex items-center gap-4">
                        <span>
                          <Eye className="h-4 w-4 mr-1" />
                          {job.views.toLocaleString()} views
                        </span>
                        <span>
                          <FileText className="h-4 w-4 mr-1" />
                          {job.applications} apps
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={sectionVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp />
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month"/>
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#4F46E5" 
                      fillOpacity={1} 
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucidePieChart />
                  Job Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jobCategoriesData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#333' }} />
                    <Bar dataKey="value">
                      {jobCategoriesData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="engagement">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={sectionVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity />
                  Weekly Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationStatusData.map((status, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 text-sm text-left text-gray-500">{status.name}</div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div
                          className="h-4 rounded-full"
                          style={{ width: `${(status.value / applicationStatusData.reduce((acc, s) => acc + s.value, 0)) * 100}%`, backgroundColor: COLORS[index % COLORS.length] }}
                        />
                      </div>
                      <div className="w-12 text-right text-sm font-semibold">{status.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Dashboards;