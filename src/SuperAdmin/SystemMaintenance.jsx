import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

export default function SystemMaintenance() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const mock = [
      {
        id: 1,
        datetime: "2025-10-24 09:15",
        user: "SuperAdmin",
        role: "Super Admin",
        action: "Created college: CCS",
      },
      {
        id: 2,
        datetime: "2025-10-24 09:30",
        user: "Dean - IT",
        role: "Dean",
        action: "Added program: BSIT",
      },
      {
        id: 3,
        datetime: "2025-10-23 22:10",
        user: "System",
        role: "System",
        action: "Auto-backup completed",
      },
    ];
    setTimeout(() => {
      setLogs(mock);
      setLoading(false);
    }, 300);
  }, []);

  const filteredLogs = logs.filter((l) => {
    const q = (l.user + l.role + l.action + l.datetime).toLowerCase();
    if (search && !q.includes(search.toLowerCase())) return false;
    if (dateFrom && new Date(l.datetime) < new Date(dateFrom)) return false;
    if (dateTo && new Date(l.datetime) > new Date(dateTo + "T23:59:59"))
      return false;
    return true;
  });

  function downloadCSV(filename, rows) {
    if (!rows || !rows.length) return;
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
  }

  const handleBackup = () => {
    downloadCSV("system-backup-audit-logs.csv", logs);
  };

  const handleExportLogs = () => {
    downloadCSV("audit-logs.csv", filteredLogs);
  };

  const handleResetLogs = () => {
    if (
      !window.confirm(
        "Are you sure you want to reset (clear) logs? This cannot be undone in this demo."
      )
    )
      return;
    setLogs([]);
  };

  return (
    <div className="flex" style={{ paddingLeft: '260px', paddingTop: '70px' }}>
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 min-h-screen bg-gray-50">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">
              System Maintenance
            </h1>
            <p className="text-gray-600">
              Manage system backups, audit logs, and maintenance utilities.
            </p>
          </div>

          {/* Backup / Export Section */}
          <section className="mb-6 bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">💾 Backup & Export</h3>
                <p className="text-sm text-gray-500">
                  Download system data or backups for safekeeping.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleBackup}
                  className="px-4 py-2 bg-[#064F32] text-white rounded-lg hover:bg-[#053d27] transition"
                >
                  Download Backup (Demo)
                </button>
                <button
                  onClick={() => alert("Export users feature - connect to API")}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Export Users CSV
                </button>
                <button
                  onClick={() =>
                    alert("Export student logs feature - connect to API")
                  }
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Export Student Logs
                </button>
              </div>
            </div>
          </section>

          {/* Audit Trail */}
          <section className="mb-6 bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 gap-4">
              <div>
                <h3 className="text-lg font-semibold">📜 Audit Trail / Logs</h3>
                <p className="text-sm text-gray-500">
                  View system activities for accountability.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-1 border rounded-lg"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-1 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-1 border rounded-lg"
                />
                <button
                  onClick={handleExportLogs}
                  className="px-4 py-1.5 bg-[#064F32] text-white rounded-lg hover:bg-[#053d27] transition"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <table className="min-w-full text-sm text-left">
                  <thead className="text-gray-600 bg-gray-50">
                    <tr>
                      <th className="py-2 px-4">Date & Time</th>
                      <th className="py-2 px-4">User</th>
                      <th className="py-2 px-4">Role</th>
                      <th className="py-2 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 text-gray-500"
                        >
                          No logs to display
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((l) => (
                        <tr key={l.id} className="hover:bg-gray-50 transition">
                          <td className="py-2 px-4">{l.datetime}</td>
                          <td className="py-2 px-4">{l.user}</td>
                          <td className="py-2 px-4">{l.role}</td>
                          <td className="py-2 px-4">{l.action}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleResetLogs}
                className="px-3 py-1 border rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                Reset Logs (Demo)
              </button>
              <button
                onClick={() => alert("Open archived logs - implement API")}
                className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition"
              >
                View Archived Logs
              </button>
            </div>
          </section>

          {/* System Utilities */}
          <section className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-3">🧰 System Utilities</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => alert("Trigger health check - implement API")}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Health Check
              </button>
              <button
                onClick={() => alert("Toggle maintenance mode - implement API")}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Toggle Maintenance Mode
              </button>
              <button
                onClick={() => alert("Run test backup - implement API")}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Run Test Backup
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}