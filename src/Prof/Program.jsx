import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useEffect, useMemo, useState, Fragment, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import api from "../api/axios";

export default function Program() {
  const { user } = useAuth();
  const [program, setProgram] = useState(() => localStorage.getItem('selectedProgram') || 'BSIT-4A');
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
  const [facultyLoads, setFacultyLoads] = useState(() => {
    // Try to load from localStorage on mount for persistence
    try {
      const stored = localStorage.getItem('profFacultyLoads');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState('2024');
  const [semester, setSemester] = useState('First');
  const [students, setStudents] = useState(() => {
    // Try to load from localStorage on mount for persistence
    try {
      const stored = localStorage.getItem('profStudents');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  
  // Track if we've already fetched to prevent clearing on user changes
  const hasFetchedRef = useRef(false);
  const prevUserIdRef = useRef(null);
  const prevAcademicYearRef = useRef(null);
  const prevSemesterRef = useRef(null);

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

  // Listen for program changes from localStorage (e.g., from sidebar)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'selectedProgram' && e.newValue && e.newValue !== program) {
        console.log('Program changed from localStorage:', e.newValue);
        setProgram(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also check on mount if program changed
    const storedProgram = localStorage.getItem('selectedProgram');
    if (storedProgram && storedProgram !== program) {
      setProgram(storedProgram);
    }
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [program]);

  // Fetch professor's faculty loads - defined as regular function to avoid dependency issues
  const fetchFacultyLoads = async () => {
    const currentUserId = user?.id;
    const currentRole = user?.role;
    const currentAcademicYear = academicYear;
    const currentSemester = semester;
    
    if (!currentUserId || currentRole !== 'prof') {
      console.log('Skipping fetch - user not ready:', { id: currentUserId, role: currentRole });
      return;
    }
    
    // Prevent clearing existing data while fetching
    setLoading(true);
    try {
      const response = await api.get(`/faculty-loads/${currentUserId}`, {
        params: {
          academic_year: currentAcademicYear,
          semester: currentSemester
        }
      });
      
      const loads = response.data || [];
      console.log(`Loaded ${loads.length} subjects for professor ${user?.fullname || 'Unknown'}`);
      // Debug: Log first load to see formatted_section
      if (loads.length > 0) {
        console.log('First faculty load sample:', loads[0]);
        console.log('Formatted section in first load:', loads[0].formatted_section);
        console.log('All formatted sections:', loads.map(l => ({ 
          formatted_section: l.formatted_section || 'N/A', 
          section: l.section || 'N/A',
          computed_section: l.computed_section || 'N/A'
        })));
      }
      
      // Always update with the response data (even if empty array)
      // Use functional update to ensure we're setting the latest data
      setFacultyLoads(() => {
        console.log('Setting faculty loads:', loads.length);
        // Also persist to localStorage
        try {
          localStorage.setItem('profFacultyLoads', JSON.stringify(loads));
        } catch (e) {
          console.warn('Failed to persist faculty loads:', e);
        }
        return loads;
      });
    } catch (error) {
      console.error('Error fetching faculty loads:', error);
      // Don't clear on auth errors - keep existing data
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Auth error - keeping existing data');
        // Don't update state - keep what we have
      } else {
        // For other errors, preserve existing data - don't clear
        console.log('Error occurred but preserving existing data');
        // Don't clear - keep existing data
      }
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

  // Filter faculty loads for the selected program/section - MUST be defined before fetchStudents
  const filteredFacultyLoads = useMemo(() => {
    if (!program || !facultyLoads || facultyLoads.length === 0) {
      console.log('No filteredFacultyLoads - program:', program, 'facultyLoads length:', facultyLoads?.length);
      return [];
    }
    
    const filtered = facultyLoads.filter(load => {
      // Try to match by formatted_section first (most accurate)
      if (load.formatted_section) {
        const formattedNormalized = load.formatted_section.replace(/\s+/g, '-').toUpperCase();
        const programNormalized = program.replace(/\s+/g, '-').toUpperCase();
        if (formattedNormalized.includes(programNormalized) || programNormalized.includes(formattedNormalized)) {
          console.log('Matched by formatted_section:', load.formatted_section);
          return true;
        }
      }
      
      // Try to match by computed_section or section from sectionOffering
      const loadSection = load.computed_section || load.section || load.sectionOffering?.parent_section || '';
      const programSection = program.replace(/\s+/g, '-').toUpperCase();
      const loadSectionNormalized = loadSection.replace(/\s+/g, '-').toUpperCase();
      
      const matches = loadSectionNormalized === programSection || 
             loadSectionNormalized.includes(programSection) ||
             programSection.includes(loadSectionNormalized);
      
      if (matches) {
        console.log('Matched by section:', loadSection, 'vs program:', program);
      }
      
      return matches;
    });
    
    console.log('Filtered faculty loads:', filtered.length, 'for program:', program);
    return filtered;
  }, [facultyLoads, program]);

  // Fetch students for the selected section based on faculty load
  const fetchStudents = async () => {
    if (!program || filteredFacultyLoads.length === 0) {
      setStudents([]);
      return;
    }
    
    // Get the first faculty load for this section to extract program and year_section info
    const firstLoad = filteredFacultyLoads[0];
    
    // Extract program_id, year_level, and section from faculty load
    // The backend includes sectionOffering data in the response when loaded
    let programId = null;
    let yearLevel = null;
    let section = null;
    
    console.log('First load data:', firstLoad);
    console.log('Formatted section from backend:', firstLoad.formatted_section);
    
    // Try to get from sectionOffering (most accurate if linked)
    // The backend includes sectionOffering data via ->with(['sectionOffering.program'])
    if (firstLoad.sectionOffering) {
      programId = firstLoad.sectionOffering.program_id || firstLoad.sectionOffering.program?.id;
      yearLevel = firstLoad.sectionOffering.year_level;
      section = firstLoad.sectionOffering.parent_section;
      
      // Remove suffixes from section (e.g., "C-WEST" -> "C")
      if (section) {
        section = section.replace(/\s*-\s*(West|North|East|South)$/i, '').trim();
      }
      
      // Convert year level to number if it's text (e.g., "Fourth Year" -> "4")
      if (yearLevel && !/^\d+$/.test(yearLevel.trim())) {
        const yearMap = {
          'first year': '1', 'first': '1', '1st year': '1', '1st': '1',
          'second year': '2', 'second': '2', '2nd year': '2', '2nd': '2',
          'third year': '3', 'third': '3', '3rd year': '3', '3rd': '3',
          'fourth year': '4', 'fourth': '4', '4th year': '4', '4th': '4',
          'fifth year': '5', 'fifth': '5', '5th year': '5', '5th': '5'
        };
        const yearLower = yearLevel.toLowerCase().trim();
        yearLevel = yearMap[yearLower] || yearLevel;
      }
      
      console.log('Using sectionOffering data:', { 
        programId, 
        yearLevel, 
        section,
        sectionOffering: firstLoad.sectionOffering,
        program: firstLoad.sectionOffering.program
      });
    } else {
      // Fallback: Parse from section string or use computed values
      // Section format might be like "BSIT-4A", "4A", or just "A"
      const sectionStr = firstLoad.computed_section || firstLoad.section || program;
      console.log('Parsing section string:', sectionStr);
      
      // Try different patterns to extract year and section
      // Pattern 1: "4A" -> year "4", section "A"
      let sectionMatch = sectionStr.match(/(\d+)([A-Z])/i);
      if (sectionMatch) {
        yearLevel = sectionMatch[1];
        section = sectionMatch[2];
      } else {
        // Pattern 2: "BSIT-4A" -> extract "4A" part
        const dashMatch = sectionStr.match(/(\d+)([A-Z])/i);
        if (dashMatch) {
          yearLevel = dashMatch[1];
          section = dashMatch[2];
        } else {
          // Pattern 3: Just section letter "A"
          const letterMatch = sectionStr.match(/([A-Z])$/i);
          if (letterMatch) {
            section = letterMatch[1];
          }
        }
      }
      
      // Try to extract program_id from program relationship if available
      if (firstLoad.sectionOffering?.program?.id) {
        programId = firstLoad.sectionOffering.program.id;
      }
      
      console.log('Fallback parsing result:', { programId, yearLevel, section });
    }
    
    setLoadingStudents(true);
    try {
      // Try multiple academic year/semester combinations to find all students
      const combinationsToTry = [
        [academicYear || '2024', semester || 'First'],
        ['2526', 'First'],
        ['2024', 'Second'],
        ['2526', 'Second'],
        ['2025', 'First'],
      ];

      // Remove duplicates from combinations
      const uniqueCombinations = Array.from(
        new Map(combinationsToTry.map(combo => [combo.join('-'), combo])).values()
      );

      let allStudents = [];
      
      // Try each combination in parallel
      const fetchPromises = uniqueCombinations.map(async (combo) => {
        try {
          const params = {
            academic_year: combo[0],
            semester: combo[1]
          };
          
          if (programId) {
            params.program_id = programId;
          }
          if (yearLevel) {
            params.year_level = yearLevel;
          }
          if (section) {
            params.section = section;
          }
          
          // If we don't have enough data, try to match by section name as fallback
          if (!programId && !yearLevel && !section) {
            // Fallback to old method using section name
            params.section = program.replace('-', ' ');
          }
          
          console.log('Fetching students with params:', params);
          const response = await api.get('/students/by-faculty-load', { params });
          
          const studentData = response.data || [];
          console.log(`Loaded ${studentData.length} students for combo ${combo[0]}/${combo[1]}:`, {
            programId,
            yearLevel,
            section,
            program
          });
          
          return studentData;
        } catch (error) {
          console.error(`Error fetching students for ${combo[0]}/${combo[1]}:`, error);
          return [];
        }
      });

      // Wait for all requests to complete
      const results = await Promise.allSettled(fetchPromises);
      
      // Collect all unique students (using Set to avoid duplicates by student ID)
      const studentMap = new Map();
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          result.value.forEach(student => {
            if (student.id && !studentMap.has(student.id)) {
              studentMap.set(student.id, student);
            }
          });
        }
      });
      
      allStudents = Array.from(studentMap.values());
      
      console.log(`Total unique students loaded: ${allStudents.length}`, {
        programId,
        yearLevel,
        section,
        program
      });
      
      // Update state and persist to localStorage
      setStudents(() => {
        try {
          localStorage.setItem('profStudents', JSON.stringify(allStudents));
        } catch (e) {
          console.warn('Failed to persist students:', e);
        }
        return allStudents;
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      // Don't clear on auth errors - keep existing data
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Auth error - keeping existing students data');
        // Don't update state - keep what we have
      } else {
        // For other errors, preserve existing data - don't clear
        console.log('Error occurred but preserving existing students data');
        // Don't clear - keep existing data
      }
    } finally {
      setLoadingStudents(false);
    }
  };

  // Fetch faculty loads when component mounts or when dependencies change
  useEffect(() => {
    // Early return if user is not ready yet - don't clear data during loading
    if (!user) {
      console.log('User not loaded yet - keeping existing data');
      return;
    }

    // Only proceed if we have all required data
    if (!user.id || !user.role || !academicYear || !semester) {
      console.log('Waiting for user/academicYear/semester:', { 
        hasUserId: !!user.id, 
        hasRole: !!user.role, 
        academicYear, 
        semester 
      });
      return;
    }

    // Only fetch if user is a prof
    if (user.role === 'prof') {
      // Only fetch if something actually changed
      const userIdChanged = prevUserIdRef.current !== user.id;
      const academicYearChanged = prevAcademicYearRef.current !== academicYear;
      const semesterChanged = prevSemesterRef.current !== semester;
      const shouldFetch = userIdChanged || academicYearChanged || semesterChanged || !hasFetchedRef.current;
      
      if (shouldFetch) {
        console.log('Fetching faculty loads with:', { 
          userId: user.id, 
          academicYear, 
          semester,
          userIdChanged,
          academicYearChanged,
          semesterChanged,
          hasFetched: hasFetchedRef.current
        });
        
        fetchFacultyLoads();
        hasFetchedRef.current = true;
        
        // Update refs IMMEDIATELY to prevent duplicate fetches
        prevUserIdRef.current = user.id;
        prevAcademicYearRef.current = academicYear;
        prevSemesterRef.current = semester;
      } else {
        console.log('Skipping fetch - no changes detected, keeping existing data');
        // Don't re-fetch if we already have data - just keep what we have
      }
    } else {
      // User is not a prof - clear data only if confirmed
      console.log('Clearing loads - user is not a prof:', user.role);
      if (hasFetchedRef.current) {
        setFacultyLoads([]);
        try {
          localStorage.removeItem('profFacultyLoads');
        } catch (e) {
          console.warn('Failed to clear localStorage:', e);
        }
        hasFetchedRef.current = false;
        prevUserIdRef.current = null;
      }
    }
    // Removed fetchFacultyLoads from deps - it's now a regular function that uses current closure values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role, academicYear, semester]);

  // Fetch students when program or filteredFacultyLoads change
  useEffect(() => {
    if (program && filteredFacultyLoads && filteredFacultyLoads.length > 0) {
      console.log('Fetching students - filteredFacultyLoads available:', filteredFacultyLoads.length);
      // Clear localStorage cache to ensure fresh data
      try {
        localStorage.removeItem('profStudents');
      } catch (e) {
        console.warn('Failed to clear localStorage:', e);
      }
      fetchStudents();
    } else {
      console.log('Not fetching students - program:', program, 'filteredFacultyLoads length:', filteredFacultyLoads?.length);
      // Don't clear students immediately - might be temporary loading state
      if (!program) {
        setStudents([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, filteredFacultyLoads, academicYear, semester]);

  // Handle marking attendance
  const handleMarkAttendance = (studentId, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  };


  const content = useMemo(() => {
    // Get the first subject code from faculty loads for this section
    const firstSubject = filteredFacultyLoads && filteredFacultyLoads.length > 0 ? filteredFacultyLoads[0] : null;
    const subjectCode = firstSubject ? (firstSubject.computed_subject_code || firstSubject.subject_code || 'No Subject Assigned') : 'No Subject Assigned';
    
    // Debug: Log what we're getting
    console.log('Content useMemo - filteredFacultyLoads length:', filteredFacultyLoads?.length);
    console.log('Content useMemo - firstSubject:', firstSubject);
    console.log('Content useMemo - formatted_section:', firstSubject?.formatted_section);
    console.log('Content useMemo - sectionOffering:', firstSubject?.sectionOffering);
    console.log('Content useMemo - program:', program);
    
    // Use formatted_section from backend (e.g., "BSIT 1A") or fallback to program
    let formattedTitle = program ? program.replace('-', ' ') : 'No Section Selected';
    
    if (firstSubject?.formatted_section) {
      // Remove suffixes like "West", "North", etc. from formatted_section
      formattedTitle = firstSubject.formatted_section.replace(/\s*-\s*(West|North|East|South)$/i, '').trim();
      console.log('✅ Using formatted_section from backend:', formattedTitle);
    } else if (firstSubject?.sectionOffering) {
      // Fallback: construct from sectionOffering data
      const so = firstSubject.sectionOffering;
      const programName = so.program?.program_code || so.program?.program_name || '';
      const yearLevel = so.year_level || '';
      const section = so.parent_section || '';
      
      // Convert year level to number
      let yearLevelNum = '';
      if (yearLevel) {
        if (/^\d+$/.test(yearLevel.trim())) {
          yearLevelNum = yearLevel.trim();
        } else {
          const yearMap = {
            'first year': '1', 'first': '1', '1st year': '1', '1st': '1',
            'second year': '2', 'second': '2', '2nd year': '2', '2nd': '2',
            'third year': '3', 'third': '3', '3rd year': '3', '3rd': '3',
            'fourth year': '4', 'fourth': '4', '4th year': '4', '4th': '4',
            'fifth year': '5', 'fifth': '5', '5th year': '5', '5th': '5'
          };
          const yearLower = yearLevel.toLowerCase().trim();
          yearLevelNum = yearMap[yearLower] || yearLevel;
        }
      }
      
      if (programName && yearLevelNum && section) {
        formattedTitle = `${programName} ${yearLevelNum}${section}`.toUpperCase();
        console.log('Constructed title from sectionOffering:', formattedTitle);
      }
    }
    
    const result = { 
      title: formattedTitle, // e.g., "BSIT 1A"
      subjectCode: subjectCode, // CS105 as subject code
      semester: semester || 'First', // Ensure semester is always set
      totalStudents: students.length,
      section: formattedTitle
    };
    
    console.log('Content useMemo result:', result);
    return result;
  }, [program, filteredFacultyLoads, semester, students]);

  return (
    <div className={`flex content_padding ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />

      <main className="p-6 min-h-screen">
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-[#064F32] mb-2">
                  {content?.title || program?.replace('-', ' ') || 'No Section Selected'}
                </h1>
                <p className="text-sm text-gray-600">
                  {content?.subjectCode || 'No Subject Assigned'} - {content?.semester || semester || 'First'} Semester
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{content?.totalStudents || students.length || 0}</div>
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
                    No students found for {content.title}
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

