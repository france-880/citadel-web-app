import { Fragment, useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { useAuth } from "../Context/AuthContext";
import api from "../api/axios";

export default function Schedule() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
  const [facultyLoads, setFacultyLoads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState('2024');
  const [semester, setSemester] = useState('First');

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
      console.log('Faculty loads data:', response.data);
      
      // Debug: Log each schedule to verify format
      response.data?.forEach(load => {
        console.log(`Schedule: ${load.subject_code} - ${load.schedule} - ${load.section}`);
      });
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

  // Fetch faculty loads when component mounts or when academic year/semester changes
  useEffect(() => {
    if (user?.role === 'prof') {
      fetchFacultyLoads();
    }
  }, [user?.id, academicYear, semester]);

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
  const getScheduleForTimeSlot = (day, timeSlotGroup) => {
    // Check if any of the three times in the group match
    const startSlotTime = parseTime(timeSlotGroup.startDisplay);
    const middleSlotTime = parseTime(timeSlotGroup.middleDisplay);
    const endSlotTime = parseTime(timeSlotGroup.endDisplay);

    // Check faculty loads
    const facultyLoad = facultyLoads.find(load => {
      if (!load.schedule) {
        return false;
      }
      
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
        if (endMin === 0) {
          endTime24 = endTime24 - 1;
          endMin = 59;
        }
        
        const startMinutes = startTime24 * 60 + startMin;
        const endMinutes = endTime24 * 60 + endMin;
        
        // For multi-hour classes like 7AM-10AM, we need to check if this hour slot overlaps
        // Each time slot represents a full hour (e.g., 7:00-7:59)
        const slotStartMinutes = Math.min(startSlotTime, middleSlotTime, endSlotTime);
        const slotEndMinutes = Math.max(startSlotTime, middleSlotTime, endSlotTime);
        
        // Check if the time slot overlaps with the class time
        // For a class 7AM-10AM (420-600 minutes), it should show in slots:
        // 7:00-7:59 (420-479 minutes) - YES
        // 8:00-8:59 (480-539 minutes) - YES  
        // 9:00-9:59 (540-599 minutes) - YES
        const isInRange = (slotStartMinutes < endMinutes && slotEndMinutes > startMinutes);
        
        return isInRange;
      }
      
      return false;
    });

    if (facultyLoad) {
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
        
        // Adjust end time for display
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

  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-0'}`}>
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
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-[var(--brand-100)] text-left">
                    <th className="p-2">Time</th>
                    <th className="p-2">Subject/Course</th>
                    <th className="p-2">Room</th>
                    <th className="p-2">Section</th>
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
                        <td className="p-2">{load.schedule || 'TBA'}</td>
                        <td className="p-2">
                          <div>
                            <div className="font-semibold">{load.subject_code}</div>
                            <div className="text-xs text-gray-600">{load.subject_description}</div>
                          </div>
                        </td>
                        <td className="p-2">{load.room || 'TBA'}</td>
                        <td className="p-2">{load.section}</td>
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
          </div>
        </main>
      </div>
    </div>
  );
}
