import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import api from "../api/axios";
import { toast } from "react-toastify";
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Activity, 
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  BookOpen,
  BarChart3
} from "lucide-react";

// Icon mapping for activities
const iconMap = {
  'UserCheck': UserCheck,
  'BookOpen': BookOpen,
  'CheckCircle': CheckCircle,
  'AlertCircle': AlertCircle,
  'Activity': Activity,
  'Users': Users
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [dashboardData, setDashboardData] = useState({
    totalUsers: {
      students: 0,
      coordinators: 0,
      faculty: 0,
      total: 0
    },
    totalPrograms: 0,
    todayAttendance: {
      total: 0,
      present: 0,
      absent: 0,
      percentage: 0
    },
    systemStats: {
      activeUsers: 0,
      totalSessions: 0,
      averageSessionTime: "0h 0m"
    },
    programs: [],
    recentActivities: []
  });

  // Listen to sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/dashboard/statistics');
        
        if (response.data.success) {
          const data = response.data.data;
          
          // Map activities with icons
          const mappedActivities = data.recentActivities.map(activity => ({
            ...activity,
            icon: iconMap[activity.icon] || Activity
          }));
          
          setDashboardData({
            totalUsers: data.totalUsers,
            totalPrograms: data.totalPrograms,
            todayAttendance: data.todayAttendance,
            systemStats: data.systemStats,
            programs: data.programs,
            recentActivities: mappedActivities
          });
        } else {
          toast.error('Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6 min-h-screen">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064F32]"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Helper function to format relative time
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    }
  };

  const ActivityItem = ({ activity }) => {
    const Icon = activity.icon;
    const [relativeTime, setRelativeTime] = useState(
      formatRelativeTime(activity.created_at)
    );
    
    // Update relative time every minute
    useEffect(() => {
      const updateTime = () => {
        setRelativeTime(formatRelativeTime(activity.created_at));
      };
      
      // Update immediately and then every minute
      updateTime();
      const interval = setInterval(updateTime, 60000); // Update every 60 seconds
      
      return () => clearInterval(interval);
    }, [activity.created_at]);
    
    return (
      <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
        <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">{activity.message}</p>
          <p className="text-xs text-gray-500 mt-1">{relativeTime}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">System Overview</h1>
            <p className="text-gray-600">Welcome to the Super Admin Dashboard - Monitor all system activities</p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={dashboardData.totalUsers.total.toLocaleString()}
              icon={Users}
              color="bg-blue-500"
              subtitle={`${dashboardData.totalUsers.students} students, ${dashboardData.totalUsers.coordinators} coordinators`}
            />
            <StatCard
              title="Total Programs"
              value={dashboardData.totalPrograms}
              icon={GraduationCap}
              color="bg-green-500"
            />
            <StatCard
              title="Today's Attendance"
              value={`${dashboardData.todayAttendance.percentage}%`}
              icon={Calendar}
              color="bg-purple-500"
              subtitle={`${dashboardData.todayAttendance.present}/${dashboardData.todayAttendance.total} present`}
            />
            <StatCard
              title="Active Users"
              value={dashboardData.systemStats.activeUsers.toLocaleString()}
              icon={Activity}
              color="bg-orange-500"
              subtitle={`${dashboardData.systemStats.averageSessionTime} avg session`}
            />
          </div>

          {/* Program Performance Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Program Performance</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {dashboardData.programs && dashboardData.programs.length > 0 ? (
                dashboardData.programs.slice(0, 6).map((program, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#064F32] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {(program.name || 'N/A').slice(-2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{program.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{program.students || 0} students</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#064F32] h-2 rounded-full" 
                          style={{ width: `${program.attendance || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {program.attendance || 0}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No program data available</p>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-1">
              {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activities</p>
              )}
            </div>
            <button className="w-full mt-4 text-center text-sm text-[#064F32] hover:text-[#053d27] font-medium">
              View All Activities
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}