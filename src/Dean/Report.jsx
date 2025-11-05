import React, { useState, useEffect, useMemo } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { Download } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { studentAPI } from "../api/axios";

export default function Report() {
  const [selected, setSelected] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  const handleDateSelect = (date) => {
    setSelected(date);
    setShowCalendar(false); // Close calendar when date is selected
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Filter students by selected date (if date is selected)
  const filtered = useMemo(() => {
    let filteredStudents = students;
    
    // If a date is selected, you can filter by date here
    // For now, we'll show all students since attendance data structure is not yet implemented
    // This can be extended when attendance API is available
    
    return filteredStudents;
  }, [students, selected]);

  // Calculate pagination
  const total = filtered.length;
  const lastPage = Math.ceil(total / perPage);
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const paginatedStudents = filtered.slice((page - 1) * perPage, page * perPage);

  // Reset to page 1 when date changes
  useEffect(() => {
    setPage(1);
  }, [selected]);

  return (
    <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">Report</h1>
            <p className="text-gray-600">
              View and export attendance reports by date
            </p>
          </div>

          {/* Calendar with Input */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Input + Calendar wrapper */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select date (YYYY-MM-DD)"
                  value={formatDate(selected)}
                  onClick={() => setShowCalendar(!showCalendar)}
                  readOnly
                  className="w-[340px] p-2 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none cursor-pointer"
                />

                {showCalendar && (
                  <div className="absolute top-full left-0 mt-2 z-10 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                    <DayPicker
                      mode="single"
                      selected={selected}
                      onSelect={handleDateSelect}
                    />
                  </div>
                )}
              </div>
            <div className="flex items-center justify-end">
              <button className="px-6 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition shadow flex items-center gap-2">
                <Download className="w-4 h-4 text-white" />
                Export
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064F32]"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-[#064F32]/10 text-[#064F32]">
                        <th className="px-4 py-3 text-center">Student No.</th>
                        <th className="px-4 py-3 text-center">Name</th>
                        <th className="px-4 py-3 text-center">Program</th>
                        <th className="px-4 py-3 text-center">Year & Section</th>
                        <th className="px-4 py-3 text-center">Time In</th>
                        <th className="px-4 py-3 text-center">Time Out</th>
                        <th className="px-4 py-3 text-center">Date</th>
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
                            <td className="px-4 py-3 text-sm text-gray-700 text-center">
                              {student.student_no || student.studentNo}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800 text-center">
                              {student.fullname}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-center">
                              {student.program || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-center">
                              {student.year && student.section 
                                ? `${student.year} - ${student.section}` 
                                : "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-400 text-center">—</td>
                            <td className="px-4 py-3 text-sm text-gray-400 text-center">—</td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-center">
                              {selected ? formatDate(selected) : "—"}
                            </td>
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}