import { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import {
  Users,
  GraduationCap,
  Activity,
  DoorOpen,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Dummy Data for Super Admin Dashboard
  const summary = {
    totalStudents: 1247,
    totalAdmins: 45,
    totalPrograms: 12,
    insideCampus: 324,
    todayLogs: 1180,
  };

  const dailyLogs = [
    { time: "7 AM", in: 80, out: 10 },
    { time: "8 AM", in: 150, out: 20 },
    { time: "9 AM", in: 200, out: 50 },
    { time: "10 AM", in: 180, out: 70 },
    { time: "11 AM", in: 100, out: 120 },
    { time: "12 PM", in: 50, out: 150 },
  ];

  const attendancePerCollege = [
    { name: "CCS", value: 320 },
    { name: "COE", value: 250 },
    { name: "CBA", value: 180 },
    { name: "CAS", value: 200 },
    { name: "CHS", value: 150 },
  ];

  const COLORS = ["#064F32", "#0B6E4F", "#128C63", "#37B96B", "#7AD29D"];

  const recentActivities = [
    {
      date: "2025-10-24 07:35",
      user: "Student #0213",
      activity: "Entered campus (QR scan)",
    },
    {
      date: "2025-10-24 07:36",
      user: "Dean - CS Dept",
      activity: "Added new student account",
    },
    {
      date: "2025-10-24 07:45",
      user: "Program Head - IT",
      activity: "Viewed attendance logs",
    },
    {
      date: "2025-10-24 08:10",
      user: "Student #0321",
      activity: "Exited campus",
    },
    {
      date: "2025-10-24 08:25",
      user: "Admin - CBA",
      activity: "Generated daily report",
    },
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
              System Overview
            </h1>
            <p className="text-gray-600">
              Super Admin Dashboard - Monitor campus activities and system
              status
            </p>
          </div>

          {/* Summary Cards - 5 per row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Total Registered Students"
              value={summary.totalStudents}
              icon={Users}
              color="bg-green-600"
            />
            <StatCard
              title="Total Admins"
              value={summary.totalAdmins}
              icon={GraduationCap}
              color="bg-blue-600"
            />
            <StatCard
              title="Inside Campus"
              value={summary.insideCampus}
              icon={DoorOpen}
              color="bg-orange-500"
            />
            <StatCard
              title="Today's Logs"
              value={summary.todayLogs}
              icon={Calendar}
              color="bg-teal-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Daily In/Out Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Daily In/Out Activity
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Today's campus traffic
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyLogs}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="in"
                        name="Entries"
                        fill="#064F32"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="out"
                        name="Exits"
                        fill="#7AD29D"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Attendance per College Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Attendance by College
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Distribution per department
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <PieChartIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendancePerCollege}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {attendancePerCollege.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activities
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Latest system events and logs
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentActivities.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-700">
                            {item.user}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.activity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
