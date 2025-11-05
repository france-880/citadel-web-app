import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { programAPI, yearSectionAPI, studentAPI } from "../api/axios";

export default function Daily_Attendance() {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [programs, setPrograms] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  // Pagination state
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Listen to sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  // Fetch Students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await studentAPI.getAll();
        console.log("Students fetched:", response.data);
        
        let studentsData = [];
        if (Array.isArray(response.data)) {
          studentsData = response.data;
        } else if (response.data.data) {
          studentsData = response.data.data;
        }
        
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      }
    };
    
    fetchStudents();
  }, []);

  // ✅ Fetch Programs (Fixed)
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const response = await programAPI.getAll("/programs");
        console.log("Programs API Response:", response);
        console.log("Programs Data:", response.data);

        // I-debug ang structure ng response
        if (response.data && Array.isArray(response.data)) {
          setPrograms(response.data);
        } else if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          setPrograms(response.data.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setPrograms(response.data.data);
        } else {
          console.warn(
            "Unexpected programs response structure:",
            response.data
          );
          setPrograms([]);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        setPrograms([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // ✅ Fetch Year Levels & Sections (Fixed)
  useEffect(() => {
    const fetchYearSections = async () => {
      try {
        setIsLoading(true);
        const response = await yearSectionAPI.getAll();
        console.log("Year Sections API Response:", response);
        console.log("Year Sections Data:", response.data);

        let data = [];

        // I-debug at i-extract ang data base sa structure
        if (response.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          data = response.data.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else {
          console.warn(
            "Unexpected year sections response structure:",
            response.data
          );
        }

        console.log("Processed Year Sections Data:", data);

        // Get unique year levels
        const uniqueYears = [...new Set(data.map((y) => y.year_level))].filter(
          Boolean
        );
        setYearLevels(uniqueYears);

        // Get unique sections
        const uniqueSections = [...new Set(data.map((s) => s.section))].filter(
          Boolean
        );
        setSections(uniqueSections);

        console.log("Unique Years:", uniqueYears);
        console.log("Unique Sections:", uniqueSections);
      } catch (error) {
        console.error("Error fetching year levels and sections:", error);
        setYearLevels([]);
        setSections([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchYearSections();
  }, []);

  // ✅ Filter logic
  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (search) {
        const term = search.toLowerCase();
        const studentNo = s.student_no || s.studentNo || s.id || "";
        const studentName = s.fullname || s.name || "";
        if (
          !studentNo.toLowerCase().includes(term) &&
          !studentName.toLowerCase().includes(term)
        )
          return false;
      }
      if (selectedProgram && s.program !== selectedProgram) return false;
      if (
        selectedYearLevel &&
        s.year &&
        !s.year.toLowerCase().startsWith(selectedYearLevel.toLowerCase())
      )
        return false;
      if (selectedSection && s.section) {
        if (s.section.toLowerCase() !== selectedSection.toLowerCase()) return false;
      }
      return true;
    });
  }, [students, search, selectedProgram, selectedYearLevel, selectedSection]);

  // Calculate pagination
  const total = filtered.length;
  const lastPage = Math.ceil(total / perPage);
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const paginatedStudents = filtered.slice((page - 1) * perPage, page * perPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedProgram, selectedYearLevel, selectedSection]);


  // Add debug logging para makita ang current state
  useEffect(() => {
    console.log("Current Programs:", programs);
    console.log("Current Year Levels:", yearLevels);
    console.log("Current Sections:", sections);
  }, [programs, yearLevels, sections]);

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

  // UI update: match Dean Dashboard
  return (
    <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">
              Daily Attendance
            </h1>
            <p className="text-gray-600">
              View and manage daily student attendance records
            </p>
          </div>

          {/* Filter + Export Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Left side: Search + Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Box */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search students..."
                    className="w-[220px] p-2 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 outline-none"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="px-2 py-1 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Program Dropdown */}
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-[160px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 outline-none"
                >
                  <option value="">Program</option>
                  {programs.length > 0 ? (
                    programs.map((prog) => (
                      <option
                        key={prog.id || prog.program_id}
                        value={prog.program_code}
                      >
                        {prog.program_code}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading programs...</option>
                  )}
                </select>

                {/* Year Level Dropdown */}
                <select
                  value={selectedYearLevel}
                  onChange={(e) => setSelectedYearLevel(e.target.value)}
                  className="w-[140px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 outline-none"
                >
                  <option value="">Year Level</option>
                  {yearLevels.length > 0 ? (
                    yearLevels.map((lvl, idx) => (
                      <option key={idx} value={lvl}>
                        {lvl}
                      </option>
                    ))
                  ) : (
                    <option disabled>No levels available</option>
                  )}
                </select>

                {/* Section Dropdown */}
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-[140px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 outline-none"
                >
                  <option value="">Section</option>
                  {sections.length > 0 ? (
                    sections.map((sec, idx) => (
                      <option key={idx} value={sec}>
                        {sec}
                      </option>
                    ))
                  ) : (
                    <option disabled>No sections available</option>
                  )}
                </select>
              </div>

            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#064F32]/10 text-[#064F32]">
                  <tr>
                    <th className="table-title">Student No.</th>
                    <th className="table-title">Name</th>
                    <th className="table-title">Program</th>
                    <th className="table-title">Year & Section</th>
                    <th className="table-title">Time In</th>
                    <th className="table-title">Time Out</th>
                    <th className="table-title">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No students found
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-[#F6F7FB]">
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">{student.student_no || student.studentNo}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">{student.fullname}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">{student.program}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">{student.year} - {student.section}</td>
                        <td className="px-4 py-3 text-sm text-gray-400 text-center">—</td>
                        <td className="px-4 py-3 text-sm text-gray-400 text-center">—</td>
                        <td className="px-4 py-3 text-sm text-gray-400 text-center">—</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Section */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {from}–{to} of {total} students
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <button className="px-3 py-1 rounded-md bg-[#064F32] text-white hover:opacity-90">
                  {page}
                </button>
                <button
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}