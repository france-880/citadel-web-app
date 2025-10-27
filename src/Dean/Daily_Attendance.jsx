import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { programAPI, yearSectionAPI } from "../api/axios";

export default function Daily_Attendance() {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [programs, setPrograms] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  // Search for Students (mock data for now)
  useEffect(() => {
    setStudents([
      {
        id: "2021-001",
        name: "Juan Dela Cruz",
        program: "BSIT",
        year_section: "1st Year - A",
        status: "Present",
        time_in: "07:58 AM",
        time_out: "05:00 PM",
      },
      {
        id: "2021-002",
        name: "Maria Santos",
        program: "BSIT",
        year_section: "1st Year - A",
        status: "Absent",
        time_in: "-",
        time_out: "-",
      },
    ]);
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
        if (
          !s.id.toLowerCase().includes(term) &&
          !s.name.toLowerCase().includes(term)
        )
          return false;
      }
      if (selectedProgram && s.program !== selectedProgram) return false;
      if (
        selectedYearLevel &&
        !s.year_section
          .toLowerCase()
          .startsWith(selectedYearLevel.toLowerCase())
      )
        return false;
      if (selectedSection) {
        const sec = s.year_section.split("-")[1]?.trim().toLowerCase();
        if (sec !== selectedSection.toLowerCase()) return false;
      }
      return true;
    });
  }, [students, search, selectedProgram, selectedYearLevel, selectedSection]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((s) => s.id)
    );
  };

  // Add debug logging para makita ang current state
  useEffect(() => {
    console.log("Current Programs:", programs);
    console.log("Current Year Levels:", yearLevels);
    console.log("Current Sections:", sections);
  }, [programs, yearLevels, sections]);

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

  // UI update: match Dean Dashboard
  return (
    <div className="flex" style={{ paddingLeft: "260px", paddingTop: "70px" }}>
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

              {/* Export Button */}
              <button className="flex items-center gap-2 px-6 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                  />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#064F32]/10 text-[#064F32]">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          selected.length === filtered.length &&
                          filtered.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3">Student No.</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3">Year & Section</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Time In</th>
                    <th className="px-4 py-3">Time Out</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No students found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((student) => (
                      <tr key={student.id} className="hover:bg-[#F6F7FB]">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(student.id)}
                            onChange={() => toggleSelect(student.id)}
                          />
                        </td>
                        <td className="px-4 py-3">{student.id}</td>
                        <td className="px-4 py-3">{student.name}</td>
                        <td className="px-4 py-3">{student.program}</td>
                        <td className="px-4 py-3">{student.year_section}</td>
                        <td
                          className={`px-4 py-3 font-medium ${
                            student.status === "Present"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {student.status}
                        </td>
                        <td className="px-4 py-3">{student.time_in}</td>
                        <td className="px-4 py-3">{student.time_out}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="px-2 py-1 text-sm rounded-md border border-[#064F32]/40 text-[#064F32] hover:bg-[#064F32]/5">
                              View
                            </button>
                            <button className="px-2 py-1 text-sm rounded-md border border-[#2B7811]/40 text-[#2B7811] hover:bg-[#2B7811]/5">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {filtered.length} of {students.length}
              </p>
              <div className="flex gap-2">
                <button
                  disabled
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed"
                >
                  Prev
                </button>
                <button className="px-3 py-1 rounded-md bg-[#064F32] text-white hover:opacity-90">
                  1
                </button>
                <button
                  disabled
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed"
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
