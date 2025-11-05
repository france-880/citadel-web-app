import { Fragment, useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { useAuth } from "../Context/AuthContext";
import api from "../api/axios";

export default function Schedule() {
  const { user } = useAuth();
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
  const hasFetchedRef = useRef(false); // Track if we've already fetched to prevent clearing on user changes

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  // Fetch professor's faculty loads - defined as regular function to avoid dependency issues
  const fetchFacultyLoads = async () => {
    const currentUserId = user?.id;
    const currentRole = user?.role;
    const currentAcademicYear = academicYear || '2024';
    const currentSemester = semester || 'First';
    
    if (!currentUserId || currentRole !== 'prof') {
      console.log('Skipping fetch - user not ready:', { id: currentUserId, role: currentRole });
      return;
    }
    
    // Prevent clearing existing data while fetching
    setLoading(true);
    try {
      // First try with the current academic year and semester
      let response = await api.get(`/faculty-loads/${currentUserId}`, {
        params: {
          academic_year: currentAcademicYear,
          semester: currentSemester
        }
      });
      
      let loads = response.data || [];
      
      // If no loads found, try multiple academic year/semester combinations in parallel
      if (loads.length === 0) {
        // Try most common combinations first (limit to avoid too many requests)
        const combinationsToTry = [
          ['2024', 'First'],
          ['2526', 'First'],
          ['2024', 'Second'],
          ['2526', 'Second'],
          ['2025', 'First'],
        ];
        
        const allLoads = [];
        const loadIds = new Set();

        // Make parallel requests - all execute simultaneously
        const requests = combinationsToTry.map(([year, sem]) =>
          api.get(`/faculty-loads/${currentUserId}`, {
            params: {
              academic_year: year,
              semester: sem
            }
          }).then(tryResponse => {
            const tryLoads = tryResponse.data || [];
            for (const load of tryLoads) {
              if (load.id && !loadIds.has(load.id)) {
                allLoads.push(load);
                loadIds.add(load.id);
              }
            }
            return tryLoads.length;
          }).catch(() => 0) // Ignore errors, return 0
        );

        // Wait for all requests to complete (execute in parallel)
        await Promise.allSettled(requests);
        
        if (allLoads.length > 0) {
          loads = allLoads;
          console.log(`Found ${loads.length} subjects across multiple academic years/semesters`);
        }
      }
      
      console.log(`Loaded ${loads.length} subjects for professor ${user?.fullname || 'Unknown'}`);
      console.log('Faculty loads data:', loads);
      
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
      
      // Debug: Log each schedule to verify format
      loads.forEach(load => {
        console.log(`Schedule: ${load.computed_subject_code || load.subject_code}`, {
          schedule: load.schedule,
          computed_schedule: load.computed_schedule,
          section_offering_id: load.section_offering_id
        });
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
    
    // Set defaults if not in sessionStorage
    if (storedAcademicYear) {
      setAcademicYear(storedAcademicYear);
    } else {
      setAcademicYear('2024'); // Default fallback
    }
    if (storedSemester) {
      setSemester(storedSemester);
    } else {
      setSemester('First'); // Default fallback
    }
  }, []);

  // Track previous values to prevent unnecessary re-fetches
  const prevUserIdRef = useRef(null);
  const prevAcademicYearRef = useRef(null);
  const prevSemesterRef = useRef(null);

  // Fetch faculty loads when component mounts or when dependencies change
  useEffect(() => {
    // Early return if user is not ready yet - don't clear data during loading
    if (!user) {
      console.log('User not loaded yet - keeping existing data');
      return;
    }

    // Only proceed if we have all required data
    // Use defaults if academicYear or semester are not set
    const effectiveAcademicYear = academicYear || '2024';
    const effectiveSemester = semester || 'First';
    
    if (!user.id || !user.role) {
      console.log('Waiting for user:', { 
        hasUserId: !!user.id, 
        hasRole: !!user.role
      });
      return;
    }

    // Only fetch if user is a prof
    if (user.role === 'prof') {
      // Only fetch if something actually changed
      const userIdChanged = prevUserIdRef.current !== user.id;
      const academicYearChanged = prevAcademicYearRef.current !== effectiveAcademicYear;
      const semesterChanged = prevSemesterRef.current !== effectiveSemester;
      const shouldFetch = userIdChanged || academicYearChanged || semesterChanged || !hasFetchedRef.current;
      
      if (shouldFetch) {
        console.log('Fetching faculty loads with:', { 
          userId: user.id, 
          academicYear: effectiveAcademicYear, 
          semester: effectiveSemester,
          userIdChanged,
          academicYearChanged,
          semesterChanged,
          hasFetched: hasFetchedRef.current
        });
        
        // Temporarily update state for fetch if needed
        if (!academicYear) setAcademicYear(effectiveAcademicYear);
        if (!semester) setSemester(effectiveSemester);
        
        fetchFacultyLoads();
        hasFetchedRef.current = true;
        
        // Update refs IMMEDIATELY to prevent duplicate fetches
        prevUserIdRef.current = user.id;
        prevAcademicYearRef.current = effectiveAcademicYear;
        prevSemesterRef.current = effectiveSemester;
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
  }, [user?.id, user?.role, academicYear || '2024', semester || 'First']);

  // Generate time slots for timetable - each slot represents a full hour
  const generateTimeSlots = () => {
    const groupedSlots = [];
    let groupIndex = 0;
    
    for (let hour = 7; hour <= 21; hour++) {
      // Skip 9:30 PM slot
      if (hour === 21) {
        continue;
      }
      
      // Create times for the full hour (00:00, 00:30, 00:59)
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
        groupIndex: groupIndex++,
        hour: hour // Add hour for easier debugging
      });
    }
    
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

  // Helper function to check if a time slot group should show a schedule
  const getScheduleForTimeSlot = (day, timeSlotGroup, facultyLoadId = null) => {
    // Check if any of the three times in the group match
    const startSlotTime = parseTime(timeSlotGroup.startDisplay);
    const middleSlotTime = parseTime(timeSlotGroup.middleDisplay);
    const endSlotTime = parseTime(timeSlotGroup.endDisplay);

    // Check faculty loads - if facultyLoadId is provided, only check that specific load
    // Otherwise, find the first matching load
    const facultyLoad = facultyLoadId 
      ? facultyLoads.find(load => load.id === facultyLoadId)
      : facultyLoads.find(load => {
      // Use computed_schedule if available (from section offering), otherwise use schedule
      const scheduleToCheck = load.computed_schedule || load.schedule || '';
      
      if (!scheduleToCheck) {
        return false;
      }
      
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
        if (endMin === 0) {
          endMinutes = endTime24 * 60 - 1; // End at :59 of previous hour
        }
        
        // Check if the slot group overlaps with the class time range
        const slotGroupStart = Math.min(startSlotTime, middleSlotTime, endSlotTime);
        const slotGroupEnd = Math.max(startSlotTime, middleSlotTime, endSlotTime);
        
        // Check if slot group overlaps with class time
        const isInRange = 
          // Any slot time is within class range [startMinutes, endMinutes]
          (startSlotTime >= startMinutes && startSlotTime <= endMinutes) ||
          (middleSlotTime >= startMinutes && middleSlotTime <= endMinutes) ||
          (endSlotTime >= startMinutes && endSlotTime <= endMinutes) ||
          // Slot group hour overlaps with class (class starts before slot ends AND class ends after slot starts)
          (slotGroupStart <= endMinutes && slotGroupEnd >= startMinutes);
        
        return isInRange;
      }
      
      return false;
    });

    if (facultyLoad) {
      const subjectCode = facultyLoad.subject_code || facultyLoad.computed_subject_code || 'Subject';
      
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
          loadId: facultyLoad.id,
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

  return (
    <div className={`flex content_padding ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />

        <main className="p-6 min-h-screen">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-[#064F32]">Professor Schedule</h1>
              <p className="text-sm text-gray-600">Academic Year {academicYear} - {semester} Semester</p>
            </div>
            {loading && (
              <div className="text-sm text-blue-600">Loading schedule...</div>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
          {/* Schedule Section */}
            <div className="bg-white rounded-lg shadow p-2 md:p-3">
            <div className="text-sm text-slate-500 mb-2">Schedule</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm table-fixed">
                <thead>
                  <tr className="bg-[#064F32]/10 text-[#064F32]">
                    <th className="p-2 text-center" style={{ width: '290px' }}>Time</th>
                    <th className="p-2 text-center">Subject/Course</th>
                    <th className="p-2 text-center">Room</th>
                    <th className="p-2 text-center">Section</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        Loading schedule...
                      </td>
                    </tr>
                  ) : facultyLoads.length > 0 ? (
                    facultyLoads.map((load, index) => (
                      <tr key={load.id || index} className="border-t">
                        <td className="p-2 text-center" style={{ width: '290px' }}>{load.computed_schedule || load.schedule || 'TBA'}</td>
                        <td className="p-2 text-center">
                          <div>
                            <div className="font-semibold">{load.computed_subject_code || load.subject_code}</div>
                            <div className="text-xs text-gray-600">{load.computed_subject_description || load.subject_description}</div>
                          </div>
                        </td>
                        <td className="p-2 text-center">{load.computed_room || load.room || 'TBA'}</td>
                        <td className="p-2 text-center">{load.computed_section || load.section}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No schedule found for this semester
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>

          {/* Weekly Schedule Overview Section */}
            <div className="bg-gray-50 rounded-lg">
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
                      {(() => {
                        // Track rendered classes across all rows - use load ID to ensure uniqueness
                        const renderedClasses = new Set();
                        
                        return timeSlots.map((slotGroup, slotIndex) => (
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
                                    className="p-1 border border-gray-400 cursor-pointer transition-all duration-150 bg-white hover:bg-gray-50 hover:shadow-sm min-h-[80px]"
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
                                    className={`${scheduleInfo.color} text-white p-2 rounded-lg text-xs text-center shadow-lg w-full h-full flex flex-col justify-center border border-gray-300`}
                                    style={{ minHeight: `${(scheduleInfo.rowSpan || 1) * 80}px` }}
                                  >
                                    <div className="font-semibold truncate" title={scheduleInfo.title}>
                                      {scheduleInfo.title}
                                    </div>
                                    <div className="text-xs opacity-90 truncate mt-0.5" title={scheduleInfo.subjectDescription}>
                                      {scheduleInfo.subjectDescription}
                                    </div>
                                    <div className="text-xs opacity-80 font-medium mt-0.5">
                                      {scheduleInfo.section} • {scheduleInfo.room}
                                    </div>
                                    <div className="text-xs opacity-75 mt-0.5">
                                      {scheduleInfo.fullTimeRange}
                                    </div>
                                    {scheduleInfo.type === 'class' && (
                                      <div className="text-xs opacity-70 mt-1">
                                        LEC: {scheduleInfo.lecHours}h • LAB: {scheduleInfo.labHours}h • Units: {scheduleInfo.units}
                                      </div>
                                    )}
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
          </div>
        </main>
      </div>
    </div>
  );
}
