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

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('ProfReport component mounted successfully!');
  }, []);

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
    <div className={`flex content_padding ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 bg-[#F6F7FB] min-h-screen">
          {/* Page header row: Title + Actions */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">Professor Report</h1>
            <div className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
              Component Loaded Successfully
            </div>
          </div>

          {/* Calendar with Input */}
          <div className="mb-6 flex flex-row justify-end items-center gap-4">
            {/* Export button */}
            <button className="px-3 py-2 flex items-center text-sm gap-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition">
              <Download className="w-4 h-4 text-white" />
              Export
            </button>
            
            {/* Input + Calendar wrapper */}
            <div className="relative">
              <input
                type="text"
                placeholder="Select date (YYYY-MM-DD)"
                value={formatDate(selected)}
                onClick={() => setShowCalendar(!showCalendar)}
                readOnly
                className="w-80 p-2 md:p-1.5 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none cursor-pointer text-sm"
              />

              {showCalendar && (
                <div className="absolute top-full right-0 mt-2 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80">
                  <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={handleDateSelect}
                  />
                </div>
              )}
            </div>
          </div>


          {/* Table Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="table-title text-center">Student No.</th>
                    <th className="table-title text-center">Name</th>
                    <th className="table-title text-center">Program, Year Level & Section</th>
                    <th className="table-title text-center">Status</th>
                    <th className="table-title text-center">Time In</th>
                    <th className="table-title text-center">Time Out</th>
                    <th className="table-title text-center">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                     <tr key={i} className="hover:bg-[#F6F7FB]">
                       <td className="px-2 py-2 text-sm text-gray-700 text-center">
                         202220810-N
                       </td>
                       <td className="px-2 py-2 text-sm text-gray-800 text-center">
                         Jessie Course
                       </td>
                       <td className="px-2 py-2 text-sm text-gray-700 text-center">BSIT 4C</td>
                       <td className="px-2 py-2 text-sm text-gray-700 text-center">Present</td>
                       <td className="px-2 py-2 text-sm text-gray-700 text-center">10:00 AM</td>
                       <td className="px-2 py-2 text-sm text-gray-700 text-center">1:00 PM</td>
                       <td className="px-2 py-2 text-sm text-gray-700 text-center">
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