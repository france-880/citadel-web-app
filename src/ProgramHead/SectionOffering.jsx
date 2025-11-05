import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  X,
  Save,
  FileText,
  User
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const FacultyLoading = () => {
  const [course, setCourse] = useState('');
  const [academicYear, setAcademicYear] = useState('2526');
  const [semester, setSemester] = useState('First');
  const [yearLevel, setYearLevel] = useState('First Year');
  const [parentSection, setParentSection] = useState('A-NORTH');
  const [facultyName, setFacultyName] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  
  // Program subjects states
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [programSubjects, setProgramSubjects] = useState([]);
  
  // Edit subject modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editForm, setEditForm] = useState({
    lec_hours: 0,
    lab_hours: 0,
    units: 0,
    slots: 0,
    schedules: []
  });

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  // Faculty Loads State
  const [facultyLoads, setFacultyLoads] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Subject Selection State
  const [selectedSubject, setSelectedSubject] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  
  // Programs State - from AcademicManagement
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  
  // Add Subject Modal State
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [addSubjectForm, setAddSubjectForm] = useState({
    subjectCode: '',
    subjectDescription: '',
    lecHours: 0,
    labHours: 0,
    units: 0,
    section: '',
    schedule: '',
    room: '',
    type: 'Part-time'
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Subject');
  const [subjectForm, setSubjectForm] = useState({
    subjectCode: '',
    subjectDescription: '',
    lecHours: 0,
    labHours: 0,
    units: 0,
    section: '',
    schedule: '',
    room: '',
    type: 'Part-time'
  });

  // Function to fetch programs from AcademicManagement API
  const fetchPrograms = async () => {
    try {
      setIsLoadingPrograms(true);
      console.log('Fetching programs from AcademicManagement API...');
      const response = await api.get('/programs');
      console.log('Programs API response:', response.data);
      
      // Check if response has success property and data
      if (response.data.success && Array.isArray(response.data.data)) {
        const transformedPrograms = response.data.data.map(program => ({
          id: program.id,
          name: program.program_name,
          code: program.program_code,
          college_id: program.college_id,
          college_name: program.college?.college_name || 'Unknown'
        }));
        setAvailablePrograms(transformedPrograms);
        console.log('Successfully fetched programs:', transformedPrograms);
      } else if (Array.isArray(response.data)) {
        // Fallback if response.data is directly an array
        const transformedPrograms = response.data.map(program => ({
          id: program.id,
          name: program.program_name,
          code: program.program_code,
          college_id: program.college_id,
          college_name: program.college?.college_name || 'Unknown'
        }));
        setAvailablePrograms(transformedPrograms);
        console.log('Successfully fetched programs:', transformedPrograms);
      } else {
        console.error('Invalid programs response format:', response.data);
        toast.error('Invalid programs data format received');
        setAvailablePrograms([]);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error(`Failed to load programs: ${error.response?.data?.message || error.message}`);
      setAvailablePrograms([]);
    } finally {
      setIsLoadingPrograms(false);
    }
  };

  // Function to fetch subjects from AcademicManagement API (view-only)
  const fetchSubjects = async () => {
    try {
      setIsLoadingSubjects(true);
      console.log('Fetching subjects from AcademicManagement API...');
      const response = await api.get('/subjects');
      console.log('Subjects API response:', response.data);
      
      // Check if response has success property and data
      if (response.data.success && Array.isArray(response.data.data)) {
        const transformedSubjects = response.data.data.map(subject => ({
          id: subject.id,
          name: subject.subject_name,
          code: subject.subject_code,
          units: subject.units || 3,
          semester: subject.semester || '',
          yearLevel: subject.year_level || '',
          type: subject.subject_type || 'Major'
        }));
        setAvailableSubjects(transformedSubjects);
        console.log('Successfully fetched subjects for viewing:', transformedSubjects);
      } else if (Array.isArray(response.data)) {
        // Fallback if response.data is directly an array
        const transformedSubjects = response.data.map(subject => ({
          id: subject.id,
          name: subject.subject_name,
          code: subject.subject_code,
          units: subject.units || 3,
          semester: subject.semester || '',
          yearLevel: subject.year_level || '',
          type: subject.subject_type || 'Major'
        }));
        setAvailableSubjects(transformedSubjects);
        console.log('Successfully fetched subjects for viewing:', transformedSubjects);
      } else {
        console.error('Invalid subjects response format:', response.data);
        toast.error('Invalid subjects data format received');
        setAvailableSubjects([]);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        toast.error('Authentication required. Please log in again.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. You do not have permission to view subjects.');
      } else if (error.response?.status === 404) {
        toast.error('Subjects API endpoint not found.');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(`Failed to load subjects: ${error.response?.data?.message || error.message}`);
      }
      
      // Set empty array on error
      setAvailableSubjects([]);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  // Function to fetch faculty subjects from API
  const fetchFacultySubjects = async (faculty) => {
    if (!faculty?.id) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/faculty-loads/${faculty.id}`, {
        params: {
          academic_year: academicYear,
          semester: semester
        }
      });
      
      setFacultyLoads(response.data || []);
      console.log(`Loaded ${response.data?.length || 0} subjects for ${faculty.fullname} (ID: ${faculty.id})`);
    } catch (error) {
      console.error('Error fetching faculty subjects:', error);
      toast.error('Failed to load faculty subjects');
      setFacultyLoads([]);
    } finally {
      setLoading(false);
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

  // Initialize academic year and semester from sessionStorage on component mount
  useEffect(() => {
    const storedAcademicYear = sessionStorage.getItem('currentAcademicYear');
    const storedSemester = sessionStorage.getItem('currentSemester');
    
    if (storedAcademicYear) {
      setAcademicYear(storedAcademicYear);
      console.log('Loaded academic year from sessionStorage:', storedAcademicYear);
    }
    
    if (storedSemester) {
      setSemester(storedSemester);
      console.log('Loaded semester from sessionStorage:', storedSemester);
    }
  }, []);

  // Fetch selected faculty from sessionStorage and subjects from API on component mount
  useEffect(() => {
    const fetchSelectedFaculty = async () => {
      try {
        const storedFaculty = sessionStorage.getItem('selectedFaculty');
        if (storedFaculty) {
          const facultyData = JSON.parse(storedFaculty);
          setSelectedFaculty(facultyData);
          // Update faculty name display
          setFacultyName(`${facultyData.fullname} (ID: ${facultyData.id})`);
          console.log('Loaded faculty from sessionStorage:', facultyData);
          
          // Fetch subjects for this faculty
          await fetchFacultySubjects(facultyData);
        } else {
          console.log('No faculty data found in sessionStorage');
        }
      } catch (error) {
        console.error('Error parsing faculty data from sessionStorage:', error);
        toast.error('Error loading faculty data');
      }
    };

    // Fetch programs, subjects from API and faculty data
    console.log('Component mounted, fetching programs and subjects...');
    fetchPrograms();
    fetchSubjects();
    fetchSelectedFaculty();
  }, []);

  // Refresh faculty subjects when academic year or semester changes
  useEffect(() => {
    if (selectedFaculty) {
      fetchFacultySubjects(selectedFaculty);
    }
  }, [academicYear, semester]);

  // Automatically load program subjects when all required fields are filled
  useEffect(() => {
    if (selectedProgramId && academicYear && semester && yearLevel && parentSection) {
      console.log('Auto-loading program subjects...');
      handleLoadProgramSubjects();
    } else {
      // Clear subjects if any required field is missing
      setProgramSubjects([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProgramId, academicYear, semester, yearLevel, parentSection]);

  // Generate time slots for timetable - grouped by 3 consecutive slots
  const generateTimeSlots = () => {
    const groupedSlots = [];
    let groupIndex = 0;
    
    for (let hour = 7; hour <= 21; hour++) {
      // Skip 9:30 PM slot
      if (hour === 21) {
        continue;
      }
      
      // Create three consecutive times for each hour
      const time1 = `${hour.toString().padStart(2, '0')}:00`;
      const time2 = `${hour.toString().padStart(2, '0')}:30`;
      const time3 = `${hour.toString().padStart(2, '0')}:59`;
      
      // Create display times
      const display1 = hour > 12 
        ? `${(hour - 12).toString().padStart(2, '0')}:00 PM`
        : hour === 12
        ? `12:00 PM`
        : `${hour.toString().padStart(2, '0')}:00 AM`;
        
      const display2 = hour > 12 
        ? `${(hour - 12).toString().padStart(2, '0')}:30 PM`
        : hour === 12
        ? `12:30 PM`
        : `${hour.toString().padStart(2, '0')}:30 AM`;
        
      const display3 = hour > 12 
        ? `${(hour - 12).toString().padStart(2, '0')}:59 PM`
        : hour === 12
        ? `12:59 PM`
        : `${hour.toString().padStart(2, '0')}:59 AM`;
      
      groupedSlots.push({
        startTime: time1,
        middleTime: time2,
        endTime: time3,
        startDisplay: display1,
        middleDisplay: display2,
        endDisplay: display3,
        groupIndex: groupIndex++
      });
    }
    
    console.log('Generated grouped time slots:', groupedSlots.slice(0, 5)); // Debug log
    return groupedSlots;
  };

  // Helper function to convert time string to comparable format
  const parseTime = (timeString) => {
    const [time, period] = timeString.split(' ');
    const [hour, minute] = time.split(':');
    let hour24 = parseInt(hour);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return hour24 * 60 + parseInt(minute);
  };

  // Helper function to get day abbreviation
  const getDayAbbreviation = (dayName) => {
    const dayMap = {
      'Monday': 'MON',
      'Tuesday': 'TUE', 
      'Wednesday': 'WED',
      'Thursday': 'THU',
      'Friday': 'FRI',
      'Saturday': 'SAT',
    };
    return dayMap[dayName] || dayName;
  };

  // Helper function to check if a time slot group should show a schedule
  const getScheduleForTimeSlot = (day, timeSlotGroup) => {
    // Check if any of the three times in the group match
    const startSlotTime = parseTime(timeSlotGroup.startDisplay);
    const middleSlotTime = parseTime(timeSlotGroup.middleDisplay);
    const endSlotTime = parseTime(timeSlotGroup.endDisplay);
    
    // Simple debug logging
    console.log(`Checking ${day} at group ${timeSlotGroup.groupIndex} (${timeSlotGroup.startDisplay}, ${timeSlotGroup.middleDisplay}, ${timeSlotGroup.endDisplay}) - Faculty loads:`, facultyLoads.length);

    // Check faculty loads
    const facultyLoad = facultyLoads.find(load => {
      if (!load.schedule) {
        console.log(`No schedule for ${load.subject_code}`);
        return false;
      }
      
      console.log(`Checking ${load.subject_code}: "${load.schedule}"`);
      
      // Enhanced day matching for new formats
      const schedule = load.schedule.toUpperCase();
      const dayUpper = day.toUpperCase();
      
      // Check if the day is mentioned in the schedule
      const dayMatches = 
        // Single day format: MONDAY, TUESDAY, etc.
        schedule.includes(dayUpper) ||
        // Two day format: MON & TUE
        (dayUpper.includes('MON') && schedule.includes('MON & TUE')) ||
        (dayUpper.includes('TUE') && schedule.includes('MON & TUE')) ||
        (dayUpper.includes('WED') && schedule.includes('WED & THU')) ||
        (dayUpper.includes('THU') && schedule.includes('WED & THU')) ||
        (dayUpper.includes('FRI') && schedule.includes('FRI & SAT')) ||
        (dayUpper.includes('SAT') && schedule.includes('FRI & SAT')) ||
        // Three or more day format: M/W/F, T/TH, etc.
        (dayUpper.includes('MON') && schedule.includes('M/W/F')) ||
        (dayUpper.includes('WED') && schedule.includes('M/W/F')) ||
        (dayUpper.includes('FRI') && schedule.includes('M/W/F')) ||
        (dayUpper.includes('TUE') && schedule.includes('T/TH')) ||
        (dayUpper.includes('THU') && schedule.includes('T/TH')) ||
        // Additional common patterns
        (dayUpper.includes('MON') && schedule.includes('M/T/W/TH/F')) ||
        (dayUpper.includes('TUE') && schedule.includes('M/T/W/TH/F')) ||
        (dayUpper.includes('WED') && schedule.includes('M/T/W/TH/F')) ||
        (dayUpper.includes('THU') && schedule.includes('M/T/W/TH/F')) ||
        (dayUpper.includes('FRI') && schedule.includes('M/T/W/TH/F'));
      
      console.log(`Day match for ${load.subject_code}: ${dayMatches}`);
      
      if (!dayMatches) return false;
      
      // Enhanced time parsing - handle both AM/PM indicators
      const timeMatch = schedule.match(/(\d{1,2}):?(\d{2})?(AM|PM)\s*-\s*(\d{1,2}):?(\d{2})?(AM|PM)/i);
      
      if (timeMatch) {
        const startHour = parseInt(timeMatch[1]);
        const startMin = parseInt(timeMatch[2] || '0');
        const startPeriod = timeMatch[3].toUpperCase();
        const endHour = parseInt(timeMatch[4]);
        let endMin = parseInt(timeMatch[5] || '0');
        const endPeriod = timeMatch[6].toUpperCase();
        
        // Convert to 24-hour format for start time
        let startTime24 = startHour;
        if (startPeriod === 'PM' && startHour !== 12) startTime24 += 12;
        if (startPeriod === 'AM' && startHour === 12) startTime24 = 0;
        
        // Convert to 24-hour format for end time
        let endTime24 = endHour;
        if (endPeriod === 'PM' && endHour !== 12) endTime24 += 12;
        if (endPeriod === 'AM' && endHour === 12) endTime24 = 0;
        
        // Adjust end time to end at :59 instead of :00 of next hour
        // e.g., 9:00AM-12:00PM becomes 9:00AM-11:59AM
        if (endMin === 0) {
          endTime24 = endTime24 - 1; // Go back one hour
          endMin = 59; // Set to 59 minutes
        }
        
        const startMinutes = startTime24 * 60 + startMin;
        const endMinutes = endTime24 * 60 + endMin;
        
        console.log(`Time range: ${startMinutes}-${endMinutes}`);
        console.log(`Parsed: ${startHour}:${startMin.toString().padStart(2, '0')}${startPeriod} - ${endHour}:${endMin.toString().padStart(2, '0')}${endPeriod}`);
        console.log(`Duration: ${endMinutes - startMinutes} minutes, Slots: ${Math.ceil((endMinutes - startMinutes) / 30)}`);
        
        // Check if any of the three slot times in the group are in range
        const isInRange = (startSlotTime >= startMinutes && startSlotTime <= endMinutes) ||
                         (middleSlotTime >= startMinutes && middleSlotTime <= endMinutes) ||
                         (endSlotTime >= startMinutes && endSlotTime <= endMinutes);
        
        console.log(`Slot times: ${startSlotTime}, ${middleSlotTime}, ${endSlotTime}`);
        console.log(`In range: ${isInRange}`);
        
        return isInRange;
      }
      
      console.log(`No time match found for ${load.subject_code}`);
      return false;
    });

    if (facultyLoad) {
      console.log(`Found match: ${facultyLoad.subject_code}`);
      
      // Parse time for display with new format
      const schedule = facultyLoad.schedule.toUpperCase();
      const timeMatch = schedule.match(/(\d{1,2}):?(\d{2})?(AM|PM)\s*-\s*(\d{1,2}):?(\d{2})?(AM|PM)/i);
      
      // Determine which slot in the group should be the main display
      let mainSlotTime = middleSlotTime; // Default to middle slot
      let isStartTime = false;
      
      if (timeMatch) {
        const startHour = parseInt(timeMatch[1]);
        const startMin = parseInt(timeMatch[2] || '0');
        const startPeriod = timeMatch[3].toUpperCase();
        const endHour = parseInt(timeMatch[4]);
        let endMin = parseInt(timeMatch[5] || '0');
        const endPeriod = timeMatch[6].toUpperCase();
        
        // Adjust end time for display (same logic as parsing)
        let displayEndHour = endHour;
        let displayEndMin = endMin;
        if (endMin === 0) {
          displayEndHour = endHour - 1;
          displayEndMin = 59;
        }
        
        let startTime24 = startHour;
        if (startPeriod === 'PM' && startHour !== 12) startTime24 += 12;
        if (startPeriod === 'AM' && startHour === 12) startTime24 = 0;
        
        const classStartMinutes = startTime24 * 60 + startMin;
        
        // If the class starts at the beginning of this group, use start slot
        if (classStartMinutes === startSlotTime) {
          mainSlotTime = startSlotTime;
          isStartTime = true;
        } else if (classStartMinutes === middleSlotTime) {
          mainSlotTime = middleSlotTime;
          isStartTime = true;
        } else if (classStartMinutes === endSlotTime) {
          mainSlotTime = endSlotTime;
          isStartTime = true;
        }
        
        // Create adjusted display time range
        const adjustedEndPeriod = displayEndHour > 12 ? 'PM' : displayEndHour === 12 ? 'PM' : 'AM';
        const displayEndHour12 = displayEndHour > 12 ? displayEndHour - 12 : displayEndHour === 0 ? 12 : displayEndHour;
        
        const adjustedTimeRange = `${startHour}:${startMin.toString().padStart(2, '0')}${startPeriod}-${displayEndHour12}:${displayEndMin.toString().padStart(2, '0')}${adjustedEndPeriod}`;
        
        return {
          type: 'class',
          title: facultyLoad.subject_code || 'Subject',
          room: facultyLoad.room || 'TBA',
          color: 'bg-green-500',
          isStartTime: isStartTime,
          fullTimeRange: adjustedTimeRange,
          subjectDescription: facultyLoad.subject_description || '',
          section: facultyLoad.section || '',
          lecHours: facultyLoad.lec_hours || 0,
          labHours: facultyLoad.lab_hours || 0,
          units: facultyLoad.units || 0,
          // Group information
          startTime: timeSlotGroup.startDisplay,
          middleTime: timeSlotGroup.middleDisplay,
          endTime: timeSlotGroup.endDisplay,
          mainSlotTime: mainSlotTime
        };
      }
    }

    return null;
  };


  const timeSlots = generateTimeSlots();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Button functionality handlers
  const handleSetAcademicYear = () => {
    // Store academic year and semester in sessionStorage for other components to access
    sessionStorage.setItem('currentAcademicYear', academicYear);
    sessionStorage.setItem('currentSemester', semester);
    
    console.log('Setting Academic Year:', academicYear, 'Semester:', semester);
    console.log('Stored in sessionStorage:', {
      currentAcademicYear: sessionStorage.getItem('currentAcademicYear'),
      currentSemester: sessionStorage.getItem('currentSemester')
    });
    
    toast.success(`Academic Year ${academicYear} and ${semester} semester has been set successfully!`);
    
    // Refresh faculty subjects with new academic year/semester
    if (selectedFaculty) {
      fetchFacultySubjects(selectedFaculty);
    }
  };


  const handleEditSubject = (subject) => {
    console.log('Editing subject:', subject);
    
    // Set the form data to the subject being edited - map database fields to form fields
    setSubjectForm({
      id: subject.id,
      subjectCode: subject.subject_code,
      subjectDescription: subject.subject_description,
      lecHours: subject.lec_hours,
      labHours: subject.lab_hours,
      units: subject.units,
      section: subject.section,
      schedule: subject.schedule,
      room: subject.room,
      type: subject.type
    });
    
    // Set modal title and show modal
    setModalTitle('Edit Subject');
    setShowModal(true);
  };

  const handlePrintForm = () => {
    console.log('Printing Faculty Assignment Form');
    
    // Create a print-friendly version of the data
    const printData = {
      faculty: facultyName,
      academicYear: academicYear,
      semester: semester,
      facultyLoads: facultyLoads
    };
    
    console.log('Print data:', printData);
    
    // Create HTML content for printing - PDF Style
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Faculty Assignment Form - ${facultyName}</title>
          <style>
            @page {
              size: A4;
              margin: 0.5in;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              margin: 0;
              padding: 0;
              color: #000;
              background: white;
              line-height: 1.2;
            }
            
            .document {
              width: 100%;
              max-width: 8.5in;
              margin: 0 auto;
              background: white;
              position: relative;
            }
            
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 72px;
              color: rgba(0, 0, 0, 0.1);
              z-index: -1;
              font-weight: bold;
              white-space: nowrap;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #000;
              padding-bottom: 15px;
            }
            
            .university-name {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
              text-transform: uppercase;
            }
            
            .university-address {
              font-size: 12px;
              margin-bottom: 20px;
            }
            
            .form-title {
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            
            .faculty-info {
              margin-bottom: 25px;
              border: 2px solid #000;
              padding: 15px;
            }
            
            .info-row {
              display: flex;
              margin-bottom: 8px;
              font-size: 14px;
            }
            
            .info-label {
              font-weight: bold;
              width: 150px;
              text-transform: uppercase;
            }
            
            .info-value {
              flex: 1;
              border-bottom: 1px solid #000;
              padding-bottom: 2px;
              margin-left: 10px;
            }
            
            .subjects-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 12px;
            }
            
            .subjects-table th {
              background-color: #f0f0f0;
              border: 2px solid #000;
              padding: 8px;
              text-align: center;
              font-weight: bold;
              text-transform: uppercase;
            }
            
            .subjects-table td {
              border: 1px solid #000;
              padding: 6px;
              text-align: left;
            }
            
            .subjects-table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            
            .total-row {
              font-weight: bold;
              background-color: #e0e0e0 !important;
            }
            
            .signature-section {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            
            .signature-box {
              width: 200px;
              text-align: center;
            }
            
            .signature-line {
              border-bottom: 1px solid #000;
              height: 40px;
              margin-bottom: 5px;
            }
            
            .signature-label {
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 10px;
              border-top: 1px solid #000;
              padding-top: 10px;
            }
            
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              .document { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="document">
            <div class="watermark">UNIVERSITY OF THE CORDILLERAS</div>
            
            <div class="header">
              <div class="university-name">UNIVERSITY OF THE CORDILLERAS</div>
              <div class="university-address">GOV. PACK RD., BAGUIO CITY, PHILIPPINES</div>
              <div class="form-title">Faculty Assignment Form</div>
            </div>
            
            <div class="faculty-info">
              <div class="info-row">
                <div class="info-label">FACULTY NAME:</div>
                <div class="info-value">${facultyName || '_________________________'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">ACADEMIC YEAR:</div>
                <div class="info-value">${academicYear}</div>
              </div>
              <div class="info-row">
                <div class="info-label">SEMESTER:</div>
                <div class="info-value">${semester}</div>
              </div>
              <div class="info-row">
                <div class="info-label">DATE:</div>
                <div class="info-value">${new Date().toLocaleDateString()}</div>
              </div>
              <div class="info-row">
                <div class="info-label">TOTAL SUBJECTS:</div>
                <div class="info-value">${facultyLoads.length}</div>
              </div>
            </div>
            
            <table class="subjects-table">
              <thead>
                <tr>
                  <th style="width: 12%;">SUBJECT CODE</th>
                  <th style="width: 25%;">DESCRIPTION</th>
                  <th style="width: 8%;">LEC</th>
                  <th style="width: 8%;">LAB</th>
                  <th style="width: 8%;">UNITS</th>
                  <th style="width: 15%;">YEAR & SECTION</th>
                  <th style="width: 15%;">SCHEDULE</th>
                  <th style="width: 9%;">TYPE</th>
                </tr>
              </thead>
              <tbody>
                ${facultyLoads.length > 0 ? facultyLoads.map(load => `
                  <tr>
                    <td>${load.subject_code || ''}</td>
                    <td>${load.subject_description || ''}</td>
                    <td style="text-align: center;">${load.lec_hours || 0}</td>
                    <td style="text-align: center;">${load.lab_hours || 0}</td>
                    <td style="text-align: center;">${load.units || 0}</td>
                    <td>${load.section || ''}</td>
                    <td>${load.schedule || ''}</td>
                    <td>${load.type || ''}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="8" style="text-align: center; font-style: italic;">No subjects assigned</td>
                  </tr>
                `}
                <tr class="total-row">
                  <td colspan="4" style="text-align: right; font-weight: bold;">TOTAL UNITS:</td>
                  <td style="text-align: center; font-weight: bold;">${facultyLoads.reduce((sum, load) => sum + (parseInt(load.units) || 0), 0)}</td>
                  <td colspan="3"></td>
                </tr>
              </tbody>
            </table>
            
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Program Head Signature</div>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Dean Signature</div>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Faculty Signature</div>
              </div>
            </div>
            
            <div class="footer">
              <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>Faculty Loading System - University of the Cordilleras</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Create PDF content using HTML to PDF conversion
    const pdfContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Faculty Assignment Form - ${facultyName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #525659;
              color: #333;
              overflow: hidden;
            }
            
            .pdf-viewer {
              display: flex;
              flex-direction: column;
              height: 100vh;
            }
            
            .pdf-toolbar {
              background: #323639;
              border-bottom: 1px solid #5f6368;
              padding: 8px 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              color: white;
              font-size: 14px;
            }
            x
            .toolbar-left {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            
            .toolbar-right {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            
            .toolbar-button {
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 14px;
              display: flex;
              align-items: center;
              gap: 6px;
              transition: background-color 0.2s;
            }
            
            .toolbar-button:hover {
              background: rgba(255, 255, 255, 0.1);
            }
            
            .page-info {
              font-size: 14px;
              color: #e8eaed;
            }
            
            .zoom-controls {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .zoom-button {
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 16px;
            }
            
            .zoom-button:hover {
              background: rgba(255, 255, 255, 0.1);
            }
            
            .zoom-level {
              font-size: 14px;
              color: #e8eaed;
              min-width: 60px;
              text-align: center;
            }
            
            .pdf-content {
              flex: 1;
              overflow: auto;
              background: #525659;
              padding: 20px;
              display: flex;
              justify-content: center;
            }
            
            .document-page {
              background: white;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
              width: 210mm;
              min-height: 297mm;
              padding: 25mm;
              position: relative;
              transform-origin: top center;
              transition: transform 0.2s ease;
            }
            
            @media print {
              body { background: white; }
              .pdf-toolbar { display: none; }
              .pdf-content { padding: 0; background: white; }
              .document-page { box-shadow: none; }
            }
            
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 72px;
              color: rgba(0, 0, 0, 0.1);
              z-index: -1;
              font-weight: bold;
              white-space: nowrap;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #000;
              padding-bottom: 15px;
            }
            
            .university-name {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
              text-transform: uppercase;
              font-family: 'Times New Roman', serif;
            }
            
            .university-address {
              font-size: 12px;
              margin-bottom: 20px;
              font-family: 'Times New Roman', serif;
            }
            
            .form-title {
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0;
              text-transform: uppercase;
              letter-spacing: 2px;
              font-family: 'Times New Roman', serif;
            }
            
            .faculty-info {
              margin-bottom: 25px;
              border: 2px solid #000;
              padding: 15px;
            }
            
            .info-row {
              display: flex;
              margin-bottom: 8px;
              font-size: 14px;
              font-family: 'Times New Roman', serif;
            }
            
            .info-label {
              font-weight: bold;
              width: 150px;
              text-transform: uppercase;
            }
            
            .info-value {
              flex: 1;
              border-bottom: 1px solid #000;
              padding-bottom: 2px;
              margin-left: 10px;
            }
            
            .subjects-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 12px;
              font-family: 'Times New Roman', serif;
            }
            
            .subjects-table th {
              background-color: #f0f0f0;
              border: 2px solid #000;
              padding: 8px;
              text-align: center;
              font-weight: bold;
              text-transform: uppercase;
            }
            
            .subjects-table td {
              border: 1px solid #000;
              padding: 6px;
              text-align: left;
            }
            
            .subjects-table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            
            .total-row {
              font-weight: bold;
              background-color: #e0e0e0 !important;
            }
            
            .signature-section {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            
            .signature-box {
              width: 200px;
              text-align: center;
            }
            
            .signature-line {
              border-bottom: 1px solid #000;
              height: 40px;
              margin-bottom: 5px;
            }
            
            .signature-label {
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              font-family: 'Times New Roman', serif;
            }
            
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 10px;
              border-top: 1px solid #000;
              padding-top: 10px;
              font-family: 'Times New Roman', serif;
            }
          </style>
        </head>
        <body>
          <div class="pdf-viewer">
            <div class="pdf-toolbar">
              <div class="toolbar-left">
                <button class="toolbar-button" onclick="printDocument()">
                  🖨️ Print
                </button>
                <button class="toolbar-button" onclick="downloadDocument()">
                  💾 Download
                </button>
                <button class="toolbar-button" onclick="closeWindow()">
                  ❌ Close
                </button>
              </div>
              
              <div class="page-info">
                Page 1 of 1
              </div>
              
              <div class="toolbar-right">
                <div class="zoom-controls">
                  <button class="zoom-button" onclick="zoomOut()">−</button>
                  <span class="zoom-level" id="zoomLevel">100%</span>
                  <button class="zoom-button" onclick="zoomIn()">+</button>
                </div>
                <button class="toolbar-button" onclick="fitToWidth()">
                  📏 Fit to Width
                </button>
              </div>
            </div>
            
            <div class="pdf-content">
              <div class="document-page" id="documentPage">
                <div class="watermark">UNIVERSITY OF THE CORDILLERAS</div>
                
                <div class="header">
                  <div class="university-name">UNIVERSITY OF THE CORDILLERAS</div>
                  <div class="university-address">GOV. PACK RD., BAGUIO CITY, PHILIPPINES</div>
                  <div class="form-title">Faculty Assignment Form</div>
                </div>
                
                <div class="faculty-info">
                  <div class="info-row">
                    <div class="info-label">FACULTY NAME:</div>
                    <div class="info-value">${facultyName || '_________________________'}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">ACADEMIC YEAR:</div>
                    <div class="info-value">${academicYear}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">SEMESTER:</div>
                    <div class="info-value">${semester}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">DATE:</div>
                    <div class="info-value">${new Date().toLocaleDateString()}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">TOTAL SUBJECTS:</div>
                    <div class="info-value">${facultyLoads.length}</div>
                  </div>
                </div>
                
                <table class="subjects-table">
                  <thead>
                    <tr>
                      <th style="width: 12%;">SUBJECT CODE</th>
                      <th style="width: 25%;">DESCRIPTION</th>
                      <th style="width: 8%;">LEC</th>
                      <th style="width: 8%;">LAB</th>
                      <th style="width: 8%;">UNITS</th>
                      <th style="width: 15%;">YEAR & SECTION</th>
                      <th style="width: 15%;">SCHEDULE</th>
                      <th style="width: 9%;">TYPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${facultyLoads.length > 0 ? facultyLoads.map(load => `
                      <tr>
                        <td>${load.subject_code || ''}</td>
                        <td>${load.subject_description || ''}</td>
                        <td style="text-align: center;">${load.lec_hours || 0}</td>
                        <td style="text-align: center;">${load.lab_hours || 0}</td>
                        <td style="text-align: center;">${load.units || 0}</td>
                        <td>${load.section || ''}</td>
                        <td>${load.schedule || ''}</td>
                        <td>${load.type || ''}</td>
                      </tr>
                    `).join('') : `
                      <tr>
                        <td colspan="8" style="text-align: center; font-style: italic;">No subjects assigned</td>
                      </tr>
                    `}
                    <tr class="total-row">
                      <td colspan="4" style="text-align: right; font-weight: bold;">TOTAL UNITS:</td>
                      <td style="text-align: center; font-weight: bold;">${facultyLoads.reduce((sum, load) => sum + (parseInt(load.units) || 0), 0)}</td>
                      <td colspan="3"></td>
                    </tr>
                  </tbody>
                </table>
                
                <div class="signature-section">
                  <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-label">Program Head Signature</div>
                  </div>
                  <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-label">Dean Signature</div>
                  </div>
                  <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-label">Faculty Signature</div>
                  </div>
                </div>
                
                <div class="footer">
                  <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                  <p>Faculty Loading System - University of the Cordilleras</p>
                </div>
              </div>
            </div>
          </div>
          
          <script>
            let currentZoom = 100;
            
            function printDocument() {
              window.print();
            }
            
            function downloadDocument() {
              // Create a new window for printing to PDF
              const printWindow = window.open('', '_blank');
              
              const htmlContent = '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                '<title>Faculty Assignment Form - ' + facultyName + '</title>' +
                '<style>' +
                '@page { size: A4; margin: 0.5in; }' +
                'body { font-family: "Times New Roman", serif; margin: 0; padding: 0; color: #000; background: white; line-height: 1.2; }' +
                '.document-page { width: 100%; max-width: 8.5in; margin: 0 auto; background: white; position: relative; }' +
                '.watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 72px; color: rgba(0, 0, 0, 0.1); z-index: -1; font-weight: bold; white-space: nowrap; }' +
                '.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #000; padding-bottom: 15px; }' +
                '.university-name { font-size: 16px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }' +
                '.university-address { font-size: 12px; margin-bottom: 20px; }' +
                '.form-title { font-size: 24px; font-weight: bold; margin: 20px 0; text-transform: uppercase; letter-spacing: 2px; }' +
                '.faculty-info { margin-bottom: 25px; border: 2px solid #000; padding: 15px; }' +
                '.info-row { display: flex; margin-bottom: 8px; font-size: 14px; }' +
                '.info-label { font-weight: bold; width: 150px; text-transform: uppercase; }' +
                '.info-value { flex: 1; border-bottom: 1px solid #000; padding-bottom: 2px; margin-left: 10px; }' +
                '.subjects-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }' +
                '.subjects-table th { background-color: #f0f0f0; border: 2px solid #000; padding: 8px; text-align: center; font-weight: bold; text-transform: uppercase; }' +
                '.subjects-table td { border: 1px solid #000; padding: 6px; text-align: left; }' +
                '.subjects-table tr:nth-child(even) { background-color: #f9f9f9; }' +
                '.total-row { font-weight: bold; background-color: #e0e0e0 !important; }' +
                '.signature-section { margin-top: 30px; display: flex; justify-content: space-between; }' +
                '.signature-box { width: 200px; text-align: center; }' +
                '.signature-line { border-bottom: 1px solid #000; height: 40px; margin-bottom: 5px; }' +
                '.signature-label { font-size: 12px; font-weight: bold; text-transform: uppercase; }' +
                '.footer { margin-top: 40px; text-align: center; font-size: 10px; border-top: 1px solid #000; padding-top: 10px; }' +
                '</style>' +
                '</head>' +
                '<body>' +
                '<div class="document-page">' +
                '<div class="watermark">UNIVERSITY OF THE CORDILLERAS</div>' +
                '<div class="header">' +
                '<div class="university-name">UNIVERSITY OF THE CORDILLERAS</div>' +
                '<div class="university-address">GOV. PACK RD., BAGUIO CITY, PHILIPPINES</div>' +
                '<div class="form-title">Faculty Assignment Form</div>' +
                '</div>' +
                '<div class="faculty-info">' +
                '<div class="info-row">' +
                '<div class="info-label">FACULTY NAME:</div>' +
                '<div class="info-value">' + (facultyName || '_________________________') + '</div>' +
                '</div>' +
                '<div class="info-row">' +
                '<div class="info-label">ACADEMIC YEAR:</div>' +
                '<div class="info-value">' + academicYear + '</div>' +
                '</div>' +
                '<div class="info-row">' +
                '<div class="info-label">SEMESTER:</div>' +
                '<div class="info-value">' + semester + '</div>' +
                '</div>' +
                '<div class="info-row">' +
                '<div class="info-label">DATE:</div>' +
                '<div class="info-value">' + new Date().toLocaleDateString() + '</div>' +
                '</div>' +
                '<div class="info-row">' +
                '<div class="info-label">TOTAL SUBJECTS:</div>' +
                '<div class="info-value">' + facultyLoads.length + '</div>' +
                '</div>' +
                '</div>' +
                '<table class="subjects-table">' +
                '<thead>' +
                '<tr>' +
                '<th style="width: 12%;">SUBJECT CODE</th>' +
                '<th style="width: 25%;">DESCRIPTION</th>' +
                '<th style="width: 8%;">LEC</th>' +
                '<th style="width: 8%;">LAB</th>' +
                '<th style="width: 8%;">UNITS</th>' +
                '<th style="width: 15%;">YEAR & SECTION</th>' +
                '<th style="width: 15%;">SCHEDULE</th>' +
                '<th style="width: 9%;">TYPE</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                (facultyLoads.length > 0 ? facultyLoads.map(load => 
                  '<tr>' +
                  '<td>' + (load.subject_code || '') + '</td>' +
                  '<td>' + (load.subject_description || '') + '</td>' +
                  '<td style="text-align: center;">' + (load.lec_hours || 0) + '</td>' +
                  '<td style="text-align: center;">' + (load.lab_hours || 0) + '</td>' +
                  '<td style="text-align: center;">' + (load.units || 0) + '</td>' +
                  '<td>' + (load.section || '') + '</td>' +
                  '<td>' + (load.schedule || '') + '</td>' +
                  '<td>' + (load.type || '') + '</td>' +
                  '</tr>'
                ).join('') : 
                  '<tr><td colspan="8" style="text-align: center; font-style: italic;">No subjects assigned</td></tr>') +
                '<tr class="total-row">' +
                '<td colspan="4" style="text-align: right; font-weight: bold;">TOTAL UNITS:</td>' +
                '<td style="text-align: center; font-weight: bold;">' + facultyLoads.reduce((sum, load) => sum + (parseInt(load.units) || 0), 0) + '</td>' +
                '<td colspan="3"></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '<div class="signature-section">' +
                '<div class="signature-box">' +
                '<div class="signature-line"></div>' +
                '<div class="signature-label">Program Head Signature</div>' +
                '</div>' +
                '<div class="signature-box">' +
                '<div class="signature-line"></div>' +
                '<div class="signature-label">Dean Signature</div>' +
                '</div>' +
                '<div class="signature-box">' +
                '<div class="signature-line"></div>' +
                '<div class="signature-label">Faculty Signature</div>' +
                '</div>' +
                '</div>' +
                '<div class="footer">' +
                '<p>Generated on: ' + new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString() + '</p>' +
                '<p>Faculty Loading System - University of the Cordilleras</p>' +
                '</div>' +
                '</div>' +
                '<script>' +
                'window.onload = function() { setTimeout(() => { window.print(); }, 500); };' +
                '</script>' +
                '</body>' +
                '</html>';
              
              printWindow.document.write(htmlContent);
              printWindow.document.close();
            }
            
            function closeWindow() {
              window.close();
            }
            
            function zoomIn() {
              currentZoom = Math.min(currentZoom + 25, 200);
              updateZoom();
            }
            
            function zoomOut() {
              currentZoom = Math.max(currentZoom - 25, 50);
              updateZoom();
            }
            
            function fitToWidth() {
              currentZoom = 100;
              updateZoom();
            }
            
            function updateZoom() {
              const documentPage = document.getElementById('documentPage');
              const zoomLevel = document.getElementById('zoomLevel');
              
              documentPage.style.transform = \`scale(\${currentZoom / 100})\`;
              zoomLevel.textContent = \`\${currentZoom}%\`;
            }
            
            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
              if (e.ctrlKey) {
                switch(e.key) {
                  case 'p':
                    e.preventDefault();
                    printDocument();
                    break;
                  case 's':
                    e.preventDefault();
                    downloadDocument();
                    break;
                  case '=':
                  case '+':
                    e.preventDefault();
                    zoomIn();
                    break;
                  case '-':
                    e.preventDefault();
                    zoomOut();
                    break;
                  case '0':
                    e.preventDefault();
                    fitToWidth();
                    break;
                }
              }
            });
          </script>
        </body>
      </html>
    `;
    
    // Create a blob with HTML content for Google Docs Viewer style
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open in new tab - simple Google Docs Viewer style
    window.open(url, '_blank');
    
    // Clean up URL after delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
    
    toast.success('Faculty Assignment Form opened in new tab');
  };



  // Handle subject form changes
  const handleSubjectFormChange = (field, value) => {
    setSubjectForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle opening Add Subject modal
  const openAddSubjectModal = () => {
    if (!selectedFaculty) {
      toast.error('No faculty selected.');
      return;
    }
    setShowAddSubjectModal(true);
  };

  // Handle closing Add Subject modal
  const closeAddSubjectModal = () => {
    setShowAddSubjectModal(false);
    resetAddSubjectForm();
  };

  // Reset add subject form
  const resetAddSubjectForm = () => {
    setAddSubjectForm({
      subjectCode: '',
      subjectDescription: '',
      lecHours: 0,
      labHours: 0,
      units: 0,
      section: '',
      schedule: '',
      room: '',
      type: 'Part-time'
    });
  };

  // Handle add subject form changes
  const handleAddSubjectFormChange = (field, value) => {
    setAddSubjectForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle adding subject to faculty load
  const handleAddSubjectToFaculty = async (e) => {
    e.preventDefault();
    
    if (!selectedFaculty) {
      toast.error('No faculty selected.');
      return;
    }

    try {
      // Save to database
      const response = await api.post('/faculty-loads', {
        faculty_id: selectedFaculty.id,
        subject_id: null, // Manual subject entry
        subject_code: addSubjectForm.subjectCode,
        subject_description: addSubjectForm.subjectDescription,
        lec_hours: addSubjectForm.lecHours,
        lab_hours: addSubjectForm.labHours,
        units: addSubjectForm.units,
        section: addSubjectForm.section,
        schedule: addSubjectForm.schedule,
        room: addSubjectForm.room,
        type: addSubjectForm.type,
        academic_year: academicYear,
        semester: semester
      });

      // Add to local state
      const newLoad = response.data.data;
      setFacultyLoads(prev => [...prev, newLoad]);
      
      toast.success(`Subject ${addSubjectForm.subjectCode} added to ${selectedFaculty.fullname}'s load`);
      console.log('Subject added to faculty load:', newLoad);
      
      closeAddSubjectModal();
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error(error.response?.data?.message || 'Failed to add subject');
    }
  };

  // Add or edit subject
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (subjectForm.id) {
        // Edit existing subject
        const response = await api.put(`/faculty-loads/${subjectForm.id}`, {
          subject_code: subjectForm.subjectCode,
          subject_description: subjectForm.subjectDescription,
          lec_hours: subjectForm.lecHours,
          lab_hours: subjectForm.labHours,
          units: subjectForm.units,
          section: subjectForm.section,
          schedule: subjectForm.schedule,
          room: subjectForm.room,
          type: subjectForm.type,
          academic_year: academicYear,
          semester: semester
        });

        // Update local state
        const updatedLoad = response.data.data;
        setFacultyLoads(prev => prev.map(load => 
          load.id === subjectForm.id ? updatedLoad : load
        ));
        toast.success('Subject updated successfully');
        console.log('Subject updated:', updatedLoad);
      } else {
        // Add new subject manually (not from dropdown)
        const response = await api.post('/faculty-loads', {
          faculty_id: selectedFaculty.id,
          subject_id: null, // Manual subject entry - no existing subject
          subject_code: subjectForm.subjectCode,
          subject_description: subjectForm.subjectDescription,
          lec_hours: subjectForm.lecHours,
          lab_hours: subjectForm.labHours,
          units: subjectForm.units,
          section: subjectForm.section,
          schedule: subjectForm.schedule,
          room: subjectForm.room,
          type: subjectForm.type,
          academic_year: academicYear,
          semester: semester
        });

        // Add to local state
        const newLoad = response.data.data;
        setFacultyLoads(prev => [...prev, newLoad]);
        toast.success('Subject added successfully');
        console.log('New subject added:', newLoad);
      }
      
      setShowModal(false);
      resetSubjectForm();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast.error(error.response?.data?.message || 'Failed to save subject');
    }
  };

  // Reset subject form
  const resetSubjectForm = () => {
    setSubjectForm({
      subjectCode: '',
      subjectDescription: '',
      lecHours: 0,
      labHours: 0,
      units: 0,
      section: '',
      schedule: '',
      room: '',
      type: 'Part-time'
    });
    setModalTitle('Add Subject');
  };

  // Remove subject
  const removeSubject = async (id) => {
    const subjectToRemove = facultyLoads.find(load => load.id === id);
    if (!subjectToRemove) return;

    try {
      await api.delete(`/faculty-loads/${id}`);
      setFacultyLoads(prev => prev.filter(subject => subject.id !== id));
      toast.success(`Subject ${subjectToRemove.subject_code} removed from faculty load`);
    } catch (error) {
      console.error('Error removing subject:', error);
      toast.error('Failed to remove subject');
    }
  };

  // Open edit modal
  const handleOpenEditModal = async (subject) => {
    console.log('Opening edit modal for subject:', subject);
    console.log('Section offering ID:', subject.section_offering_id);
    
    // If section_offering_id is missing, try to create/fetch it
    if (!subject.section_offering_id) {
      console.log('Section offering ID missing, attempting to create/fetch...');
      toast.loading('Setting up section offering...');
      
      try {
        // Try to create section offering
        const offeringResponse = await api.post('/section-offerings', {
          program_id: selectedProgramId,
          academic_year: academicYear,
          semester: semester,
          year_level: yearLevel,
          parent_section: parentSection,
          subject_id: subject.id
        });
        
        // Update the subject with the new section_offering_id
        const newOffering = offeringResponse.data.data;
        subject.section_offering_id = newOffering.id;
        subject.schedules = newOffering.schedules || [];
        
        // Update in the subjects list
        setProgramSubjects(prev => prev.map(s => 
          s.id === subject.id ? { ...s, section_offering_id: newOffering.id, schedules: newOffering.schedules || [] } : s
        ));
        
        toast.success('Section offering created!');
      } catch (error) {
        if (error.response?.status === 409) {
          // Already exists, fetch it
          try {
            const existingResponse = await api.get('/section-offerings', {
              params: {
                program_id: selectedProgramId,
                academic_year: academicYear,
                semester: semester,
                year_level: yearLevel,
                parent_section: parentSection,
                subject_id: subject.id
              }
            });
            
            const matchingOffering = existingResponse.data.data.find(
              offering => offering.subject_id === subject.id
            );
            
            if (matchingOffering) {
              subject.section_offering_id = matchingOffering.id;
              subject.schedules = matchingOffering.schedules || [];
              
              setProgramSubjects(prev => prev.map(s => 
                s.id === subject.id ? { ...s, section_offering_id: matchingOffering.id, schedules: matchingOffering.schedules || [] } : s
              ));
              
              toast.success('Section offering found!');
            } else {
              toast.error('Could not find section offering. Please reload subjects.');
              return;
            }
          } catch (fetchError) {
            console.error('Error fetching section offering:', fetchError);
            toast.error('Failed to fetch section offering. Please reload subjects.');
            return;
          }
        } else {
          console.error('Error creating section offering:', error);
          toast.error('Failed to create section offering. Please reload subjects.');
          return;
        }
      }
    }
    
    setEditingSubject(subject);
    setEditForm({
      lec_hours: subject.lec_hours || 0,
      lab_hours: subject.lab_hours || 0,
      units: subject.units || 3,
      slots: subject.slots || 0,
      schedules: subject.schedules || []
    });
    setShowEditModal(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingSubject(null);
    setEditForm({
      lec_hours: 0,
      lab_hours: 0,
      units: 0,
      slots: 0,
      schedules: []
    });
  };

  // Add new schedule
  const handleAddSchedule = () => {
    setEditForm(prev => ({
      ...prev,
      schedules: [...prev.schedules, { day: 'Monday', start_time: '08:00', end_time: '09:00' }]
    }));
  };

  // Remove schedule
  const handleRemoveSchedule = (index) => {
    setEditForm(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index)
    }));
  };

  // Update schedule
  const handleUpdateSchedule = (index, field, value) => {
    setEditForm(prev => ({
      ...prev,
      schedules: prev.schedules.map((schedule, i) => 
        i === index ? { ...schedule, [field]: value } : schedule
      )
    }));
  };

  // Save edited subject
  const handleSaveEdit = async () => {
    // Validation: lec_hours + lab_hours should equal units
    if (editForm.lec_hours + editForm.lab_hours !== editForm.units) {
      toast.error(`LEC + LAB hours must equal ${editForm.units} units`);
      return;
    }

    // Check if section_offering_id exists
    if (!editingSubject.section_offering_id) {
      toast.error('Section offering ID is missing. Please reload the subjects.');
      console.error('Missing section_offering_id:', editingSubject);
      return;
    }

    try {
      setLoading(true);
      console.log('Updating section offering ID:', editingSubject.section_offering_id);
      console.log('Update data:', {
        lec_hours: editForm.lec_hours,
        lab_hours: editForm.lab_hours,
        slots: editForm.slots,
        schedules: JSON.stringify(editForm.schedules)
      });

      // Update section offering in database
      const response = await api.put(`/section-offerings/${editingSubject.section_offering_id}`, {
        lec_hours: editForm.lec_hours,
        lab_hours: editForm.lab_hours,
        slots: editForm.slots,
        schedules: editForm.schedules // Send as array, not JSON string
      });

      if (response.data.success) {
        // Update local state
        setProgramSubjects(prev => prev.map(subject => 
          subject.id === editingSubject.id 
            ? { 
                ...subject, 
                lec_hours: editForm.lec_hours,
                lab_hours: editForm.lab_hours,
                slots: editForm.slots,
                schedules: editForm.schedules
              }
            : subject
        ));
        toast.success('Subject updated successfully');
        handleCloseEditModal();
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to update subject');
    } finally {
      setLoading(false);
    }
  };

  // Load program subjects and save section offerings
  const handleLoadProgramSubjects = async () => {
    if (!selectedProgramId) {
      toast.error('Please select a program first');
      return;
    }

    if (!academicYear || !semester || !yearLevel || !parentSection) {
      toast.error('Please fill all dropdown fields');
      return;
    }

    try {
      setLoading(true);
      console.log('=== STARTING LOAD PROGRAM SUBJECTS ===');
      console.log('Selected Program ID:', selectedProgramId);
      console.log('Academic Year:', academicYear);
      console.log('Semester:', semester);
      console.log('Year Level:', yearLevel);
      console.log('Parent Section:', parentSection);
      
      console.log('Step 1: Fetching subjects for program...');
      const response = await api.get(`/programs/${selectedProgramId}/subjects`);
      console.log('Step 1 Response:', response.data);

      if (response.data.success) {
        const subjects = response.data.data || [];
        console.log(`Step 2: Found ${subjects.length} subjects`);
        
        // Save each subject as a section offering and get the IDs
        console.log('Step 3: Creating/fetching section offerings...');
        const sectionOfferingResults = await Promise.all(
          subjects.map(async (subject, index) => {
            console.log(`Step 3.${index + 1}: Processing subject ${subject.subject_code}...`);
            try {
              const offeringData = {
                program_id: selectedProgramId,
                academic_year: academicYear,
                semester: semester,
                year_level: yearLevel,
                parent_section: parentSection,
                subject_id: subject.id
              };
              console.log(`Step 3.${index + 1}a: Creating section offering with data:`, offeringData);
              
              const offeringResponse = await api.post('/section-offerings', offeringData);
              console.log(`Step 3.${index + 1}b: Created successfully:`, offeringResponse.data);
              return offeringResponse.data.data; // Return the created section offering
            } catch (error) {
              console.error(`Step 3.${index + 1} ERROR:`, error.response?.data || error.message);
              
              // If already exists (409), fetch existing section offering
              if (error.response?.status === 409) {
                console.log(`Step 3.${index + 1}c: Already exists, fetching existing...`);
                try {
                  const existingResponse = await api.get('/section-offerings', {
                    params: {
                      program_id: selectedProgramId,
                      academic_year: academicYear,
                      semester: semester,
                      year_level: yearLevel,
                      parent_section: parentSection,
                      subject_id: subject.id
                    }
                  });
                  console.log(`Step 3.${index + 1}d: Fetched existing:`, existingResponse.data);
                  
                  // Find the matching section offering
                  const matchingOffering = existingResponse.data.data.find(
                    offering => offering.subject_id === subject.id
                  );
                  console.log(`Step 3.${index + 1}e: Found matching:`, matchingOffering);
                  return matchingOffering;
                } catch (fetchError) {
                  console.error(`Step 3.${index + 1}f: Error fetching existing:`, fetchError.response?.data || fetchError.message);
                  return null;
                }
              } else {
                console.error(`Step 3.${index + 1}g: Unhandled error:`, error.response?.data || error.message);
                return null;
              }
            }
          })
        );
        
        console.log('Step 4: All section offerings processed:', sectionOfferingResults);
        
        // Add year & section info and section_offering_id to subjects for display
        const subjectsWithSection = subjects.map((subject, index) => {
          const offering = sectionOfferingResults[index];
          console.log(`Subject ${subject.subject_code} - Section Offering:`, offering);
          
          return {
            ...subject,
            section_offering_id: offering?.id || null,
            lec_hours: offering?.lec_hours || 0,
            lab_hours: offering?.lab_hours || 0,
            slots: offering?.slots || 0,
            schedules: offering?.schedules || [], // Schedules come as array from relationship
            year_section: `${yearLevel} - ${parentSection}`,
            academic_year: academicYear,
            semester: semester
          };
        });

        console.log('Step 5: Setting program subjects state...');
        setProgramSubjects(subjectsWithSection);
        
        console.log('Step 6: Checking for missing IDs...');
        // Check for any missing section_offering_ids
        const missingIds = subjectsWithSection.filter(s => !s.section_offering_id);
        if (missingIds.length > 0) {
          console.warn('Subjects with missing section_offering_id:', missingIds);
          toast.error(`⚠️ ${missingIds.length} subject(s) missing section offering ID`);
        }
        
        console.log('=== COMPLETED SUCCESSFULLY ===');
        toast.success(`Loaded ${subjects.length} subject(s) for ${yearLevel} - ${parentSection}`);
        console.log('Final subjects with section:', subjectsWithSection);
      } else {
        console.error('Step ERROR: response.data.success is false');
        toast.error('Failed to load program subjects - Invalid response');
        setProgramSubjects([]);
      }
    } catch (error) {
      console.error('Error loading program subjects:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Failed to load program subjects';
      
      toast.error(`Error: ${errorMessage}`);
      setProgramSubjects([]);
    } finally {
      setLoading(false);
    }
  };


  return ( 
        <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-6 space-y-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">
              Section Offering
            </h1>
          </div>

    <div className="min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200"> </div>
          {/* Filters Section - Course, Academic Year, Semester, Year Level, Parent Section */}
          <div className="bg-white rounded-lg shadow-sm pb-6 mx-6 mt-6 mb-6 ml-3 mr-3">
            <div className="space-y-4">
              {/* Course - First Row */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">
                  Course / Program
                </label>
                <select
                  value={selectedProgramId || ''}
                  onChange={(e) => {
                    const programId = e.target.value;
                    setSelectedProgramId(programId);
                    const selectedProgram = availablePrograms.find(p => p.id.toString() === programId);
                    setCourse(selectedProgram?.code || '');
                    setProgramSubjects([]); // Clear subjects when changing program
                  }}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  disabled={isLoadingPrograms}
                >
                  <option value="">
                    {isLoadingPrograms ? 'Loading programs...' : 'Select Course / Program'}
                  </option>
                  {availablePrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.code} - {program.name}
                    </option>
                  ))}
                  {!isLoadingPrograms && availablePrograms.length === 0 && (
                    <option value="" disabled>No programs available</option>
                  )}
                </select>
              </div>

              {/* Academic Year, Semester, Year Level, Parent Section - Second Row */}
              <div className="flex flex-nowrap gap-3 items-end overflow-x-auto">
                {/* Academic Year */}
                <div className="flex flex-col min-w-[140px] flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">Academic Year</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors w-full"
                  >
                    <option value="2524">2524</option>
                    <option value="2525">2525</option>
                    <option value="2526">2526</option>
                    <option value="2527">2527</option>
                  </select>
                </div>

                {/* Semester */}
                <div className="flex flex-col min-w-[120px] flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors w-full"
                  >
                    <option value="First">First</option>
                    <option value="Second">Second</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>

                {/* Year Level */}
                <div className="flex flex-col min-w-[140px] flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">Year Level</label>
                  <select
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors w-full"
                  >
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                  </select>
                </div>

                {/* Parent Section */}
                <div className="flex flex-col min-w-[140px] flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">Parent Section</label>
                  <select
                    value={parentSection}
                    onChange={(e) => setParentSection(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors w-full"
                  >
                    <option value="A-NORTH">A-NORTH</option>
                    <option value="B-SOUTH">B-SOUTH</option>
                    <option value="C-EAST">C-EAST</option>
                    <option value="D-WEST">D-WEST</option>
                  </select>
                </div>
              </div>
            </div>
          </div>


            {/* Faculty Loads Section */}
            <div className="bg-gray-50 rounded-lg ">
              {/* Faculty Subjects Info */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 ml-3 mr-3">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#064F32]/10 text-[#064F32]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Subject Code</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">LEC</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">LAB</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Units</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Year & Section</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Schedule</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Slots</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
                            <p className="text-sm">Loading subjects...</p>
                          </div>
                        </td>
                      </tr>
                    ) : programSubjects.length > 0 ? (
                      programSubjects.map((subject) => (
                        <tr key={subject.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-900">
                            {subject.subject_code}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {subject.subject_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                            {subject.lec_hours || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                            {subject.lab_hours || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-semibold">
                            {subject.units || 3}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold text-[#064F32]">
                            {subject.year_section || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {subject.schedules && subject.schedules.length > 0 ? (
                              <div className="space-y-1">
                                {subject.schedules.map((schedule, idx) => (
                                  <div key={idx} className="text-xs">
                                    {schedule.day} {schedule.start_time}-{schedule.end_time}
                                  </div>
                                ))}
                              </div>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {subject.slots || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleOpenEditModal(subject)}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-150 p-1 rounded hover:bg-blue-50"
                                title="Edit Subject"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center text-gray-500">
                            <User className="w-8 h-8 mb-2 opacity-50" />
                            <p className="text-sm">No subjects loaded</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {selectedProgramId 
                                ? 'Fill in all fields above (Academic Year, Semester, Year Level, Parent Section) to load subjects' 
                                : 'Please select a program and fill in all required fields'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timetable Section - Better Balanced */}
            <div className="bg-gray-50 rounded-lg ">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 mt-6 ml-6 border-b-2 border-green-500 pb-2 inline-block">
                Weekly Schedule Overview
              </h3>
              
              
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 text-sm font-bold text-center shadow-sm border border-gray-400">
                          Time
                        </th>
                        {days.map(day => (
                          <th key={day} className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 text-sm font-bold text-center shadow-sm border border-gray-400">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map(slotGroup => (
                        <tr key={slotGroup.groupIndex}>
                          {/* Time label - grouped display */}
                          <td className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs text-center font-semibold text-gray-700 border border-gray-400 min-h-[80px] w-24">
                            <div className="flex flex-col justify-center h-full">
                              <div className="text-xs opacity-70">{slotGroup.startDisplay}</div>
                              <div className="text-sm font-bold text-gray-800">{slotGroup.middleDisplay}</div>
                              <div className="text-xs opacity-70">{slotGroup.endDisplay}</div>
                            </div>
                          </td>
                          {/* Day slots */}
                          {days.map(day => {
                            const scheduleInfo = getScheduleForTimeSlot(day, slotGroup);
                            
                            if (scheduleInfo) {
                              return (
                                <td
                                  key={`${day}-${slotGroup.groupIndex}`}
                                  className="p-1 border border-gray-400 cursor-pointer transition-all duration-150 hover:opacity-90 hover:shadow-md"
                                >
                                  <div 
                                    className={`${scheduleInfo.color} text-white p-2 rounded-lg text-xs text-center shadow-lg w-full h-full flex flex-col justify-center min-h-[80px] border border-gray-300`}
                                  >
                                    <div className="font-semibold truncate" title={scheduleInfo.title}>
                                      {scheduleInfo.title}
                                    </div>
                                    <div className="text-xs opacity-90 truncate" title={scheduleInfo.subjectDescription}>
                                      {scheduleInfo.subjectDescription}
                                    </div>
                                    <div className="text-xs opacity-80 font-medium">
                                      {scheduleInfo.section} • {scheduleInfo.room}
                                    </div>
                                    <div className="text-xs opacity-75">
                                      Class • {scheduleInfo.fullTimeRange}
                                    </div>
                                    {scheduleInfo.type === 'class' && (
                                      <div className="text-xs opacity-70 mt-1">
                                        LEC: {scheduleInfo.lecHours}h • LAB: {scheduleInfo.labHours}h • Units: {scheduleInfo.units}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            } else {
                              return (
                                <td
                                  key={`${day}-${slotGroup.groupIndex}`}
                                  className="p-1 border border-gray-400 cursor-pointer transition-all duration-150 bg-white hover:bg-gray-50 hover:shadow-sm min-h-[80px]"
                                >
                                </td>
                              );
                            }
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Timetable Legend */}
              <div className="mt-4 ml-3 mr-3 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Faculty Classes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span className="text-gray-600">Available Slots</span>
                </div>
              </div>
              
            </div>

          {/* Footer Actions - Better Balanced */}
          <div className="bg-white rounded-lg p-6 shadow-sm mx-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button 
                onClick={handlePrintForm}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm gap-2"
              >
                <FileText className="w-4 h-4" />
                Open Faculty Assignment Form
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Add Subject Modal */}
        {showAddSubjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Add Subject to Faculty Load</h3>
                <button
                  onClick={closeAddSubjectModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleAddSubjectToFaculty} className="p-6">
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Faculty:</strong> {selectedFaculty?.fullname} | 
                    <strong> Academic Year:</strong> {academicYear} | 
                    <strong> Semester:</strong> {semester}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSubjectForm.subjectCode}
                      onChange={(e) => handleAddSubjectFormChange('subjectCode', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., CS 101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSubjectForm.subjectDescription}
                      onChange={(e) => handleAddSubjectFormChange('subjectDescription', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Subject description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LEC Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addSubjectForm.lecHours}
                      onChange={(e) => handleAddSubjectFormChange('lecHours', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LAB Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addSubjectForm.labHours}
                      onChange={(e) => handleAddSubjectFormChange('labHours', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Units *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={addSubjectForm.units}
                      onChange={(e) => handleAddSubjectFormChange('units', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year & Section *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSubjectForm.section}
                      onChange={(e) => handleAddSubjectFormChange('section', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., BSIT 4A, BSCS 4B"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSubjectForm.schedule}
                      onChange={(e) => handleAddSubjectFormChange('schedule', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., MONDAY 9:00AM-1:00PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSubjectForm.room}
                      onChange={(e) => handleAddSubjectFormChange('room', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., ROOM 303"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={addSubjectForm.type}
                      onChange={(e) => handleAddSubjectFormChange('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="Part-time">Part-time</option>
                      <option value="Full-time">Full-time</option>
                    </select>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeAddSubjectModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Subject Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">{modalTitle}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Form - Better Balanced */}
              <form onSubmit={handleSubjectSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.subjectCode}
                      onChange={(e) => handleSubjectFormChange('subjectCode', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., CS 101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.subjectDescription}
                      onChange={(e) => handleSubjectFormChange('subjectDescription', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Subject description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LEC Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subjectForm.lecHours}
                      onChange={(e) => handleSubjectFormChange('lecHours', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LAB Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subjectForm.labHours}
                      onChange={(e) => handleSubjectFormChange('labHours', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Units *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={subjectForm.units}
                      onChange={(e) => handleSubjectFormChange('units', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year & Section *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.section}
                      onChange={(e) => handleSubjectFormChange('section', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., BSIT 4A, BSCS 4B"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.schedule}
                      onChange={(e) => handleSubjectFormChange('schedule', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., MONDAY 9:00AM-1:00PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.room}
                      onChange={(e) => handleSubjectFormChange('room', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., ROOM 303"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={subjectForm.type}
                      onChange={(e) => handleSubjectFormChange('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="Part-time">Part-time</option>
                      <option value="Full-time">Full-time</option>
                    </select>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Subject Modal */}
        {showEditModal && editingSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Subject: {editingSubject.subject_code} - {editingSubject.subject_name}
                </h3>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Form */}
              <div className="p-6">
                {/* Section 1: LEC, LAB, Units */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
                    1. Hours Distribution
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LEC Hours *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.lec_hours}
                        onChange={(e) => setEditForm(prev => ({ ...prev, lec_hours: parseInt(e.target.value) || 0 }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LAB Hours *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.lab_hours}
                        onChange={(e) => setEditForm(prev => ({ ...prev, lab_hours: parseInt(e.target.value) || 0 }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Units (Read-only)
                      </label>
                      <input
                        type="number"
                        value={editForm.units}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  {editForm.lec_hours + editForm.lab_hours !== editForm.units && (
                    <p className="text-red-600 text-sm mt-2">
                      ⚠️ LEC ({editForm.lec_hours}) + LAB ({editForm.lab_hours}) must equal {editForm.units} units
                    </p>
                  )}
                </div>

                {/* Section 2: Schedules */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h4 className="text-md font-semibold text-gray-800">
                      2. Schedule(s)
                    </h4>
                    <button
                      onClick={handleAddSchedule}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Schedule
                    </button>
                  </div>
                  
                  {editForm.schedules.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No schedules added yet. Click "Add Schedule" to add one.</p>
                  ) : (
                    <div className="space-y-3">
                      {editForm.schedules.map((schedule, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-medium text-gray-700">Schedule {index + 1}</span>
                            <button
                              onClick={() => handleRemoveSchedule(index)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove Schedule"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                              <select
                                value={schedule.day}
                                onChange={(e) => handleUpdateSchedule(index, 'day', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                              <input
                                type="time"
                                value={schedule.start_time}
                                onChange={(e) => handleUpdateSchedule(index, 'start_time', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                              <input
                                type="time"
                                value={schedule.end_time}
                                onChange={(e) => handleUpdateSchedule(index, 'end_time', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 3: Slots */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
                    3. Student Slots
                  </h4>
                  <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Students *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.slots}
                      onChange={(e) => setEditForm(prev => ({ ...prev, slots: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., 40"
                    />
                    <p className="text-xs text-gray-500 mt-1">Number of students that can enroll in this subject</p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={editForm.lec_hours + editForm.lab_hours !== editForm.units}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
    </div>
    </div>
    </div>
  );
};

export default FacultyLoading;
