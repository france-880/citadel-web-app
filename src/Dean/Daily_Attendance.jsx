import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { programAPI, yearSectionAPI, studentAPI } from "../api/axios";

export default function Daily_Attendance() {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [programs, setPrograms] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [sections, setSections] = useState([]);
  const [yearSections, setYearSections] = useState([]); // store full objects
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  const [page, setPage] = useState(1);
  const perPage = 10;

  // Sidebar toggle listener
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  // Fetch students
  useEffect(() => {
    const fetchStudentsWithLogs = async () => {
      try {
        const response = await studentAPI.getAllWithLogs();
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students with logs:", error);
        setStudents([]);
      }
    };
    fetchStudentsWithLogs();
  }, []);

  // Fetch programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const response = await programAPI.getAll("/programs");
        console.log("Programs API Response:", response);
        console.log("Programs Data:", response.data);

        if (Array.isArray(response.data)) setPrograms(response.data);
        else if (response.data?.success && Array.isArray(response.data.data))
          setPrograms(response.data.data);
        else {
          console.warn("Unexpected programs response structure:", response.data);
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

  // Fetch year levels and sections
  useEffect(() => {
    const fetchYearSections = async () => {
      try {
        setIsLoading(true);
        const response = await yearSectionAPI.getAll();
        console.log("Year Sections API Response:", response);

        let data = [];
        if (Array.isArray(response.data)) data = response.data;
        else if (response.data?.success && Array.isArray(response.data.data))
          data = response.data.data;
        else console.warn("Unexpected year sections response:", response.data);

        setYearSections(data);

        const uniqueYears = [...new Set(data.map((y) => y.year_level))].filter(Boolean);
        setYearLevels(uniqueYears);

        const uniqueSections = [...new Set(data.map((s) => s.section))].filter(Boolean);
        setSections(uniqueSections);

        console.log("Processed Year Sections Data:", data);
        console.log("Unique Years:", uniqueYears);
        console.log("Unique Sections:", uniqueSections);
      } catch (error) {
        console.error("Error fetching year levels and sections:", error);
        setYearLevels([]);
        setSections([]);
        setYearSections([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchYearSections();
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (search) {
        const term = search.toLowerCase();
        const studentNo = s.student_no || s.studentNo || s.id || "";
        const studentName = s.fullname || s.name || "";
        if (!studentNo.toLowerCase().includes(term) && !studentName.toLowerCase().includes(term))
          return false;
      }
      if (selectedProgram && s.program_id !== selectedProgram) return false;
      if (selectedYearLevel && s.year_section_id) {
        const ys = yearSections.find((y) => y.id === s.year_section_id);
        if (!ys || ys.year_level !== selectedYearLevel) return false;
      }
      if (selectedSection && s.year_section_id) {
        const ys = yearSections.find((y) => y.id === s.year_section_id);
        if (!ys || ys.section !== selectedSection) return false;
      }
      return true;
    });
  }, [students, search, selectedProgram, selectedYearLevel, selectedSection, yearSections]);

  const total = filtered.length;
  const lastPage = Math.ceil(total / perPage);
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const paginatedStudents = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [search, selectedProgram, selectedYearLevel, selectedSection]);

  // Helper functions to map IDs to names
  const getProgramName = (programId) => {
    const prog = programs.find((p) => p.id === programId);
    if (!prog) console.warn("Program not found for id:", programId);
    return prog ? prog.program_code : "—";
  };

  const getYearSectionName = (yearSectionId) => {
    const ys = yearSections.find((y) => y.id === yearSectionId);
    if (!ys) console.warn("Year & Section not found for id:", yearSectionId);
    return ys ? `${ys.year_level} - ${ys.section}` : "—";
  };

  if (isLoading) {
    return (
      <div className={`flex content_padding ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
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
    <div className={`flex content_padding ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">Daily Attendance</h1>
            <p className="text-gray-600">View and manage daily student attendance records</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="w-[220px] p-2 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 outline-none"
                />
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-[160px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 outline-none"
                >
                  <option value="">Program</option>
                  {programs.length > 0
                    ? programs.map((prog) => (
                        <option key={prog.id} value={prog.id}>
                          {prog.program_code}
                        </option>
                      ))
                    : <option disabled>Loading programs...</option>}
                </select>
                <select
                  value={selectedYearLevel}
                  onChange={(e) => setSelectedYearLevel(e.target.value)}
                  className="w-[140px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 outline-none"
                >
                  <option value="">Year Level</option>
                  {yearLevels.length > 0
                    ? yearLevels.map((lvl, idx) => <option key={idx} value={lvl}>{lvl}</option>)
                    : <option disabled>No levels available</option>}
                </select>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-[140px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 outline-none"
                >
                  <option value="">Section</option>
                  {sections.length > 0
                    ? sections.map((sec, idx) => <option key={idx} value={sec}>{sec}</option>)
                    : <option disabled>No sections available</option>}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
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
                      <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student, index) => {
                      const timestamp = student.latest_timestamp ? new Date(student.latest_timestamp) : null;
                      const timeIn = timestamp ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
                      const date = timestamp ? timestamp.toLocaleDateString() : '—';

                      return (
                        <tr key={`${student.id}-${index}`} className="hover:bg-[#F6F7FB]">
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">{student.student_no || student.studentNo}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">{student.fullname}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">{getProgramName(student.program_id)}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">{getYearSectionName(student.year_section_id)}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">{timeIn}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">—</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">{date}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
                <button className="px-3 py-1 rounded-md bg-[#064F32] text-white hover:opacity-90">{page}</button>
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
