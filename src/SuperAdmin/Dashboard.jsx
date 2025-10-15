import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SuperAdminSidebar from "../Components/SuperAdminSidebar";
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  BookOpen,
  BarChart3,
  PieChart
} from "lucide-react";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Dummy data for the dashboard
  const dashboardData = {
    totalUsers: {
      students: 1247,
      coordinators: 45,
      total: 1292
    },
    totalPrograms: 12,
    todayAttendance: {
      total: 1180,
      present: 1125,
      absent: 55,
      percentage: 95.3
    },
    systemStats: {
      activeUsers: 892,
      totalSessions: 156,
      averageSessionTime: "2h 15m"
    },
    programs: [
      { name: "BSIT", students: 320, attendance: 98.5 },
      { name: "BSCS", students: 280, attendance: 97.2 },
      { name: "BSIT-3A", students: 45, attendance: 96.8 },
      { name: "BSIT-3B", students: 42, attendance: 95.5 },
      { name: "BSIT-4A", students: 38, attendance: 97.8 },
      { name: "BSIT-4C", students: 35, attendance: 94.2 },
      { name: "BSIS", students: 190, attendance: 96.1 },
      { name: "BSCpE", students: 165, attendance: 95.8 },
      { name: "ACT", students: 120, attendance: 93.5 },
      { name: "BSEMC", students: 95, attendance: 97.1 }
    ],
    recentActivities: [
      {
        id: 1,
        type: "attendance",
        message: "John Doe marked attendance for BSIT-4A",
        timestamp: "2 minutes ago",
        icon: CheckCircle,
        color: "text-green-500"
      },
      {
        id: 2,
        type: "registration",
        message: "New student registered: Jane Smith (BSCS)",
        timestamp: "5 minutes ago",
        icon: UserCheck,
        color: "text-blue-500"
      },
      {
        id: 3,
        type: "system",
        message: "System backup completed successfully",
        timestamp: "15 minutes ago",
        icon: Activity,
        color: "text-purple-500"
      },
      {
        id: 4,
        type: "attendance",
        message: "Attendance alert: Low attendance in ACT program",
        timestamp: "1 hour ago",
        icon: AlertCircle,
        color: "text-orange-500"
      },
      {
        id: 5,
        type: "user",
        message: "Coordinator profile updated: Dr. Maria Santos",
        timestamp: "2 hours ago",
        icon: Users,
        color: "text-indigo-500"
      }
    ],
    weeklyStats: {
      monday: 94.2,
      tuesday: 96.8,
      wednesday: 95.5,
      thursday: 97.1,
      friday: 93.8,
      saturday: 89.2,
      sunday: 45.6
    }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex" style={{ paddingLeft: '260px', paddingTop: '70px' }}>
        <SuperAdminSidebar />
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

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const Icon = activity.icon;
    return (
      <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
        <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">{activity.message}</p>
          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex" style={{ paddingLeft: '300px', paddingTop: '70px' }}>
      <SuperAdminSidebar />
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
              trend={5.2}
              subtitle={`${dashboardData.totalUsers.students} students, ${dashboardData.totalUsers.coordinators} coordinators`}
            />
            <StatCard
              title="Total Programs"
              value={dashboardData.totalPrograms}
              icon={GraduationCap}
              color="bg-green-500"
              trend={2.1}
            />
            <StatCard
              title="Today's Attendance"
              value={`${dashboardData.todayAttendance.percentage}%`}
              icon={Calendar}
              color="bg-purple-500"
              trend={-1.3}
              subtitle={`${dashboardData.todayAttendance.present}/${dashboardData.todayAttendance.total} present`}
            />
            <StatCard
              title="Active Users"
              value={dashboardData.systemStats.activeUsers.toLocaleString()}
              icon={Activity}
              color="bg-orange-500"
              trend={8.7}
              subtitle={`${dashboardData.systemStats.averageSessionTime} avg session`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Program Performance Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Program Performance</h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {dashboardData.programs.slice(0, 6).map((program, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#064F32] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {program.name.slice(-2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{program.name}</p>
                        <p className="text-sm text-gray-500">{program.students} students</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#064F32] h-2 rounded-full" 
                          style={{ width: `${program.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {program.attendance}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Attendance Trend */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Trend</h3>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {Object.entries(dashboardData.weeklyStats).map(([day, percentage]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 capitalize w-16">
                      {day.slice(0, 3)}
                    </span>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#064F32] h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-1">
                {dashboardData.recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              <button className="w-full mt-4 text-center text-sm text-[#064F32] hover:text-[#053d27] font-medium">
                View All Activities
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
                  <Users className="w-6 h-6 text-blue-500 mb-2" />
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-500">Add, edit, or remove users</p>
                </button>
                <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                  <GraduationCap className="w-6 h-6 text-green-500 mb-2" />
                  <p className="font-medium text-gray-900">Programs</p>
                  <p className="text-sm text-gray-500">Manage academic programs</p>
                </button>
                <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                  <Calendar className="w-6 h-6 text-purple-500 mb-2" />
                  <p className="font-medium text-gray-900">Attendance</p>
                  <p className="text-sm text-gray-500">View attendance reports</p>
                </button>
                <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
                  <Activity className="w-6 h-6 text-orange-500 mb-2" />
                  <p className="font-medium text-gray-900">System Logs</p>
                  <p className="text-sm text-gray-500">Monitor system activity</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
