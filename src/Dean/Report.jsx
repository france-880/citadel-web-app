import React, { useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { Download } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export default function Report() {
  const [selected, setSelected] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (date) => {
    setSelected(date);
    setShowCalendar(false); // Close calendar when date is selected
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  return (
    <div className="flex" style={{ paddingLeft: "260px", paddingTop: "70px" }}>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Input + Calendar wrapper */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select date (YYYY-MM-DD)"
                  value={formatDate(selected)}
                  onClick={() => setShowCalendar(!showCalendar)}
                  readOnly
                  className="w-full p-2 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none cursor-pointer"
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
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="px-4 py-3">Student No.</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Program, Year Level & Section</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Time In</th>
                    <th className="px-4 py-3">Time Out</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <tr key={i} className="hover:bg-[#F6F7FB]">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        202220810-N
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        Jessie Course
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        BSIT 4C
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Present
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        10:00 AM
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        1:00 PM
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Aug 8, 2025
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">Showing 1-8 of 8</p>
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
