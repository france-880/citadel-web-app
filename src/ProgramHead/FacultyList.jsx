import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useState } from "react";
import { Search, X, Eye, BookOpen, Users, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function FacultyList() {
  const navigate = useNavigate();
  
  // Table State for Faculty List
  const [facultyList, setFacultyList] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyLoads, setFacultyLoads] = useState([]);
  const [loadingLoads, setLoadingLoads] = useState(false);

  // Fetch faculty data from API
  const fetchFacultyData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users", {
        params: {
          search,
          role: "prof", // Only fetch professors
          page,
          per_page: 10,
        },
      });

      const data = res.data;
      setFacultyList(data.data || []);
      setLastPage(data.last_page || 1);
      setFrom(data.from || 0);
      setTo(data.to || 0);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching faculty:", err);
      toast.error("Failed to load faculty data.");
    } finally {
      setLoading(false);
    }
  };

  // State for academic year and semester filters
  const [academicYear, setAcademicYear] = useState('2526');
  const [semester, setSemester] = useState('First');

  // Fetch faculty loads for a specific faculty
  const fetchFacultyLoads = async (facultyId) => {
    setLoadingLoads(true);
    try {
      console.log('Fetching faculty loads...', {
        faculty_id: facultyId,
        academic_year: academicYear,
        semester: semester
      });

      const res = await api.get(`/faculty-loads/${facultyId}`, {
        params: {
          academic_year: academicYear,
          semester: semester
        }
      });
      
      console.log('Faculty loads response:', res.data);
      setFacultyLoads(res.data || []);
      console.log(`✅ Loaded ${res.data?.length || 0} subjects for faculty ID: ${facultyId}`);
    } catch (err) {
      console.error("❌ Error fetching faculty loads:", err);
      console.error("Error details:", err.response?.data);
      toast.error("Failed to load faculty subjects.");
      setFacultyLoads([]);
    } finally {
      setLoadingLoads(false);
    }
  };

  // Listen to sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  // Effect to fetch data when search or page changes
  useEffect(() => {
    fetchFacultyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Refetch faculty loads when academic year or semester changes
  useEffect(() => {
    if (selectedFaculty && showModal) {
      fetchFacultyLoads(selectedFaculty.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academicYear, semester]);

  // Modal Functions
  const openModal = async (faculty) => {
    // Set faculty data
    setSelectedFaculty({
      id: faculty.id,
      name: faculty.fullname,
      code: faculty.id, // Using ID as code for now
      email: faculty.email,
      department: faculty.department,
      role: faculty.role,
      totalUnits: 0,
      totalHours: 0,
      subjects: []
    });
    
    // Fetch faculty loads
    await fetchFacultyLoads(faculty.id);
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFaculty(null);
    setFacultyLoads([]);
  };

  // Navigation function for Faculty Loading
  const navigateToFacultyLoading = (faculty) => {
    try {
      // Store faculty data in sessionStorage to pass to Faculty Loading page
      sessionStorage.setItem('selectedFaculty', JSON.stringify(faculty));
      console.log('Navigating to Faculty Loading with faculty:', faculty);
      navigate('/faculty-loading');
    } catch (error) {
      console.error('Error navigating to Faculty Loading:', error);
      toast.error('Error navigating to Faculty Loading page. Please try again.');
    }
  };

  return (
    <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">
              Faculty List
            </h1>
            <div className="text-sm text-gray-500">
              {loading ? "Loading..." : `${total} professors found`}
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none relative z-0"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider w-64">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#064F32]"></div>
                          Loading professors...
                        </div>
                      </td>
                    </tr>
                  ) : facultyList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                        No professors found
                      </td>
                    </tr>
                  ) : (
                    facultyList.map((faculty, index) => (
                      <tr key={faculty.id} className="hover:bg-[#F6F7FB]">
                        <td className="px-6 py-4 text-sm text-gray-700 text-medium text-center">
                          {from + index}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium text-center">
                          {faculty.fullname}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-center">
                          {faculty.department || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-center">
                          <div className="flex flex-col gap-2 w-52 mx-auto">
                            <button
                              onClick={() => openModal(faculty)}
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-[#064F32] text-white rounded-md hover:bg-[#053d27] transition-colors text-xs font-medium w-full"
                            >
                              <Eye className="w-4 h-4" />
                              View Load
                            </button>
                            <button
                              onClick={() => navigateToFacultyLoading(faculty)}
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-[#064F32] text-white rounded-md hover:bg-[#053d27] transition-colors text-xs font-medium w-full"
                            >
                              <Calendar className="w-4 h-4" />
                              Faculty Loading
                            </button>
                          </div>
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
                Showing {from}–{to} of {total} professors
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
          </div>
        </div>
      </div>

      {/* Faculty Load Details Modal */}
      {showModal && selectedFaculty && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-[#064F32]">Faculty Load Details</h2>
                <p className="text-gray-600 mt-1">
                  {selectedFaculty.name} (Code: {selectedFaculty.code})
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Academic Year and Semester Filters */}
              <div className="bg-[#064F32]/10 border border-[#064F32]/30 rounded-lg p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Academic Year:</label>
                    <select
                      value={academicYear}
                      onChange={(e) => {
                        const newYear = e.target.value;
                        setAcademicYear(newYear);
                        // Refetch will be triggered by the useEffect below
                      }}
                      className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                      <option value="2524">2524</option>
                      <option value="2525">2525</option>
                      <option value="2526">2526</option>
                      <option value="2527">2527</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Semester:</label>
                    <select
                      value={semester}
                      onChange={(e) => {
                        const newSemester = e.target.value;
                        setSemester(newSemester);
                        // Refetch will be triggered by the useEffect below
                      }}
                      className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                      <option value="First">First</option>
                      <option value="Second">Second</option>
                      <option value="Summer">Summer</option>
                    </select>
                  </div>
                  <div className="text-sm text-blue-700 ml-auto">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Viewing loads for <strong>{semester} Semester {academicYear}</strong>
                  </div>
                </div>
              </div>

              {/* Faculty Information */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-lg text-gray-900">{selectedFaculty.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Department</p>
                    <p className="text-lg text-gray-900">{selectedFaculty.department || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Faculty Load Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Subject Load Summary</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{facultyLoads.length}</div>
                    <div className="text-sm text-gray-500">Total Subjects</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {facultyLoads.reduce((sum, load) => sum + (load.units || 0), 0)} total units
                    </div>
                  </div>
                </div>
                
                {loadingLoads ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
                    <span className="text-gray-600">Loading faculty subjects...</span>
                  </div>
                ) : facultyLoads.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No subjects assigned to this faculty</p>
                    <p className="text-sm text-gray-500 mt-1">Subjects can be assigned in Faculty Loading</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {facultyLoads.map((load, index) => (
                      <div key={load.id || index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-3 hover:shadow-md transition-all hover:scale-[1.02]">
                        {/* Header: Code + Units */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-1 bg-green-600 text-white font-bold rounded text-xs">
                            {load.subject_code}
                          </span>
                          <div className="text-right">
                            <span className="text-xl font-bold text-green-600">{load.units}</span>
                            <span className="text-xs text-gray-500 ml-1">units</span>
                          </div>
                        </div>

                        {/* Subject Name */}
                        <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-1" title={load.subject_description}>
                          {load.subject_description}
                        </h4>

                        {/* Section & Type */}
                        <div className="flex items-center gap-2 mb-2 text-xs">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="w-3 h-3" />
                            <span className="font-medium">{load.section}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                            {load.type}
                          </span>
                        </div>

                        {/* Schedule */}
                        <div className="bg-white rounded p-2 border border-gray-200 mb-2">
                          <div className="flex items-start gap-1">
                            <Clock className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-700 font-medium leading-tight">
                              {load.schedule || 'No schedule'}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Row: Room + Hours */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-gray-600">
                            <BookOpen className="w-3 h-3" />
                            <span className="font-semibold">{load.room || 'TBA'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                              {load.lec_hours}h LEC
                            </span>
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">
                              {load.lab_hours}h LAB
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



