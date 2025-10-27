import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { Search, Filter } from "lucide-react";
import { collegeAPI, yearSectionAPI } from "../api/axios";

export default function StudentSummary() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    college: "",
    program: "",
    year: "",
    status: "",
  });

  const [colleges, setColleges] = useState([]);
  const [yearSections, setYearSections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Loading state used to show spinner while page initializes
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Sample static student data (replace with backend data later)
  const students = [
    {
      id: "2021-001",
      name: "Juan Dela Cruz",
      program: "BSIT – College of Computing",
      year: "3rd Year",
      status: "Inside Campus",
      lastScan: "2025-10-24 07:35 AM",
    },
    {
      id: "2020-045",
      name: "Maria Santos",
      program: "BSBA – College of Business",
      year: "4th Year",
      status: "Outside Campus",
      lastScan: "2025-10-24 05:10 PM",
    },
    {
      id: "2022-078",
      name: "Jose Ramirez",
      program: "BSCrim – College of Criminology",
      year: "2nd Year",
      status: "Inside Campus",
      lastScan: "2025-10-24 08:15 AM",
    },
  ];

  // 🔹 Filter + Search Logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchesCollege =
      !filters.college ||
      s.program.toLowerCase().includes(filters.college.toLowerCase());
    const matchesYear = !filters.year || s.year === filters.year;
    const matchesStatus = !filters.status || s.status === filters.status;

    return matchesSearch && matchesCollege && matchesYear && matchesStatus;
  });

  // Fetch Colleges on Component Mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const response = await collegeAPI.getAll("/api/colleges");
        console.log("Colleges fetched:", response.data);
        if (response.data.success) {
          setColleges(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch year levels (from year_sections)
  useEffect(() => {
    const fetchYearLevels = async () => {
      try {
        const response = await yearSectionAPI.getAll(); // ✅ walang param
        console.log("📦 Year Sections Response:", response);
        console.log("📦 Year Sections Data:", response.data);

        if (response.data.success) {
          // ✅ check kung may success key talaga sa response
          const uniqueYears = [
            ...new Set(response.data.data.map((y) => y.year_level)),
          ];
          setYearSections(uniqueYears);
        } else {
          // just in case walang success key (e.g., plain array)
          const uniqueYears = [
            ...new Set(response.data.map((y) => y.year_level)),
          ];
          setYearSections(uniqueYears);
        }
      } catch (error) {
        console.error("Error fetching year levels:", error);
      }
    };

    fetchYearLevels();
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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">
              Student Summary
            </h1>
            <p className="text-gray-600">
              Read-only overview of all registered students across colleges.
            </p>
          </div>

          {/* Filters + Search */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border border-gray-100">
            <div className="flex items-center w-full md:w-1/2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search student by name or ID..."
                className="w-full bg-transparent outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {/* College Dropdown */}
              <select
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                value={filters.college}
                onChange={(e) =>
                  setFilters({ ...filters, college: e.target.value })
                }
              >
                <option value="">All Colleges</option>
                {colleges.map((college) => (
                  <option
                    key={college.id}
                    value={college.college_code.toLowerCase()}
                  >
                    {college.college_name}
                  </option>
                ))}
              </select>

              {/* Year Levels Dropdown */}
              <select
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
              >
                <option value="">All Year Levels</option>
                {yearSections.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Status Dropdown */}
              <select
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="Inside Campus">Inside Campus</option>
                <option value="Outside Campus">Outside Campus</option>
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Student Overview
              </h3>
              <Filter className="w-5 h-5 text-gray-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Student ID",
                      "Full Name",
                      "Program / College",
                      "Year Level",
                      "Status",
                      "Last Scan Time",
                    ].map((header, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredStudents.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {student.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {student.program}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {student.year}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-semibold ${
                          student.status === "Inside Campus"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {student.status}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.lastScan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <p className="text-center py-6 text-gray-500 text-sm">
                  No matching records found.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
