import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SuperAdminSidebar from "../Components/SuperAdminSidebar";
import { 
  Download, 
  Filter,
  Calendar,
  Users,
  GraduationCap,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  FileText,
  Eye,
  Search,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from "lucide-react";

export default function ReportAttendance() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "attendance", "registration", "analytics"
  const [dateRange, setDateRange] = useState("7d"); // "7d", "30d", "90d", "custom"
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Dummy data for reports
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      student_name: "John Doe",
      student_id: "2021-001",
      program: "BS Information Technology",
      college: "College of Information Technology",
      date: "2024-01-15",
      time_in: "08:00 AM",
      time_out: "05:00 PM",
      status: "present",
      class: "IT101 - Introduction to Programming",
      professor: "Prof. Michael Torres"
    },
    {
      id: 2,
      student_name: "Jane Smith",
      student_id: "2021-002",
      program: "BS Computer Science",
      college: "College of Information Technology",
      date: "2024-01-15",
      time_in: "08:15 AM",
      time_out: "05:00 PM",
      status: "present",
      class: "CS101 - Data Structures",
      professor: "Dr. Anna Reyes"
    },
    {
      id: 3,
      student_name: "Mike Johnson",
      student_id: "2021-003",
      program: "BS Civil Engineering",
      college: "College of Engineering",
      date: "2024-01-15",
      time_in: null,
      time_out: null,
      status: "absent",
      class: "CE101 - Engineering Mathematics",
      professor: "Engr. Sarah Martinez"
    },
    {
      id: 4,
      student_name: "Sarah Wilson",
      student_id: "2021-004",
      program: "BS Psychology",
      college: "College of Arts and Sciences",
      date: "2024-01-15",
      time_in: "08:30 AM",
      time_out: "04:30 PM",
      status: "late",
      class: "PSY101 - General Psychology",
      professor: "Prof. Carlos Mendez"
    },
    {
      id: 5,
      student_name: "David Brown",
      student_id: "2021-005",
      program: "BS Information Technology",
      college: "College of Information Technology",
      date: "2024-01-14",
      time_in: "08:00 AM",
      time_out: "05:00 PM",
      status: "present",
      class: "IT102 - Web Development",
      professor: "Prof. Michael Torres"
    }
  ]);

  const [registrationData, setRegistrationData] = useState([
    {
      id: 1,
      student_name: "Alice Cooper",
      student_id: "2024-001",
      program: "BS Information Technology",
      college: "College of Information Technology",
      registration_date: "2024-01-10",
      status: "active",
      year_level: "1st Year",
      semester: "2nd Semester"
    },
    {
      id: 2,
      student_name: "Bob Wilson",
      student_id: "2024-002",
      program: "BS Computer Science",
      college: "College of Information Technology",
      registration_date: "2024-01-12",
      status: "active",
      year_level: "2nd Year",
      semester: "2nd Semester"
    },
    {
      id: 3,
      student_name: "Carol Davis",
      student_id: "2024-003",
      program: "BS Civil Engineering",
      college: "College of Engineering",
      registration_date: "2024-01-08",
      status: "pending",
      year_level: "3rd Year",
      semester: "2nd Semester"
    }
  ]);

  const [colleges] = useState([
    "College of Information Technology",
    "College of Engineering", 
    "College of Arts and Sciences",
    "College of Business Administration",
    "College of Education"
  ]);

  const [programs] = useState([
    "BS Information Technology",
    "BS Computer Science",
    "BS Civil Engineering",
    "BS Mechanical Engineering",
    "BS Psychology",
    "BS Business Administration",
    "BS Education"
  ]);

  // Analytics data
  const [analyticsData] = useState({
    totalStudents: 1250,
    totalFaculty: 85,
    totalClasses: 156,
    averageAttendance: 87.5,
    attendanceTrend: [
      { date: "2024-01-08", attendance: 85.2 },
      { date: "2024-01-09", attendance: 87.1 },
      { date: "2024-01-10", attendance: 89.3 },
      { date: "2024-01-11", attendance: 86.8 },
      { date: "2024-01-12", attendance: 88.5 },
      { date: "2024-01-13", attendance: 90.1 },
      { date: "2024-01-14", attendance: 87.5 }
    ],
    collegeStats: [
      { name: "College of Information Technology", students: 450, attendance: 89.2 },
      { name: "College of Engineering", students: 380, attendance: 86.8 },
      { name: "College of Arts and Sciences", students: 320, attendance: 85.5 },
      { name: "College of Business Administration", students: 100, attendance: 88.1 }
    ],
    statusBreakdown: {
      present: 1087,
      absent: 98,
      late: 65
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadReport = (format, type) => {
    // Simulate download
    console.log(`Downloading ${type} report in ${format} format`);
    // In real implementation, this would trigger actual file download
  };

  const getStatusColor = (status) => {
    const colors = {
      present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      late: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'absent':
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      case 'late':
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex" style={{ paddingLeft: '300px', paddingTop: '70px' }}>
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

  return (
    <div className="flex" style={{ paddingLeft: '300px', paddingTop: '70px' }}>
      <SuperAdminSidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#064F32] mb-2">Reports & Attendance</h1>
              <p className="text-gray-600">System-wide reports, analytics, and attendance data</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-[#064F32] px-4 py-2 rounded-lg border border-[#064F32] hover:bg-[#064F32]/5 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="bg-[#064F32] text-white px-4 py-2 rounded-lg hover:bg-[#053d27] transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export All
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.totalStudents.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                  <p className="text-2xl font-bold text-green-600">{analyticsData.totalFaculty}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Classes</p>
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.totalClasses}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Attendance</p>
                  <p className="text-2xl font-bold text-orange-600">{analyticsData.averageAttendance}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                  >
                    <option value="">All Colleges</option>
                    {colleges.map(college => (
                      <option key={college} value={college}>{college}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                  >
                    <option value="">All Programs</option>
                    {programs.map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-[#064F32] text-white px-4 py-2 rounded-lg hover:bg-[#053d27] transition-colors">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "overview"
                      ? "border-[#064F32] text-[#064F32]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Overview & Analytics
                </button>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "attendance"
                      ? "border-[#064F32] text-[#064F32]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Attendance Reports
                </button>
                <button
                  onClick={() => setActiveTab("registration")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "registration"
                      ? "border-[#064F32] text-[#064F32]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Registration Summary
                </button>
              </nav>
            </div>
          </div>

          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Attendance Trend Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Trend (Last 7 Days)</h3>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">+2.3% from last week</span>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analyticsData.attendanceTrend.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-[#064F32] rounded-t"
                        style={{ height: `${(data.attendance / 100) * 200}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs font-medium text-gray-700">{data.attendance}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* College Statistics */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">College Statistics</h3>
                  <div className="space-y-4">
                    {analyticsData.collegeStats.map((college, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{college.name}</p>
                          <p className="text-xs text-gray-500">{college.students} students</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#064F32]">{college.attendance}%</p>
                          <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-[#064F32] h-2 rounded-full"
                              style={{ width: `${college.attendance}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Present</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">{analyticsData.statusBreakdown.present}</span>
                        <p className="text-xs text-gray-500">
                          {((analyticsData.statusBreakdown.present / analyticsData.totalStudents) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-700">Absent</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">{analyticsData.statusBreakdown.absent}</span>
                        <p className="text-xs text-gray-500">
                          {((analyticsData.statusBreakdown.absent / analyticsData.totalStudents) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-700">Late</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">{analyticsData.statusBreakdown.late}</span>
                        <p className="text-xs text-gray-500">
                          {((analyticsData.statusBreakdown.late / analyticsData.totalStudents) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Reports Tab Content */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              {/* Download Options */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Reports</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadReport('PDF', 'attendance')}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownloadReport('CSV', 'attendance')}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="bg-[#064F32]/10 text-[#064F32]">
                        <th className="px-4 py-3 font-semibold">Student</th>
                        <th className="px-4 py-3 font-semibold">Program</th>
                        <th className="px-4 py-3 font-semibold">College</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Class</th>
                        <th className="px-4 py-3 font-semibold">Time In</th>
                        <th className="px-4 py-3 font-semibold">Time Out</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Professor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {attendanceData.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{record.student_name}</p>
                              <p className="text-xs text-gray-500">{record.student_id}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{record.program}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{record.college}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{record.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{record.class}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{record.time_in || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{record.time_out || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                              {getStatusIcon(record.status)}
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{record.professor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Registration Summary Tab Content */}
          {activeTab === "registration" && (
            <div className="space-y-6">
              {/* Download Options */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Student Registration Summary</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadReport('PDF', 'registration')}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownloadReport('CSV', 'registration')}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Registration Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="bg-[#064F32]/10 text-[#064F32]">
                        <th className="px-4 py-3 font-semibold">Student</th>
                        <th className="px-4 py-3 font-semibold">Student ID</th>
                        <th className="px-4 py-3 font-semibold">Program</th>
                        <th className="px-4 py-3 font-semibold">College</th>
                        <th className="px-4 py-3 font-semibold">Year Level</th>
                        <th className="px-4 py-3 font-semibold">Semester</th>
                        <th className="px-4 py-3 font-semibold">Registration Date</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {registrationData.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900">{student.student_name}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 font-mono">{student.student_id}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{student.program}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{student.college}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{student.year_level}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{student.semester}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{student.registration_date}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                              {getStatusIcon(student.status)}
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
