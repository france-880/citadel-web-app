import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { Search, Filter } from "lucide-react";
import { programAPI, yearSectionAPI, studentAPI } from "../api/axios";

export default function StudentSummary() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    program: "",
    year: "",
    status: "",
  });

  const [programs, setPrograms] = useState([]);
  const [yearSections, setYearSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Loading state used to show spinner while page initializes
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  // 🔹 Filter + Search Logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      s.student_no?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentNo?.toLowerCase().includes(search.toLowerCase());
    const matchesProgram =
      !filters.program ||
      s.program?.toLowerCase() === filters.program.toLowerCase();
    const matchesYear = !filters.year || s.year?.includes(filters.year);
    const matchesStatus = !filters.status || s.status === filters.status;

    return matchesSearch && matchesProgram && matchesYear && matchesStatus;
  });

  // Listen to sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  // Fetch all data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch programs
        const programsResponse = await programAPI.getAll();
        console.log("Programs fetched:", programsResponse.data);
        if (programsResponse.data.success) {
          setPrograms(programsResponse.data.data);
        } else if (Array.isArray(programsResponse.data)) {
          setPrograms(programsResponse.data);
        }
        
        // Fetch students
        const studentsResponse = await studentAPI.getAll();
        console.log("Students fetched:", studentsResponse.data);
        if (Array.isArray(studentsResponse.data)) {
          setStudents(studentsResponse.data);
        } else if (studentsResponse.data.data) {
          setStudents(studentsResponse.data.data);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchData();
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

  return (
    <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
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
              Read-only overview of all registered students across programs
            </p>
          </div>

          {/* Filters + Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Search by name or student ID..."
                className="w-[350px] px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
                {/* Program Dropdown */}
                <select
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent outline-none text-gray-700"
                  value={filters.program}
                  onChange={(e) =>
                    setFilters({ ...filters, program: e.target.value })
                  }
                >
                  <option value="">All Programs</option>
                  {programs.map((program) => (
                    <option
                      key={program.id}
                      value={program.program_name}
                    >
                      {program.program_name}
                    </option>
                  ))}
                </select>

                {/* Year Levels Dropdown */}
                <select
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent outline-none text-gray-700"
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
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent outline-none text-gray-700"
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    {[
                      "Student ID",
                      "Full Name",
                      "Program",
                      "Year Level",
                      "Status",
                      "Last Scan Time",
                    ].map((header, i) => (
                      <th
                        key={i}
                        className="table-title"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr key={index} className="hover:bg-[#F6F7FB]">
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.student_no || student.studentNo}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.fullname}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.program}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.year}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-center">
                          —
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-center">
                          —
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}