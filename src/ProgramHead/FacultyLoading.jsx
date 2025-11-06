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
  const [academicYear, setAcademicYear] = useState('2526');
  const [semester, setSemester] = useState('First');
  const [facultyName, setFacultyName] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);

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
  
  // Program Filter State
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
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

  // Function to fetch programs from AcademicManagement
  const fetchPrograms = async () => {
    try {
      setIsLoadingPrograms(true);
      console.log('Fetching programs from AcademicManagement...');
      const response = await api.get('/programs');
      console.log('Programs API response:', response.data);
      
      // Check if response has success property and data
      if (response.data.success && Array.isArray(response.data.data)) {
        setAvailablePrograms(response.data.data);
        console.log('Successfully fetched programs:', response.data.data);
      } else if (Array.isArray(response.data)) {
        setAvailablePrograms(response.data);
        console.log('Successfully fetched programs:', response.data);
      } else {
        console.error('Invalid programs response format:', response.data);
        setAvailablePrograms([]);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      setAvailablePrograms([]);
    } finally {
      setIsLoadingPrograms(false);
    }
  };

  // Function to fetch section offerings filtered by program and semester
  const fetchSubjects = async () => {
    if (!selectedProgram) {
      setAvailableSubjects([]);
      return;
    }
    
    try {
      setIsLoadingSubjects(true);
      console.log('Fetching section offerings...', {
        program_id: selectedProgram,
        academic_year: academicYear,
        semester: semester
      });
      
      const response = await api.get('/section-offerings', {
        params: {
          program_id: selectedProgram,
          academic_year: academicYear,
          semester: semester,
          exclude_assigned: 'true' // Exclude section offerings already assigned to any faculty
        }
      });
      console.log('Section offerings API response:', response.data);
      
      // Check if response has success property and data
      let offerings = [];
      if (response.data.success && Array.isArray(response.data.data)) {
        offerings = response.data.data;
      } else if (Array.isArray(response.data)) {
        offerings = response.data;
      } else {
        console.error('Invalid response format:', response.data);
        setAvailableSubjects([]);
        return;
      }
      
      console.log(`Found ${offerings.length} section offerings`);
      
      // Transform to match the UI format
      const transformedSubjects = offerings.map(offering => ({
        id: offering.id,
        section_offering_id: offering.id,
        subject_id: offering.subject_id,
        name: offering.subject?.subject_name || 'Unknown Subject',
        code: offering.subject?.subject_code || 'N/A',
        units: offering.subject?.units || 3,
        lecHours: offering.lec_hours || 0,
        labHours: offering.lab_hours || 0,
        slots: offering.slots || 0,
        type: offering.subject?.subject_type || 'Major',
        year_level: offering.year_level || 'N/A',
        section: offering.parent_section || 'N/A',
        year_section: `${offering.year_level} - ${offering.parent_section}`,
        schedules: offering.schedules || [],
        hasSchedules: offering.schedules && offering.schedules.length > 0,
        program: offering.program?.program_name || 'N/A'
      }));
      
      setAvailableSubjects(transformedSubjects);
      console.log('Successfully fetched section offerings:', transformedSubjects);
    } catch (error) {
      console.error('Error fetching section offerings:', error);
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
        console.log('No section offerings found for this program/semester');
        setAvailableSubjects([]);
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
      // Debug: Log all schedules
      response.data?.forEach((load, index) => {
        console.log(`Load ${index + 1}: ${load.computed_subject_code || load.subject_code}`, {
          schedule: load.schedule,
          computed_schedule: load.computed_schedule,
          section_offering_id: load.section_offering_id
        });
      });
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
          toast.error('No faculty selected. Please go back to Faculty Load page and select a faculty.');
        }
      } catch (error) {
        console.error('Error parsing faculty data from sessionStorage:', error);
        toast.error('Error loading faculty data');
      }
    };

    // Fetch programs and faculty data
    console.log('Component mounted, fetching programs and faculty data...');
    fetchPrograms();
    fetchSelectedFaculty();
  }, []);

  // Refresh faculty subjects when academic year or semester changes
  useEffect(() => {
    if (selectedFaculty) {
      fetchFacultySubjects(selectedFaculty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academicYear, semester, selectedFaculty]);

  // Refresh available subjects when program, academic year, or semester changes
  useEffect(() => {
    console.log('==== SUBJECT FETCH TRIGGER ====');
    console.log('Selected Program ID:', selectedProgram);
    console.log('Academic Year:', academicYear);
    console.log('Semester:', semester);
    
    if (selectedProgram) {
      console.log('✅ All conditions met, calling fetchSubjects...');
      fetchSubjects();
    } else {
      console.log('⚠️ No program selected, clearing subjects');
      setAvailableSubjects([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProgram, academicYear, semester]);

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
  const getScheduleForTimeSlot = (day, timeSlotGroup, facultyLoadId = null) => {
    // Check if any of the three times in the group match
    const startSlotTime = parseTime(timeSlotGroup.startDisplay);
    const middleSlotTime = parseTime(timeSlotGroup.middleDisplay);
    const endSlotTime = parseTime(timeSlotGroup.endDisplay);
    
    // Simple debug logging
    console.log(`Checking ${day} at group ${timeSlotGroup.groupIndex} (${timeSlotGroup.startDisplay}, ${timeSlotGroup.middleDisplay}, ${timeSlotGroup.endDisplay}) - Faculty loads:`, facultyLoads.length);

    // Check faculty loads - if facultyLoadId is provided, only check that specific load
    // Otherwise, find the first matching load
    const facultyLoad = facultyLoadId 
      ? facultyLoads.find(load => load.id === facultyLoadId)
      : facultyLoads.find(load => {
      // Use computed_schedule if available (from section offering), otherwise use schedule
      const scheduleToCheck = load.computed_schedule || load.schedule || '';
      
      if (!scheduleToCheck) {
        console.log(`No schedule for ${load.subject_code || load.computed_subject_code}`);
        return false;
      }
      
      console.log(`Checking ${load.subject_code || load.computed_subject_code}: "${scheduleToCheck}"`);
      
      // Enhanced day matching for new formats
      const schedule = scheduleToCheck.toUpperCase();
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
      
      const subjectCode = load.subject_code || load.computed_subject_code || 'Unknown';
      console.log(`Day match for ${subjectCode}: ${dayMatches}`);
      
      if (!dayMatches) return false;
      
      // Enhanced time parsing - handle both AM/PM indicators
      // Also handle multiple schedules separated by commas
      const scheduleStrings = schedule.split(',').map(s => s.trim());
      let timeMatch = null;
      let matchedSchedule = '';
      
      // Try to find a schedule that matches the current day
      for (const scheduleStr of scheduleStrings) {
        const dayInSchedule = scheduleStr.includes(dayUpper);
        if (dayInSchedule) {
          timeMatch = scheduleStr.match(/(\d{1,2}):?(\d{2})?(AM|PM)\s*-\s*(\d{1,2}):?(\d{2})?(AM|PM)/i);
          if (timeMatch) {
            matchedSchedule = scheduleStr;
            break;
          }
        }
      }
      
      // If no day-specific match found, try matching any schedule in the string
      if (!timeMatch) {
        timeMatch = schedule.match(/(\d{1,2}):?(\d{2})?(AM|PM)\s*-\s*(\d{1,2}):?(\d{2})?(AM|PM)/i);
        if (timeMatch) {
          matchedSchedule = schedule;
        }
      }
      
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
        
        // Convert to minutes for comparison
        const startMinutes = startTime24 * 60 + startMin;
        let endMinutes = endTime24 * 60 + endMin;
        
        // For classes ending at :00 (like 5:00 PM), treat it as ending at :59 of the previous hour
        // This ensures the class doesn't include the next hour's slot group
        // e.g., 1:00 PM - 5:00 PM means class runs from 1:00 PM to 4:59 PM (4 hours)
        if (endMin === 0) {
          endMinutes = endTime24 * 60 - 1; // End at :59 of previous hour
        }
        
        // For classes that end at non-zero minutes (like 1:30 PM - 4:30 PM), keep the exact end time
        
        console.log(`Time range: ${startMinutes}-${endMinutes}`);
        console.log(`Parsed: ${startHour}:${startMin.toString().padStart(2, '0')}${startPeriod} - ${endHour}:${endMin.toString().padStart(2, '0')}${endPeriod}`);
        console.log(`Duration: ${endMinutes - startMinutes} minutes, Slots: ${Math.ceil((endMinutes - startMinutes) / 30)}`);
        
        // Check if the slot group overlaps with the class time range
        // A slot group represents an hour (e.g., 1:00 PM, 1:30 PM, 1:59 PM for the 1 PM hour)
        // The slot group overlaps if:
        // 1. Any slot time is within the class range [startMinutes, endMinutes), OR
        // 2. The slot group's hour overlaps with the class range
        const slotGroupStart = Math.min(startSlotTime, middleSlotTime, endSlotTime);
        const slotGroupEnd = Math.max(startSlotTime, middleSlotTime, endSlotTime);
        
        // Check if slot group overlaps with class time
        // For a 4-hour class (1:00 PM - 5:00 PM = 1:00 PM - 4:59 PM), we need to check if the slot's hour falls within the range
        const isInRange = 
          // Any slot time is within class range [startMinutes, endMinutes]
          (startSlotTime >= startMinutes && startSlotTime <= endMinutes) ||
          (middleSlotTime >= startMinutes && middleSlotTime <= endMinutes) ||
          (endSlotTime >= startMinutes && endSlotTime <= endMinutes) ||
          // Slot group hour overlaps with class (class starts before slot ends AND class ends after slot starts)
          (slotGroupStart <= endMinutes && slotGroupEnd >= startMinutes);
        
        console.log(`Slot times: ${startSlotTime}, ${middleSlotTime}, ${endSlotTime} (group: ${slotGroupStart}-${slotGroupEnd})`);
        console.log(`Class range: ${startMinutes}-${endMinutes}`);
        console.log(`In range: ${isInRange}`);
        
        return isInRange;
      }
      
      console.log(`No time match found for ${subjectCode}`);
      return false;
    });

    if (facultyLoad) {
      const subjectCode = facultyLoad.subject_code || facultyLoad.computed_subject_code || 'Subject';
      console.log(`Found match: ${subjectCode}`);
      
      // Parse time for display with new format
      const scheduleToUse = (facultyLoad.computed_schedule || facultyLoad.schedule || '').toUpperCase();
      const timeMatch = scheduleToUse.match(/(\d{1,2}):?(\d{2})?(AM|PM)\s*-\s*(\d{1,2}):?(\d{2})?(AM|PM)/i);
      
      if (timeMatch) {
        const startHour = parseInt(timeMatch[1]);
        const startMin = parseInt(timeMatch[2] || '0');
        const startPeriod = timeMatch[3].toUpperCase();
        const endHour = parseInt(timeMatch[4]);
        let endMin = parseInt(timeMatch[5] || '0');
        const endPeriod = timeMatch[6].toUpperCase();
        
        let startTime24 = startHour;
        if (startPeriod === 'PM' && startHour !== 12) startTime24 += 12;
        if (startPeriod === 'AM' && startHour === 12) startTime24 = 0;
        
        let endTime24 = endHour;
        if (endPeriod === 'PM' && endHour !== 12) endTime24 += 12;
        if (endPeriod === 'AM' && endHour === 12) endTime24 = 0;
        
        const classStartMinutes = startTime24 * 60 + startMin;
        let classEndMinutes = endTime24 * 60 + endMin;
        
        // Adjust end time for matching
        if (endMin === 0) {
          classEndMinutes = endTime24 * 60 - 1;
        }
        
        // Check if this is the starting slot of the class
        const slotGroupStart = Math.min(startSlotTime, middleSlotTime, endSlotTime);
        const isStartSlot = classStartMinutes >= slotGroupStart && classStartMinutes <= Math.max(startSlotTime, middleSlotTime, endSlotTime);
        
        // Calculate how many slot groups this class spans
        const allSlots = generateTimeSlots();
        let startSlotIndex = -1;
        let endSlotIndex = -1;
        
        allSlots.forEach((slot, index) => {
          const slotStart = Math.min(
            parseTime(slot.startDisplay),
            parseTime(slot.middleDisplay),
            parseTime(slot.endDisplay)
          );
          const slotEnd = Math.max(
            parseTime(slot.startDisplay),
            parseTime(slot.middleDisplay),
            parseTime(slot.endDisplay)
          );
          
          if (classStartMinutes >= slotStart && classStartMinutes <= slotEnd && startSlotIndex === -1) {
            startSlotIndex = index;
          }
          if (classEndMinutes >= slotStart && classEndMinutes <= slotEnd) {
            endSlotIndex = index;
          }
        });
        
        const rowSpan = startSlotIndex !== -1 && endSlotIndex !== -1 ? (endSlotIndex - startSlotIndex + 1) : 1;
        
        // Adjust end time for display
        let displayEndHour = endHour;
        let displayEndMin = endMin;
        if (endMin === 0) {
          displayEndHour = endHour - 1;
          displayEndMin = 59;
        }
        
        // Create adjusted display time range
        const adjustedEndPeriod = displayEndHour > 12 ? 'PM' : displayEndHour === 12 ? 'PM' : 'AM';
        const displayEndHour12 = displayEndHour > 12 ? displayEndHour - 12 : displayEndHour === 0 ? 12 : displayEndHour;
        
        const adjustedTimeRange = `${startHour}:${startMin.toString().padStart(2, '0')}${startPeriod}-${displayEndHour12}:${displayEndMin.toString().padStart(2, '0')}${adjustedEndPeriod}`;
        
        return {
          type: 'class',
          title: facultyLoad.subject_code || facultyLoad.computed_subject_code || 'Subject',
          room: facultyLoad.computed_room || facultyLoad.room || 'TBA',
          color: 'bg-green-500',
          isStartTime: isStartSlot,
          fullTimeRange: adjustedTimeRange,
          subjectDescription: facultyLoad.subject_description || facultyLoad.computed_subject_description || '',
          section: facultyLoad.section || facultyLoad.computed_section || '',
          lecHours: facultyLoad.lec_hours || facultyLoad.computed_lec_hours || 0,
          labHours: facultyLoad.lab_hours || facultyLoad.computed_lab_hours || 0,
          units: facultyLoad.units || facultyLoad.computed_units || 0,
          rowSpan: rowSpan,
          loadId: facultyLoad.id, // Add load ID for uniqueness
          // Group information
          startTime: timeSlotGroup.startDisplay,
          middleTime: timeSlotGroup.middleDisplay,
          endTime: timeSlotGroup.endDisplay
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
      section_offering_id: null,
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
      // If section_offering_id is provided, backend will derive most data from it
      const payload = {
        faculty_id: selectedFaculty.id,
        type: addSubjectForm.type,
      };

      if (addSubjectForm.section_offering_id) {
        // Link to section offering - backend will derive data
        payload.section_offering_id = addSubjectForm.section_offering_id;
        // Allow overrides for room if needed
        if (addSubjectForm.room) {
          payload.room = addSubjectForm.room;
        }
      } else {
        // Manual entry - provide all fields
        payload.subject_id = null;
        payload.subject_code = addSubjectForm.subjectCode;
        payload.subject_description = addSubjectForm.subjectDescription;
        payload.lec_hours = addSubjectForm.lecHours;
        payload.lab_hours = addSubjectForm.labHours;
        payload.units = addSubjectForm.units;
        payload.section = addSubjectForm.section;
        payload.schedule = addSubjectForm.schedule;
        payload.room = addSubjectForm.room;
        payload.academic_year = academicYear;
        payload.semester = semester;
      }

      const response = await api.post('/faculty-loads', payload);

      // Refetch faculty loads to ensure all schedules are properly loaded and computed
      await fetchFacultySubjects(selectedFaculty);
      
      toast.success(`Subject ${addSubjectForm.subjectCode} added to ${selectedFaculty.fullname}'s load`);
      console.log('Subject added to faculty load:', response.data.data);
      
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


  return ( 
        <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold text-[#064F32] pl-4">
              Faculty Loading
            </h1>
          </div>

    <div className="bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Academic Year and Semester */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Academic Year:</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[100px]"
                  >
                    <option value="2524">2524</option>
                    <option value="2525">2525</option>
                    <option value="2526">2526</option>
                    <option value="2527">2527</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Semester:</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[120px]"
                  >
                    <option value="First">First</option>
                    <option value="Second">Second</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
                <button 
                  onClick={handleSetAcademicYear}
                  className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Set Period
                </button>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <div className="text-xs font-medium text-gray-700">Current Faculty:</div>
                <div className="text-base font-semibold text-green-700">
                  {facultyName || 'No faculty selected'}
                </div>
                {selectedFaculty && (
                  <div className="text-xs text-gray-600 mt-0.5">
                    {selectedFaculty.department || 'N/A'} | {selectedFaculty.email}
                  </div>
                )}
              </div>
            </div>
          </div>


            {/* Faculty Loads Section */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-base font-semibold text-gray-900 mb-3 border-b border-green-500 pb-1 inline-block">
                Setup Faculty Loads
              </h3>

              {/* Faculty Subjects Info */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Faculty Load Summary</h4>
                    <p className="text-xs text-gray-600">
                      {selectedFaculty ? `${selectedFaculty.fullname}` : 'No faculty selected'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{facultyLoads.length}</div>
                    <div className="text-xs text-gray-500">Subjects | {facultyLoads.reduce((sum, load) => sum + (load.units || 0), 0)} units</div>
                  </div>
                </div>
              </div>

              {/* Available Subjects Section */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">Available Subjects</h4>
                  <div className="text-xs text-gray-500">
                    {isLoadingSubjects ? 'Loading...' : `${availableSubjects.length} available`}
                  </div>
                </div>
                
                {/* Program Filter Dropdown */}
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Filter by Program
                    {isLoadingSubjects && (
                      <span className="ml-2 text-xs text-blue-600">
                        <span className="inline-block animate-spin">⟳</span> Loading subjects...
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProgram}
                      onChange={(e) => {
                        const programId = e.target.value;
                        console.log('📌 Program selected:', programId);
                        const program = availablePrograms.find(p => p.id.toString() === programId);
                        console.log('Program details:', program);
                        setSelectedProgram(programId);
                        setSelectedSubject(''); // Reset selected subject when program changes
                      }}
                      disabled={isLoadingPrograms}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
                    >
                      <option value="">
                        {isLoadingPrograms ? 'Loading programs...' : '-- Select a program --'}
                      </option>
                      {availablePrograms.map(program => (
                        <option key={program.id} value={program.id}>
                          {program.program_code} - {program.program_name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {/* Subject Dropdown */}
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={isLoadingSubjects || !selectedProgram}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
                  >
                    <option value="">
                      {!selectedProgram ? 'Please select a program first' :
                       isLoadingSubjects ? 'Loading subjects...' : 
                       availableSubjects.length === 0 ? 'No section offerings available' :
                       '-- Select a subject to view details --'}
                    </option>
                    {availableSubjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.code} - {subject.name} ({subject.units} units) - {subject.year_level} Section {subject.section}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                {/* Selected Subject Details */}
                {selectedSubject && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    {(() => {
                      const subject = availableSubjects.find(s => s.id.toString() === selectedSubject);
                      return subject ? (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="text-sm font-semibold text-green-800">{subject.code}</h5>
                            <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                              subject.type === 'Major' ? 'bg-blue-100 text-blue-800' :
                              subject.type === 'General Education' ? 'bg-green-100 text-green-800' :
                              subject.type === 'Minor' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {subject.type}
                            </span>
                          </div>
                          <p className="text-xs text-green-700 mb-1">{subject.name}</p>
                          <div className="grid grid-cols-3 gap-1 text-xs text-green-600 mb-2">
                            <span>Units: {subject.units}</span>
                            <span>LEC: {subject.lecHours}h</span>
                            <span>LAB: {subject.labHours}h</span>
                            <span>Year: {subject.year_level}</span>
                            <span>Section: {subject.section}</span>
                            <span className={subject.hasSchedules ? 'text-green-600' : 'text-red-600'}>
                              {subject.hasSchedules ? '✓ Scheduled' : '✗ No Schedule'}
                            </span>
                          </div>
                          
                          {/* Display Schedules */}
                          {subject.schedules && subject.schedules.length > 0 && (
                            <div className="mb-2 p-1.5 bg-white rounded border border-green-200">
                              <p className="text-xs font-semibold text-green-800 mb-1">Schedules:</p>
                              <div className="space-y-0.5">
                                {subject.schedules.map((schedule, idx) => (
                                  <div key={idx} className="text-xs text-green-700">
                                    {schedule.day} {schedule.start_time}-{schedule.end_time}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                // Pre-fill the add subject form with selected subject data including section_offering_id
                                setAddSubjectForm({
                                  section_offering_id: subject.section_offering_id || subject.id, // Use section_offering_id from the offering
                                  subjectCode: subject.code,
                                  subjectDescription: subject.name,
                                  lecHours: subject.lecHours,
                                  labHours: subject.labHours,
                                  units: subject.units,
                                  section: subject.year_section || '',
                                  schedule: '', // Will be derived from section offering schedules
                                  room: '',
                                  type: 'Part-time'
                                });
                                setShowAddSubjectModal(true);
                              }}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Assign to Faculty
                            </button>
                            <button
                              onClick={() => setSelectedSubject('')}
                              className="px-3 py-1 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600 transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {!selectedProgram && !isLoadingPrograms && availablePrograms.length > 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                    Select a program to view available section offerings
                  </div>
                )}
              </div>


              {/* Faculty Loads Table */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Code</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">LEC</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">LAB</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Units</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Section</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">No. of Students</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Schedule</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Type</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facultyLoads.map(load => (
                      <tr key={load.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs font-semibold text-blue-900">{load.computed_subject_code || load.subject_code}</td>
                        <td className="px-3 py-2 text-xs text-gray-700">{load.computed_subject_description || load.subject_description}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 text-center">{load.computed_lec_hours || load.lec_hours}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 text-center">{load.computed_lab_hours || load.lab_hours}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 text-center">{load.computed_units || load.units}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700">{load.computed_section || load.section}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 text-center font-semibold">{load.student_count || 0}</td>
                        <td className="px-3 py-2 text-xs text-gray-700">{load.computed_schedule || load.schedule || '-'}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-center">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            load.type === 'Full-time' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {load.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          <div className="flex justify-center gap-1">
                            <button 
                              onClick={() => handleEditSubject(load)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeSubject(load.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {loading ? (
                      <tr>
                        <td colSpan={10} className="px-3 py-6 text-center">
                          <div className="flex flex-col items-center text-gray-500">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mb-1"></div>
                            <p className="text-xs">Loading...</p>
                          </div>
                        </td>
                      </tr>
                    ) : facultyLoads.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-3 py-6 text-center">
                          <div className="flex flex-col items-center text-gray-500">
                            <User className="w-6 h-6 mb-1 opacity-50" />
                            <p className="text-xs">No subjects assigned</p>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timetable Section */}
            <div className="bg-gray-50 rounded-lg p-3 mt-3">
              <h3 className="text-base font-semibold text-gray-900 mb-3 border-b border-green-500 pb-1 inline-block">
                Weekly Schedule
              </h3>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="bg-green-600 text-white px-2 py-1.5 text-xs font-semibold text-center border border-gray-300">
                          Time
                        </th>
                        {days.map(day => (
                          <th key={day} className="bg-green-600 text-white px-2 py-1.5 text-xs font-semibold text-center border border-gray-300">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Track rendered classes across all rows
                        const renderedClasses = new Set();
                        
                        return timeSlots.map((slotGroup, slotIndex) => (
                          <tr key={slotGroup.groupIndex}>
                            {/* Time label - grouped display */}
                            <td className="bg-gray-100 text-xs text-center font-semibold text-gray-700 border border-gray-300 min-h-[60px] w-20">
                              <div className="flex flex-col justify-center h-full py-1">
                                <div className="text-xs opacity-70">{slotGroup.startDisplay}</div>
                                <div className="text-xs font-bold text-gray-800">{slotGroup.middleDisplay}</div>
                                <div className="text-xs opacity-70">{slotGroup.endDisplay}</div>
                              </div>
                            </td>
                            {/* Day slots */}
                            {days.map(day => {
                              // Check all faculty loads to find matching schedules for this day and time slot
                              const matchingLoads = facultyLoads.filter(load => {
                                const scheduleToCheck = load.computed_schedule || load.schedule || '';
                                if (!scheduleToCheck) return false;
                                
                                const schedule = scheduleToCheck.toUpperCase();
                                const dayUpper = day.toUpperCase();
                                
                                // Split schedule by commas to handle multiple schedules
                                const scheduleStrings = schedule.split(',').map(s => s.trim());
                                
                                // Check each schedule string for day and time match
                                for (const scheduleStr of scheduleStrings) {
                                  // Check day match for this specific schedule string
                                  const dayMatches = 
                                    scheduleStr.includes(dayUpper) ||
                                    (dayUpper.includes('MON') && scheduleStr.includes('MON & TUE')) ||
                                    (dayUpper.includes('TUE') && scheduleStr.includes('MON & TUE')) ||
                                    (dayUpper.includes('WED') && scheduleStr.includes('WED & THU')) ||
                                    (dayUpper.includes('THU') && scheduleStr.includes('WED & THU')) ||
                                    (dayUpper.includes('FRI') && scheduleStr.includes('FRI & SAT')) ||
                                    (dayUpper.includes('SAT') && scheduleStr.includes('FRI & SAT')) ||
                                    (dayUpper.includes('MON') && scheduleStr.includes('M/W/F')) ||
                                    (dayUpper.includes('WED') && scheduleStr.includes('M/W/F')) ||
                                    (dayUpper.includes('FRI') && scheduleStr.includes('M/W/F')) ||
                                    (dayUpper.includes('TUE') && scheduleStr.includes('T/TH')) ||
                                    (dayUpper.includes('THU') && scheduleStr.includes('T/TH')) ||
                                    (dayUpper.includes('MON') && scheduleStr.includes('M/T/W/TH/F')) ||
                                    (dayUpper.includes('TUE') && scheduleStr.includes('M/T/W/TH/F')) ||
                                    (dayUpper.includes('WED') && scheduleStr.includes('M/T/W/TH/F')) ||
                                    (dayUpper.includes('THU') && scheduleStr.includes('M/T/W/TH/F')) ||
                                    (dayUpper.includes('FRI') && scheduleStr.includes('M/T/W/TH/F'));
                                  

                                  if (!dayMatches) continue; // Try next schedule string
                                  
                                  // Check time overlap for this specific schedule
                                  const timeMatch = scheduleStr.match(/(\d{1,2}):?(\d{2})?(AM|PM)\s*-\s*(\d{1,2}):?(\d{2})?(AM|PM)/i);
                                  if (!timeMatch) continue; // Try next schedule string
                                  
                                  const startHour = parseInt(timeMatch[1]);
                                  const startMin = parseInt(timeMatch[2] || '0');
                                  const startPeriod = timeMatch[3].toUpperCase();
                                  const endHour = parseInt(timeMatch[4]);
                                  let endMin = parseInt(timeMatch[5] || '0');
                                  const endPeriod = timeMatch[6].toUpperCase();
                                  
                                  
                                  let startTime24 = startHour;
                                  if (startPeriod === 'PM' && startHour !== 12) startTime24 += 12;
                                  if (startPeriod === 'AM' && startHour === 12) startTime24 = 0;
                                  
                                  let endTime24 = endHour;
                                  if (endPeriod === 'PM' && endHour !== 12) endTime24 += 12;
                                  if (endPeriod === 'AM' && endHour === 12) endTime24 = 0;
                                  
                                  const startMinutes = startTime24 * 60 + startMin;
                                  let endMinutes = endTime24 * 60 + endMin;
                                  if (endMin === 0) {
                                    endMinutes = endTime24 * 60 - 1;
                                  }
                                  
                                  const startSlotTime = parseTime(slotGroup.startDisplay);
                                  const middleSlotTime = parseTime(slotGroup.middleDisplay);
                                  const endSlotTime = parseTime(slotGroup.endDisplay);
                                  const slotGroupStart = Math.min(startSlotTime, middleSlotTime, endSlotTime);
                                  const slotGroupEnd = Math.max(startSlotTime, middleSlotTime, endSlotTime);
                                  
                                  // If this schedule matches the day and overlaps with the time slot, return true
                                  if (slotGroupStart <= endMinutes && slotGroupEnd >= startMinutes) {
                                    return true;
                                  }
                                }
                                
                                return false; // No matching schedule found
                              });
                              
                              // Get schedule info for each matching load
                              const scheduleInfos = matchingLoads
                                .map(load => getScheduleForTimeSlot(day, slotGroup, load.id))
                                .filter(Boolean);
                              
                              // Find the first schedule that hasn't been rendered yet
                              const scheduleInfo = scheduleInfos.find(info => {
                                const classKey = `${day}-${info.loadId || info.title}-${info.fullTimeRange}-${info.section}`;
                                return info.isStartTime && !renderedClasses.has(classKey);
                              });
                              
                              if (!scheduleInfo) {
                                // Check if any matching loads are continuations (already rendered)
                                const isContinuation = scheduleInfos.some(info => {
                                  const classKey = `${day}-${info.loadId || info.title}-${info.fullTimeRange}-${info.section}`;
                                  return !info.isStartTime || renderedClasses.has(classKey);
                                });
                                
                                if (isContinuation) {
                                  return null; // Continuation, handled by rowSpan
                                }
                                
                                // Empty slot
                                return (
                                  <td
                                    key={`${day}-${slotGroup.groupIndex}`}
                                    className="p-0.5 border border-gray-300 cursor-pointer transition-all duration-150 bg-white hover:bg-gray-50 min-h-[60px]"
                                  >
                                  </td>
                                );
                              }
                              
                              const classKey = `${day}-${scheduleInfo.loadId || scheduleInfo.title}-${scheduleInfo.fullTimeRange}-${scheduleInfo.section}`;
                              renderedClasses.add(classKey);
                              
                              return (
                                <td
                                  key={`${day}-${slotGroup.groupIndex}-${classKey}`}
                                  rowSpan={scheduleInfo.rowSpan || 1}
                                  className="p-0 border border-gray-400 cursor-pointer transition-all duration-150 hover:opacity-90 hover:shadow-md align-top"
                                >
                                  <div 
                                    className={`${scheduleInfo.color} text-white p-1.5 text-xs text-center shadow w-full h-full flex flex-col justify-center border border-gray-300`}
                                    style={{ minHeight: `${(scheduleInfo.rowSpan || 1) * 60}px` }}
                                  >
                                    <div className="font-semibold truncate text-xs" title={scheduleInfo.title}>
                                      {scheduleInfo.title}
                                    </div>
                                    <div className="text-xs opacity-90 truncate mt-0.5" title={scheduleInfo.subjectDescription}>
                                      {scheduleInfo.subjectDescription}
                                    </div>
                                    <div className="text-xs opacity-80 mt-0.5">
                                      {scheduleInfo.section} • {scheduleInfo.room}
                                    </div>
                                    <div className="text-xs opacity-75 mt-0.5">
                                      {scheduleInfo.fullTimeRange}
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Timetable Legend */}
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Faculty Classes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                  <span className="text-gray-600">Available Slots</span>
                </div>
              </div>
            </div>

          {/* Footer Actions */}
          <div className="bg-white rounded-lg p-3 shadow-sm mt-3">
            <div className="flex justify-center">
              <button 
                onClick={handlePrintForm}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors gap-2"
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
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-base font-semibold text-gray-900">Add Subject to Faculty Load</h3>
                <button
                  onClick={closeAddSubjectModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleAddSubjectToFaculty} className="p-4">
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Faculty:</strong> {selectedFaculty?.fullname} | 
                    <strong> AY:</strong> {academicYear} | 
                    <strong> Sem:</strong> {semester}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSubjectForm.subjectCode}
                      onChange={(e) => handleAddSubjectFormChange('subjectCode', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., CS 101"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSubjectForm.subjectDescription}
                      onChange={(e) => handleAddSubjectFormChange('subjectDescription', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Subject description"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      LEC Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addSubjectForm.lecHours}
                      onChange={(e) => handleAddSubjectFormChange('lecHours', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      LAB Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addSubjectForm.labHours}
                      onChange={(e) => handleAddSubjectFormChange('labHours', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Units *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={addSubjectForm.units}
                      onChange={(e) => handleAddSubjectFormChange('units', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Year & Section *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSubjectForm.section}
                      onChange={(e) => handleAddSubjectFormChange('section', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., BSIT 4A"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Schedule * (from Section Offering)
                    </label>
                    <input
                      type="text"
                      required
                      value={addSubjectForm.schedule}
                      readOnly
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-gray-100 cursor-not-allowed text-gray-700"
                      placeholder="Auto-filled from section offering"
                    />
                    <p className="text-xs text-gray-500 mt-0.5">
                      Schedule is automatically taken from the selected section offering.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Room *
                    </label>
                    <input
                      type="text"
                      required
                      value={addSubjectForm.room}
                      onChange={(e) => handleAddSubjectFormChange('room', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., ROOM 303"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
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
                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeAddSubjectModal}
                    className="px-4 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
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
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-base font-semibold text-gray-900">{modalTitle}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubjectSubmit} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.subjectCode}
                      onChange={(e) => handleSubjectFormChange('subjectCode', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., CS 101"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.subjectDescription}
                      onChange={(e) => handleSubjectFormChange('subjectDescription', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Subject description"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      LEC Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subjectForm.lecHours}
                      onChange={(e) => handleSubjectFormChange('lecHours', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      LAB Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subjectForm.labHours}
                      onChange={(e) => handleSubjectFormChange('labHours', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Units *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={subjectForm.units}
                      onChange={(e) => handleSubjectFormChange('units', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Year & Section *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.section}
                      onChange={(e) => handleSubjectFormChange('section', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., BSIT 4A"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Schedule *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.schedule}
                      onChange={(e) => handleSubjectFormChange('schedule', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., MONDAY 9:00AM-1:00PM"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Room *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.room}
                      onChange={(e) => handleSubjectFormChange('room', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., ROOM 303"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={subjectForm.type}
                      onChange={(e) => handleSubjectFormChange('type', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Part-time">Part-time</option>
                      <option value="Full-time">Full-time</option>
                    </select>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Subject
                  </button>
                </div>
              </form>
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
