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

export default function Reports() {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportRows, setReportRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  // Mock programs
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const response = await programAPI.getAll("/api/programs");
        console.log("Prorgams fetched:", response.data);
        if (response.data.success) {
          setPrograms(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Simulated data fetching
  const fetchReport = async () => {
    setLoading(true);
    const mock = [
      {
        studentId: "S001",
        name: "Juan Dela Cruz",
        program: "BSIT",
        inTime: "2025-10-24 07:35",
        outTime: "2025-10-24 17:20",
        status: "Outside",
      },
      {
        studentId: "S109",
        name: "Maria Santos",
        program: "BSCS",
        inTime: "2025-10-24 08:05",
        outTime: "",
        status: "Inside",
      },
      {
        studentId: "S230",
        name: "Pedro Tan",
        program: "BSBA",
        inTime: "2025-10-24 07:50",
        outTime: "2025-10-24 12:00",
        status: "Outside",
      },
    ];

    setTimeout(() => {
      const filtered = mock.filter(
        (r) =>
          !selectedProgram ||
          selectedProgram === "" ||
          r.program.includes(selectedProgram)
      );
      setReportRows(filtered);
      setLoading(false);
    }, 500);
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
    const text = (r.studentId + r.name + r.program + r.status).toLowerCase();
    return text.includes(q.toLowerCase());
  });

  const summary = {
    totalRows: filteredRows.length,
    currentlyInside: filteredRows.filter((r) => r.status === "Inside").length,
  };

  return (
    <div className="flex" style={{ paddingLeft: '260px', paddingTop: '70px' }}>
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
              Generate and export student attendance reports across all programs
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
                            No records found. Click “Generate Report”.
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map((r, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition">
                            <td className="py-2 px-4">{r.studentId}</td>
                            <td className="py-2 px-4">{r.name}</td>
                            <td className="py-2 px-4">{r.program}</td>
                            <td className="py-2 px-4">{r.inTime}</td>
                            <td className="py-2 px-4">{r.outTime || "-"}</td>
                            <td className="py-2 px-4">{r.status}</td>
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