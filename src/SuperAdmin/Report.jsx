import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import {
  Search,
  FileDown,
  Printer,
  Users,
  UserCheck,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { programAPI } from "../api/axios";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Reports() {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportRows, setReportRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  // Listen to sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  // Fetch programs
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await programAPI.getAll();
        console.log("Programs fetched:", response.data);
        if (response.data.success) {
          setPrograms(response.data.data);
        } else if (Array.isArray(response.data)) {
          // Handle case where response is directly an array
          setPrograms(response.data);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        toast.error('Failed to load programs');
      }
    };

    fetchProgram();
  }, []);

  // Fetch reports from backend
  const fetchReport = async () => {
    try {
      setLoading(true);
      
      const params = {};
      if (selectedProgram) {
        params.program_code = selectedProgram;
      }
      if (fromDate) {
        params.from_date = fromDate;
      }
      if (toDate) {
        params.to_date = toDate;
      }

      console.log('Fetching report with params:', params);
      const response = await api.get('/reports/students', { params });
      console.log('Report response:', response.data);
      
      if (response.data.success && response.data.data) {
        // Transform backend data to match frontend format
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        const transformed = data.map(row => ({
          studentId: row.student_id || 'N/A',
          name: row.name || 'N/A',
          program: row.program || 'N/A',
          programName: row.program_name || 'N/A',
          inTime: null, // No attendance data yet
          outTime: null, // No attendance data yet
          status: null // No attendance data yet
        }));
        
        console.log('Transformed rows:', transformed);
        setReportRows(transformed);
        
        if (transformed.length === 0) {
          toast.info('No students found for the selected filters');
        } else {
          toast.success(`Report generated: ${transformed.length} student(s) found`);
        }
      } else {
        console.error('Invalid response format:', response.data);
        toast.error(response.data?.message || 'Failed to generate report');
        setReportRows([]);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to generate report');
      setReportRows([]);
    } finally {
      setLoading(false);
    }
  };

  // CSV Export
  const downloadCSV = (filename, rows) => {
    if (!rows || !rows.length) {
      alert("No rows to export.");
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    downloadCSV("attendance-report.csv", reportRows);
  };

  const handlePrint = () => window.print();

  const filteredRows = reportRows.filter((r) => {
    if (!q) return true;
    const text = (r.studentId + r.name + r.program + (r.status || '')).toLowerCase();
    return text.includes(q.toLowerCase());
  });

  const summary = {
    totalRows: filteredRows.length,
    currentlyInside: 0 // No attendance data yet
  };

  return (
    <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">
              Reports
            </h1>
            <p className="text-gray-600">
              Generate and export student reports across all programs
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[180px]">
                
                {/* Prorgram Dropdown */}
                <label className="block text-sm text-gray-600 mb-1">
                  Program
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">All Programs</option>
                  {programs.map((program) => (
                    <option
                      key={program.id}
                      value={program.program_code.toLowerCase()}
                    >
                      {program.program_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm text-gray-600 mb-1">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex-none">
                <button
                  onClick={fetchReport}
                  className="px-6 bg-[#064F32] text-white py-2 rounded-lg font-medium hover:bg-[#086242] transition h-[38px]"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Search + Export Buttons */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search in report..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-[#064F32]/20 focus:border-[#064F32] transition-all"
                />
              </div>

              <div className="flex-none flex gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all text-[#064F32]"
                >
                  <FileDown className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all text-[#064F32]"
                >
                  <Printer className="w-4 h-4" /> Print / PDF
                </button>
              </div>
            </div>
          </div>

          {/* Report Table */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Generating report...
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="text-gray-600 bg-gray-50">
                      <tr>
                        <th className="py-2 px-4">Student ID</th>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Program</th>
                        <th className="py-2 px-4">In Time</th>
                        <th className="py-2 px-4">Out Time</th>
                        <th className="py-2 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            No records found. Click "Generate Report".
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map((r, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition">
                            <td className="py-2 px-4">{r.studentId}</td>
                            <td className="py-2 px-4">{r.name}</td>
                            <td className="py-2 px-4">{r.program}</td>
                            <td className="py-2 px-4">-</td>
                            <td className="py-2 px-4">-</td>
                            <td className="py-2 px-4">-</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary Footer */}
                <div className="mt-6 flex justify-between text-sm text-gray-700">
                  <p>
                    <strong>Total Rows:</strong> {summary.totalRows}{" "}
                    &nbsp;|&nbsp;
                    <strong>Currently Inside:</strong> {summary.currentlyInside}
                  </p>
                  <button
                    onClick={() =>
                      alert("Archive download feature not yet implemented.")
                    }
                    className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition"
                  >
                    Archived Reports
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}