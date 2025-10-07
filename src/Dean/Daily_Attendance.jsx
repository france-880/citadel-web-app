import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Daily_Attendance() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("");
  const [level, setLevel] = useState("");
  const [section, setSection] = useState("");
  const [selected, setSelected] = useState([]); // track selected students




  const filtered = useMemo(() => {
    return students
      .filter((s) =>
        search
          ? (
              s.id.toLowerCase().includes(search.toLowerCase()) ||
              s.name.toLowerCase().includes(search.toLowerCase())
            )
          : true
      )
      .filter((s) => (program ? s.program === program : true))
      .filter((s) => (level ? s.level === level : true))
      .filter((s) => (section ? s.section === section : true));
  }, [students, search, program, level, section]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]); // unselect all
    } else {
      setSelected(filtered.map((s) => s.id)); // select all
    }
  };



  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen">
          {/* Page header row */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">
              Daily Attendance
            </h1>
            <div className="flex gap-3">
            
              <button
                className="px-4 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition"
              >
                Export
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="overflow-x-auto">
              <div className="flex items-center gap-3 flex-nowrap">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="shrink-0 w-[320px] p-1.5 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
                />
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="shrink-0 w-[180px] p-1.5 rounded-md border border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
                >
                  <option value="">Program</option>
                  <option>BSIT</option>
                  <option>BSCS</option>
                  <option>BSIS</option>
                </select>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="shrink-0 w-[180px] p-1.5 rounded-md border border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
                >
                  <option value="">Level</option>
                  <option>1st year</option>
                  <option>2nd year</option>
                  <option>3rd year</option>
                  <option>4th year</option>
                </select>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="shrink-0 w-[180px] p-1.5 rounded-md border border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
                >
                  <option value="">Section</option>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="table-title">Student No.</th>
                    <th className="table-title">Name</th>
                    <th className="table-title">Program</th>
                    <th className="table-title">Year & Section</th>
                    <th className="table-title">Status</th>
                    <th className="table-title">Time In</th>
                    <th className="table-title">Time Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-sm text-gray-500"
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
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {student.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {student.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {student.program}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {student.year_section}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {student.status}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {student.time_in}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {student.time_out}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button className="px-2 py-1 rounded-md border border-[#064F32]/30 text-[#064F32] hover:bg-[#064F32]/5">
                              View
                            </button>
                            <button className="px-2 py-1 rounded-md border border-[#2B7811]/30 text-[#2B7811] hover:bg-[#2B7811]/5">
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

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-white">
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
