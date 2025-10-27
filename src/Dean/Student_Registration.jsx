import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Edit, Check } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import View_Student from "./View_Student";

function CustomCheckbox({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded 
                   checked:bg-[#FF7A00] checked:border-[#FF7A00] cursor-pointer"
      />
      {checked && (
        <Check className="w-3 h-3 text-white absolute left-0.5 top-0.5 pointer-events-none" />
      )}
    </label>
  );
}

export default function Student_Registration() {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // pagination data
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students", {
        params: {
          search,
          program,
          year,
          section,
          page,
          per_page: 10,
        },
      });

      const data = res.data;
      setStudents(data.data);
      setLastPage(data.last_page);
      setFrom(data.from);
      setTo(data.to);
      setTotal(data.total);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to fetch students");
    }
  };

  // Fetch students when filters or page changes
  useEffect(() => {
    fetchStudents();
  }, [search, program, year, section, page]);

  const handleEdit = (id) => navigate(`/edit_student/${id}`);

  // Checkbox management
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(students.map((s) => s.id));
    else setSelectedIds([]);
  };

  const handleDeleteSelected = () => handleDelete(selectedIds);

  const handleDelete = async (ids) => {
    if (!ids || ids.length === 0) return;
    setDeleting(true);

    const promise = api.delete("/students/delete-multiple", {
      data: { ids },
    });

    toast.promise(promise, {
      loading: "Deleting student...",
      success: (res) =>
        res.data?.message || 
      `${ids.length} student(s) deleted successfully!`,
      error: (err) =>
        err.response?.data?.message || "Failed to delete students.",
    });

    try {
      await promise;
      setSelectedIds([]);
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting students:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddStudent = () => navigate("/new_student");

  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">
              Student Registration
            </h1>
            <button
              onClick={handleAddStudent}
              className="px-4 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition"
            >
              + New Student
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="overflow-x-auto">
              <div className="flex items-center gap-3 flex-nowrap">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search students..."
                  className="w-[300px] p-1.5 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
                />
                <select
                  value={program}
                  onChange={(e) => {
                    setProgram(e.target.value);
                    setPage(1);
                  }}
                  className="w-[180px] p-1.5 rounded-md border border-gray-200"
                >
                  <option value="">Program</option>
                  <option>BSIT</option>
                  <option>BSCS</option>
                  <option>BSIS</option>
                </select>
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setPage(1);
                  }}
                  className="w-[180px] p-1.5 rounded-md border border-gray-200"
                >
                  <option value="">Year Level</option>
                  <option>1st year</option>
                  <option>2nd year</option>
                  <option>3rd year</option>
                  <option>4th year</option>
                </select>
                <select
                  value={section}
                  onChange={(e) => {
                    setSection(e.target.value);
                    setPage(1);
                  }}
                  className="w-[180px] p-1.5 rounded-md border border-gray-200"
                >
                  <option value="">Section</option>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>

                {selectedIds.length > 0 && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-2 py-2 rounded-md text-white text-sm bg-red-600 hover:bg-red-700 transition"
                  >
                    Delete Selected
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          students.length > 0 &&
                          selectedIds.length === students.length
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="table-title">Student No.</th>
                    <th className="table-title">Name</th>
                    <th className="table-title">Program</th>
                    <th className="table-title">Year Level</th>
                    <th className="table-title">Section</th>
                    <th className="table-title">Date Registered</th>
                    <th className="table-title">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="hover:bg-[#F6F7FB]">
                        <td className="px-4 py-3">
                          <CustomCheckbox
                            checked={selectedIds.includes(student.id)}
                            onChange={() => handleCheckboxChange(student.id)}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.studentNo}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-center">
                          {student.fullname}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.program}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.year}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.section}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.created_at
                            ? new Date(student.created_at).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                }
                              )
                            : ""}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <View_Student student={student} />
                            <button
                              onClick={() => handleEdit(student.id)}
                              className=""
                            >
                              <Edit className="w-8 h-8 text-[#064F32] bg-[#064F32]/10 px-[6px] py-[2px] rounded-md border border-[#064F32]/30 hover:text-[#064F32] hover:bg-[#064F32]/20" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-white">
              <p className="text-sm text-gray-600">
                Showing {from}–{to} of {total} students
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {page} of {lastPage}
                </span>
                <button
                  disabled={page === lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Delete confirmation modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                <div className="flex justify-center mb-3">
                  <svg
                    className="w-12 h-12 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 
                      2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 
                      1 0 011-1h2a1 1 0 011 1v3"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2 mt-10">DELETE</h2>
                <p className="mb-4">
                  Are you sure you want to delete {selectedIds.length} student(s)?
                </p>
                <div className="flex justify-center gap-4 mt-10">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={deleting}
                    className={`px-4 py-2 text-white rounded ${
                      deleting
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-700 hover:bg-red-800"
                    }`}
                  >
                    {deleting ? "Deleting..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
