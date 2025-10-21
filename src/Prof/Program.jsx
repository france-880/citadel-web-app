import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useMemo, useState, Fragment } from "react";
import { useAuth } from "../Context/AuthContext";
import api from "../api/axios";

export default function Program() {
  const { user } = useAuth();
  const [program, setProgram] = useState(() => localStorage.getItem('selectedProgram') || 'BSIT-4A');
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
  const [facultyLoads, setFacultyLoads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState('2024');
  const [semester, setSemester] = useState('First');
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(() => {
    localStorage.setItem('selectedProgram', program);
  }, [program]);

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  // Fetch professor's faculty loads
  const fetchFacultyLoads = async () => {
    if (!user?.id || user?.role !== 'prof') return;
    
    setLoading(true);
    try {
      const response = await api.get(`/faculty-loads/${user.id}`, {
        params: {
          academic_year: academicYear,
          semester: semester
        }
      });
      
      setFacultyLoads(response.data || []);
      console.log(`Loaded ${response.data?.length || 0} subjects for professor ${user.fullname}`);
    } catch (error) {
      console.error('Error fetching faculty loads:', error);
      setFacultyLoads([]);
    } finally {
      setLoading(false);
    }
  };

  // Load academic year and semester from sessionStorage
  useEffect(() => {
    const storedAcademicYear = sessionStorage.getItem('currentAcademicYear');
    const storedSemester = sessionStorage.getItem('currentSemester');
    
    if (storedAcademicYear) {
      setAcademicYear(storedAcademicYear);
    }
    if (storedSemester) {
      setSemester(storedSemester);
    }
  }, []);

  // Fetch students for the selected section
  const fetchStudents = async () => {
    if (!program) return;
    
    setLoadingStudents(true);
    try {
      const response = await api.get('/students/by-section', {
        params: {
          section: program.replace('-', ' ')
        }
      });
      
      setStudents(response.data || []);
      console.log(`Loaded ${response.data?.length || 0} students for section ${program}`);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Fetch faculty loads when component mounts or when academic year/semester changes
  useEffect(() => {
    if (user?.role === 'prof') {
      fetchFacultyLoads();
    }
  }, [user?.id, academicYear, semester]);

  // Fetch students when program changes
  useEffect(() => {
    fetchStudents();
  }, [program]);

  // Handle marking attendance
  const handleMarkAttendance = (studentId, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Filter faculty loads for the selected program/section
  const filteredFacultyLoads = useMemo(() => {
    return facultyLoads.filter(load => 
      load.section && load.section.replace(/\s+/g, '-').toUpperCase() === program.replace(/\s+/g, '-').toUpperCase()
    );
  }, [facultyLoads, program]);

  const content = useMemo(() => {
    // Get the first subject code from faculty loads for this section
    const firstSubject = filteredFacultyLoads.length > 0 ? filteredFacultyLoads[0] : null;
    const subjectCode = firstSubject ? firstSubject.subject_code : 'No Subject Assigned';
    
    return { 
      title: program.replace('-', ' '), // BSIT4A as title
      subjectCode: subjectCode, // CS105 as subject code
      semester: semester,
      totalStudents: students.length,
      section: program.replace('-', ' ')
    };
  }, [program, filteredFacultyLoads, semester, students]);

  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-0'}`}>
        <Header />

      <main className="p-6 min-h-screen">
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-[#064F32] mb-2">{content.title}</h1>
                <p className="text-sm text-gray-600">{content.subjectCode} - {content.semester} Semester</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{content.totalStudents}</div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
            </div>
            {loading && (
              <div className="mt-2 text-sm text-blue-600">Loading data...</div>
            )}
          </div>

          <div className="space-y-4 md:space-y-6">

      {/* Attendance Summary */}
      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <div className="text-sm text-slate-500 mb-2">Attendance Summary</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(attendanceStatus).filter(status => status === 'Present').length}
            </div>
            <div className="text-xs text-gray-500">Present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {Object.values(attendanceStatus).filter(status => status === 'Absent').length}
            </div>
            <div className="text-xs text-gray-500">Absent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{students.length}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <div className="text-sm text-slate-500 mb-2">Student Attendance</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="bg-[var(--brand-100)] text-left">
                <th className="p-2">Student No.</th>
                <th className="p-2">Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingStudents ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    Loading students...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student, index) => {
                  const studentId = student.id;
                  const currentStatus = attendanceStatus[studentId] || 'Absent'; // Default to Absent
                  
                  return (
                    <tr key={studentId || index} className="border-t">
                      <td className="p-2">{student.studentNo}</td>
                      <td className="p-2">
                        <div>
                          <div className="font-semibold">{student.fullname}</div>
                          <div className="text-xs text-gray-600">{student.email}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          currentStatus === 'Present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleMarkAttendance(studentId, 'Present')}
                            className={`p-1 rounded transition-colors ${
                              currentStatus === 'Present'
                                ? 'text-green-800 bg-green-100'
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                            }`}
                            title="Mark Present"
                          >
                            ✓
                          </button>
                          <button 
                            onClick={() => handleMarkAttendance(studentId, 'Absent')}
                            className={`p-1 rounded transition-colors ${
                              currentStatus === 'Absent'
                                ? 'text-red-800 bg-red-100'
                                : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                            }`}
                            title="Mark Absent"
                          >
                            ✗
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No students found for {program.replace('-', ' ')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
        </div>
      </main>
    </div>
    </div>
  );
}

