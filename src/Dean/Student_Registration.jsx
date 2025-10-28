import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Edit, Check } from "lucide-react";
import { programAPI, yearSectionAPI, studentAPI } from "../api/axios"; // ✅ Added studentAPI
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

  // ✅ Consistent state variable names
  const [program, setProgram] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");

  const [programs, setPrograms] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [sections, setSections] = useState([]);

  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // pagination data
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);

  // ✅ Idagdag ito para ma-detect ang refresh trigger
  useEffect(() => {
    // Check if we should refresh after coming back from new student
    if (location.state?.shouldRefresh) {
      fetchStudents(); // ✅ Refresh the list
      // Clear the state to prevent infinite refreshes
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  // ✅ Fixed fetchStudents function
  const fetchStudents = async () => {
    try {
      setIsLoading(true);

      // ✅ Use correct parameter names that match backend
      const params = {
        search: search || undefined,
        program: program || undefined, // ✅ Backend expects 'program' (program_id value)
        year: year || undefined, // ✅ Backend expects 'year' (year_level value)
        section: section || undefined, // ✅ Backend expects 'section' (section value)
        page: page || 1,
        per_page: 10,
      };

      // ✅ Clean up empty parameters
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      console.log("📤 API Request Params:", params);

      const res = await studentAPI.getAll(params);
      console.log("✅ API Response:", res.data);

      // ✅ Handle Laravel pagination response
      if (res.data && res.data.data) {
        setStudents(res.data.data);
        setLastPage(res.data.last_page || 1);
        setFrom(res.data.from || 0);
        setTo(res.data.to || 0);
        setTotal(res.data.total || 0);
      } else {
        setStudents([]);
        setLastPage(1);
        setFrom(0);
        setTo(0);
        setTotal(0);
      }
    } catch (err) {
      console.error("❌ Error fetching students:", err);
      console.error("Error details:", err.response?.data);
      toast.error("Failed to fetch students");
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 Initial data fetch");
    fetchStudents();
  }, []); // Empty dependency array - runs once on mount

  // Fetch students when filters or page changes
  useEffect(() => {
    fetchStudents();
  }, [search, program, year, section, page]);

  // ✅ Fixed Fetch Programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await programAPI.getAll("/programs");
        console.log("Programs API Response:", response);

        let programsData = [];

        if (response.data && Array.isArray(response.data)) {
          programsData = response.data;
        } else if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          programsData = response.data.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          programsData = response.data.data;
        }

        console.log("Final Programs Data:", programsData);
        setPrograms(programsData);
      } catch (error) {
        console.error("Error fetching programs:", error);
        setPrograms([]);
      }
    };
    fetchPrograms();
  }, []);

  // ✅ Fixed Fetch Year Levels & Sections
  useEffect(() => {
    const fetchYearSections = async () => {
      try {
        const response = await yearSectionAPI.getAll();
        console.log("Year Sections API Response:", response);

        let data = [];

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
        }

        console.log("Processed Year Sections Data:", data);

        // Get unique year levels
        const uniqueYears = [
          ...new Set(
            data
              .map((item) => item.year_level)
              .filter((year) => year && year.trim() !== "")
          ),
        ].sort();

        // Get unique sections
        const uniqueSections = [
          ...new Set(
            data
              .map((item) => item.section)
              .filter((section) => section && section.trim() !== "")
          ),
        ].sort();

        console.log("Unique Years:", uniqueYears);
        console.log("Unique Sections:", uniqueSections);

        setYearLevels(uniqueYears);
        setSections(uniqueSections);
      } catch (error) {
        console.error("Error fetching year levels and sections:", error);
        setYearLevels([]);
        setSections([]);
      }
    };
    fetchYearSections();
  }, []);

  const handleEdit = (id) => navigate(`/dean-edit-student/${id}`);

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

    try {
      const promise = studentAPI.delete("/students/delete-multiple", {
        data: { ids },
      });

      await toast.promise(promise, {
        loading: "Deleting student...",
        success: (res) =>
          res.data?.message || `${ids.length} student(s) deleted successfully!`,
        error: (err) =>
          err.response?.data?.message || "Failed to delete students.",
      });

      setSelectedIds([]);
      setShowModal(false);
      fetchStudents(); // Refresh the list
    } catch (err) {
      console.error("Error deleting students:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddStudent = () => navigate("/dean-new-student");

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setProgram("");
    setYear("");
    setSection("");
    setPage(1);
  };

  if (isLoading && students.length === 0) {
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

  return (
    <div className="flex" style={{ paddingLeft: "260px", paddingTop: "70px" }}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#064F32] mb-2">
                Student Registration
              </h1>
              <p className="text-gray-600">
                Manage and register students in the system
              </p>
            </div>
            <button
              onClick={handleAddStudent}
              className="px-6 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition shadow"
            >
              + New Student
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search students..."
                  className="w-[220px] p-2 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-[#064F32]/30 outline-none"
                />
                {(search || program || year || section) && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm"
                    title="Clear all filters"
                  >
                    Clear All
                  </button>
                )}
              </div>
              {/* Sa program dropdown, gamitin ang program_name */}
              <select
                value={program}
                onChange={(e) => {
                  setProgram(e.target.value);
                  setPage(1);
                }}
                className="w-[160px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 outline-none"
              >
                <option value="">All Programs</option>
                {programs.map((prog) => (
                  <option
                    key={prog.id || prog.program_id}
                    value={prog.program_name}
                  >
                    {prog.program_name}
                  </option>
                ))}
              </select>
              {/* Sa year level dropdown */}
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setPage(1);
                }}
                className="w-[160px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 outline-none"
              >
                <option value="">All Year Levels</option>
                {yearLevels.map((yearLevel, index) => (
                  <option key={index} value={yearLevel}>
                    {yearLevel}
                  </option>
                ))}
              </select>
              {/* Sa section dropdown */}
              <select
                value={section}
                onChange={(e) => {
                  setSection(e.target.value);
                  setPage(1);
                }}
                className="w-[140px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 outline-none"
              >
                <option value="">All Sections</option>
                {sections.map((sectionItem, index) => (
                  <option key={index} value={sectionItem}>
                    {sectionItem}
                  </option>
                ))}
              </select>
              {selectedIds.length > 0 && (
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition ml-auto"
                >
                  Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          {/* Debug Info - Remove in production */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
            <p>
              <strong>Debug Info:</strong>
            </p>
            <p>
              Programs: {programs.length} | Years: {yearLevels.length} |
              Sections: {sections.length}
            </p>
            <p>
              Current Filters: Program="{program}", Year="{year}", Section="
              {section}"
            </p>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="px-4 py-3">
                      <CustomCheckbox
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
                        {isLoading
                          ? "Loading students..."
                          : "No students found"}
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
                          {student.studentNo || student.student_no}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-center">
                          {student.fullname ||
                            `${student.firstname} ${student.lastname}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.program}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.year || student.year_level}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.section}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">
                          {student.created_at
                            ? new Date(student.created_at).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2 justify-center">
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
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {page} of {lastPage}
                </span>
                <button
                  disabled={page === lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-50"
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
                  Are you sure you want to delete {selectedIds.length}{" "}
                  student(s)?
                </p>
                <div className="flex justify-center gap-4 mt-10">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
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