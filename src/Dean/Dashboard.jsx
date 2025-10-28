import { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { Users, UserCheck, UserX, CalendarCheck, Clock } from "lucide-react";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const summary = [
    {
      title: "Total Students Registered",
      value: 1500,
      icon: Users,
      color: "bg-green-700",
    },
    {
      title: "Total Regular Students",
      value: 1000,
      icon: UserCheck,
      color: "bg-green-600",
    },
    {
      title: "Total Irregular Students",
      value: 500,
      icon: UserX,
      color: "bg-emerald-500",
    },
  ];

  const attendanceOverview = {
    present: 1420,
    absent: 80,
    lastUpdated: "10:30 AM",
  };

  const recentActivities = [
    { activity: "Attendance report submitted", time: "2 hours ago" },
    { activity: "New student registration approved", time: "5 hours ago" },
    { activity: "Faculty attendance reviewed", time: "Yesterday" },
  ];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-sm font-medium text-gray-500">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className="flex"
        style={{ paddingLeft: "260px", paddingTop: "70px" }}
      >
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

  return (
    <div className="flex" style={{ paddingLeft: "260px", paddingTop: "70px" }}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">
              Dean Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of student records and attendance under your supervision
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {summary.map((item, index) => (
              <StatCard key={index} {...item} />
            ))}
          </div>

          {/* Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Attendance Overview
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Summary of today’s student attendance
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <CalendarCheck className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6 text-sm text-gray-600 space-y-3">
                <p>
                  ✅ Present Students:{" "}
                  <span className="font-semibold text-gray-800">
                    {attendanceOverview.present}
                  </span>
                </p>
                <p>
                  ❌ Absent Students:{" "}
                  <span className="font-semibold text-gray-800">
                    {attendanceOverview.absent}
                  </span>
                </p>
                <p>
                  ⏰ Last Updated:{" "}
                  <span className="text-gray-500">
                    {attendanceOverview.lastUpdated}
                  </span>
                </p>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activities
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Latest system updates and logs
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {recentActivities.map((item, index) => (
                    <li
                      key={index}
                      className="border-l-4 border-green-700 pl-4 py-2 hover:bg-gray-50 rounded-md transition-all duration-200"
                    >
                      <p className="text-gray-800 font-medium">
                        {item.activity}
                      </p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}