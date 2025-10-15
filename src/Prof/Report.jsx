import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

import { Download } from "lucide-react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export default function ProfReport() {
  const [selected, setSelected] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  const handleDateSelect = (date) => {
    setSelected(date);
    setShowCalendar(false); // Close calendar when date is selected
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-0'}`}>
        <Header />

        <main className="p-6 min-h-screen">
          {/* Page header row: Title + Actions */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">Report</h1>
          </div>

          {/* Calendar with Input */}
          <div className="mb-6 flex flex-col sm:flex-row justify-start items-start gap-4">
            {/* Input + Calendar wrapper */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Select date (YYYY-MM-DD)"
                value={formatDate(selected)}
                onClick={() => setShowCalendar(!showCalendar)}
                readOnly
                className="w-full sm:w-[240px] md:w-[280px] p-2 md:p-1.5 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none cursor-pointer text-sm"
              />

              {showCalendar && (
                <div className="absolute top-full left-0 mt-2 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                  <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={handleDateSelect}
                  />
                </div>
              )}
            </div>

            {/* Export button */}
            <button className="px-3 py-2 flex items-center text-sm gap-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition">
              <Download className="w-4 h-4 text-white" />
              Export
            </button>
          </div>


          {/* Table Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="table-title">Student No.</th>
                    <th className="table-title">Name</th>
                    <th className="table-title">Program, Year Level & Section</th>
                    <th className="table-title">Status</th>
                    <th className="table-title">Time In</th>
                    <th className="table-title">Time Out</th>
                    <th className="table-title">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                     <tr key={i} className="hover:bg-[#F6F7FB]">
                       <td className="px-2 py-2 text-sm text-gray-700">
                         202220810-N
                       </td>
                       <td className="px-2 py-2 text-sm text-gray-800">
                         Jessie Course
                       </td>
                       <td className="px-2 py-2 text-sm text-gray-700">BSIT 4C</td>
                       <td className="px-2 py-2 text-sm text-gray-700">Present</td>
                       <td className="px-2 py-2 text-sm text-gray-700">10:00 AM</td>
                       <td className="px-2 py-2 text-sm text-gray-700">1:00 PM</td>
                       <td className="px-2 py-2 text-sm text-gray-700">
                         Aug 8, 2025
                       </td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-white">
              <p className="text-sm text-gray-600">Showing 1-8 of 8</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-[#F6F7FB]">
                  Prev
                </button>
                <button className="px-3 py-1 rounded-md bg-[#064F32] text-white hover:opacity-90">
                  1
                </button>
                <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-[#F6F7FB]">
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