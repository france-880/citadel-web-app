import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

          import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar,
  X,
  Save,
  FileText
} from 'lucide-react';

const FacultyLoadSystem = () => {
  const [activeTab, setActiveTab] = useState('facultyLoad');
  const [academicYear, setAcademicYear] = useState('2024');
  const [semester, setSemester] = useState('First');
  const [facultyName] = useState('JOBLE, JAYSON P (339)');
  
  // Office Hours State
  const [officeHours, setOfficeHours] = useState([]);
  const [officeHourForm, setOfficeHourForm] = useState({
    description: '',
    room: '',
    selectedDays: [],
    dayDropdown: '',
    fromTime: '1',
    fromMinutes: '00',
    fromPeriod: 'AM',
    toTime: '2',
    toMinutes: '00',
    toPeriod: 'AM',
    comments: '',
    hours: 0
  });

  // Faculty Loads State
  const [facultyLoads, setFacultyLoads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    employeeStatus: 'All',
    campus: 'All',
    mode: 'All',
    creditedUnits: 0,
    loadHours: 0
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

  // Timetable State
  const [timetable, setTimetable] = useState({});

  // Generate time slots for timetable
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = hour > 12 
          ? `${(hour - 12).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} PM`
          : hour === 12
          ? `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} PM`
          : `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} AM`;
        slots.push({ time, displayTime });
      }
    }
    return slots;
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
      'Monday': 'M',
      'Tuesday': 'T', 
      'Wednesday': 'W',
      'Thursday': 'TH',
      'Friday': 'F',
      'Saturday': 'S',
      'Sunday': 'SUN'
    };
    return dayMap[dayName] || dayName;
  };

  // Helper function to check if a time slot should show a schedule
  const getScheduleForTimeSlot = (day, timeSlot) => {
    const dayAbbr = getDayAbbreviation(day);
    const slotTime = parseTime(timeSlot.displayTime);
    
    // Check office hours
    const officeHour = officeHours.find(oh => {
      if (!oh.timeAndDate) return false;
      
      // Check if day is in the timeAndDate string
      const dayMatches = oh.timeAndDate.includes(dayAbbr);
      if (!dayMatches) return false;
      
      try {
        // Extract time range (e.g., "1:00 PM - 4:00 PM")
        const timeRange = oh.timeAndDate.match(/(\d{1,2}:\d{2} [AP]M) - (\d{1,2}:\d{2} [AP]M)/);
        if (!timeRange) return false;
        
        const startTime = parseTime(timeRange[1]);
        const endTime = parseTime(timeRange[2]);
        
        // Show on the exact start time slot only
        return slotTime === startTime;
      } catch (e) {
        return false;
      }
    });

    if (officeHour) {
      return {
        type: 'office',
        title: officeHour.description || 'Office Hours',
        room: officeHour.room || 'Office',
        color: 'bg-blue-500'
      };
    }

    // Check faculty loads
    const facultyLoad = facultyLoads.find(load => {
      if (!load.schedule) return false;
      
      // Check if day is mentioned in schedule
      const dayMatches = load.schedule.toLowerCase().includes(day.toLowerCase().substring(0, 3));
      if (!dayMatches) return false;
      
      try {
        // Try to parse time from schedule (e.g., "M/W 9:00AM-10:30AM")
        const timeMatch = load.schedule.match(/(\d{1,2}:\d{2}[AP]M)-(\d{1,2}:\d{2}[AP]M)/i);
        if (timeMatch) {
          const startTime = parseTime(timeMatch[1].replace(/(\d{1,2}:\d{2})([AP]M)/i, '$1 $2'));
          
          // Show on the exact start time slot only
          return slotTime === startTime;
        }
        
        // If no specific time, don't show
        return false;
      } catch (e) {
        return false;
      }
    });

    if (facultyLoad) {
      return {
        type: 'class',
        title: facultyLoad.subjectCode || 'Subject',
        room: facultyLoad.room || 'TBA',
        color: 'bg-green-500'
      };
    }

    return null;
  };

  const timeSlots = generateTimeSlots();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Button functionality handlers
  const handleSetAcademicYear = () => {
    // Here you can add logic to save the academic year and semester
    console.log('Setting Academic Year:', academicYear, 'Semester:', semester);
    // You might want to show a success message or update some state
    alert(`Academic Year ${academicYear} and ${semester} semester has been set successfully!`);
  };

  const handleSearchSubjects = () => {
    // Enhanced search functionality
    console.log('Searching for:', searchQuery);
    console.log('Filters applied:', filters);
    
    // You can add more complex search logic here
    // For example, filtering by multiple criteria
    const searchResults = facultyLoads.filter(load => {
      const matchesSearch = load.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           load.subjectDescription.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilters = (
        (filters.employeeStatus === 'All' || load.type === filters.employeeStatus) &&
        (filters.campus === 'All' || load.campus === filters.campus) &&
        (filters.mode === 'All' || load.mode === filters.mode)
      );
      
      return matchesSearch && matchesFilters;
    });
    
    console.log('Search results:', searchResults);
    // You could update a separate state for search results
  };

  const handleEditSubject = (subject) => {
    console.log('Editing subject:', subject);
    
    // Set the form data to the subject being edited
    setSubjectForm({
      subjectCode: subject.subjectCode,
      subjectDescription: subject.subjectDescription,
      lecHours: subject.lecHours,
      labHours: subject.labHours,
      units: subject.units,
      section: subject.section,
      schedule: subject.schedule,
      room: subject.room,
      type: subject.type
    });
    
    // Set modal title and show modal
    setModalTitle('Edit Subject');
    setShowModal(true);
    
    // Store the subject ID for updating
    setSubjectForm(prev => ({ ...prev, id: subject.id }));
  };

  const handlePrintForm = () => {
    console.log('Printing Faculty Assignment Form');
    
    // Create a print-friendly version of the data
    const printData = {
      faculty: facultyName,
      academicYear: academicYear,
      semester: semester,
      officeHours: officeHours,
      facultyLoads: facultyLoads
    };
    
    console.log('Print data:', printData);
    
    // You can implement actual printing logic here
    // For now, we'll just show an alert
    alert('Print functionality would open a print dialog with the faculty assignment form');
    
    // Alternative: Open a new window with printable content
    // const printWindow = window.open('', '_blank');
    // printWindow.document.write(/* HTML content for printing */);
    // printWindow.print();
  };

  const handleViewHistory = () => {
    console.log('Viewing faculty loading history');
    
    // You can implement history viewing logic here
    // This might open a modal or navigate to a history page
    alert('History viewing functionality - this would show past faculty assignments');
    
    // Example of what you might do:
    // setShowHistoryModal(true);
    // fetchFacultyHistory();
  };

  // Handle office hours form changes
  const handleOfficeHourChange = (field, value) => {
    setOfficeHourForm(prev => ({ ...prev, [field]: value }));
  };

  // Add office hours
  const addOfficeHours = () => {
    // Validate that at least one day is selected
    if (officeHourForm.selectedDays.length === 0) {
      alert('Please select at least one day for the office hours.');
      return;
    }

    // Validate that description is provided
    if (!officeHourForm.description.trim()) {
      alert('Please provide a description for the office hours.');
      return;
    }

    const timeString = `${officeHourForm.fromTime}:${officeHourForm.fromMinutes} ${officeHourForm.fromPeriod} - ${officeHourForm.toTime}:${officeHourForm.toMinutes} ${officeHourForm.toPeriod}`;
    const daysString = officeHourForm.selectedDays.join(', ');
    
    const newOfficeHour = {
      id: Date.now(),
      description: officeHourForm.description,
      timeAndDate: `${daysString} ${timeString}`,
      room: officeHourForm.room || 'Not specified',
      hours: officeHourForm.hours
    };

    setOfficeHours(prev => [...prev, newOfficeHour]);
    
    // Show success message
    console.log('Office hours added successfully:', newOfficeHour);
    
    // Reset form
    setOfficeHourForm({
      description: '',
      room: '',
      selectedDays: [],
      dayDropdown: '',
      fromTime: '1',
      fromMinutes: '00',
      fromPeriod: 'AM',
      toTime: '2',
      toMinutes: '00',
      toPeriod: 'AM',
      comments: '',
      hours: 0
    });
  };

  // Handle subject form changes
  const handleSubjectFormChange = (field, value) => {
    setSubjectForm(prev => ({ ...prev, [field]: value }));
  };

  // Add or edit subject
  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    
    if (subjectForm.id) {
      // Edit existing subject
      setFacultyLoads(prev => prev.map(load => 
        load.id === subjectForm.id ? { ...subjectForm } : load
      ));
      console.log('Subject updated:', subjectForm);
    } else {
      // Add new subject
      const newSubject = {
        id: Date.now(),
        ...subjectForm
      };
      setFacultyLoads(prev => [...prev, newSubject]);
      console.log('New subject added:', newSubject);
    }
    
    setShowModal(false);
    
    // Reset form
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
    
    // Reset modal title
    setModalTitle('Add Subject');
  };

  // Remove subject
  const removeSubject = (id) => {
    setFacultyLoads(prev => prev.filter(subject => subject.id !== id));
  };

  // Filter faculty loads
  const filteredFacultyLoads = facultyLoads.filter(load => {
    return load.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
           load.subjectDescription.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return ( 
        <div className="flex content_padding">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6 min-h-screen">

    <div className="min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('facultyLoad')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'facultyLoad'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Faculty Load
              </button>
              <button
                onClick={() => setActiveTab('facultyLoading')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'facultyLoading'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Faculty Loading
              </button>
            </nav>
          </div>

          {/* Academic Year and Semester - Better Balanced */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mx-6 mt-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Academic Year:</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[100px]"
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
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
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <div className="text-sm font-medium text-gray-700">Current Faculty:</div>
                <div className="text-lg font-semibold text-green-700">{facultyName}</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Office/Consultation Hours Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b-2 border-green-500 pb-2 inline-block">
                Setup Office / Consultation Hours
              </h3>
              
              {/* Office Hours Form - Better Balanced Layout */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Description */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={officeHourForm.description}
                      onChange={(e) => handleOfficeHourChange('description', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter description"
                    />
                  </div>
                  
                  {/* Room */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                    <select
                      value={officeHourForm.room}
                      onChange={(e) => handleOfficeHourChange('room', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">-select room-</option>
                      <option value="ROOM 303-N">ROOM 303-N</option>
                      <option value="ROOM 401-N">ROOM 401-N</option>
                      <option value="BLENDED">BLENDED</option>
                    </select>
                  </div>

                  {/* Hours */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                    <input
                      type="number"
                      value={officeHourForm.hours}
                      onChange={(e) => handleOfficeHourChange('hours', parseFloat(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      min="0"
                      step="0.5"
                      placeholder="0.0"
                    />
                  </div>

                  {/* Days Selection */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Days</label>
                    <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {['M', 'T', 'W', 'TH', 'F', 'S', 'SUN'].map(day => (
                        <label key={day} className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={officeHourForm.selectedDays.includes(day)}
                            onChange={(e) => {
                              const value = day;
                              const updatedDays = officeHourForm.selectedDays.includes(value)
                                ? officeHourForm.selectedDays.filter(d => d !== value)
                                : [...officeHourForm.selectedDays, value];
                              setOfficeHourForm(prev => ({ ...prev, selectedDays: updatedDays }));
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                    {officeHourForm.selectedDays.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Selected: </span>
                        <span className="text-xs font-medium text-green-600">
                          {officeHourForm.selectedDays.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Time Selection */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="grid grid-cols-2 gap-3">
                        {/* From Time */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                          <div className="flex items-center space-x-1">
                            <select
                              value={officeHourForm.fromTime}
                              onChange={(e) => handleOfficeHourChange('fromTime', e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            >
                              {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                            <select
                              value={officeHourForm.fromMinutes}
                              onChange={(e) => handleOfficeHourChange('fromMinutes', e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            >
                              <option value="00">00</option>
                              <option value="15">15</option>
                              <option value="30">30</option>
                              <option value="45">45</option>
                            </select>
                            <select
                              value={officeHourForm.fromPeriod}
                              onChange={(e) => handleOfficeHourChange('fromPeriod', e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>

                        {/* To Time */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                          <div className="flex items-center space-x-1">
                            <select
                              value={officeHourForm.toTime}
                              onChange={(e) => handleOfficeHourChange('toTime', e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            >
                              {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                            <select
                              value={officeHourForm.toMinutes}
                              onChange={(e) => handleOfficeHourChange('toMinutes', e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            >
                              <option value="00">00</option>
                              <option value="15">15</option>
                              <option value="30">30</option>
                              <option value="45">45</option>
                            </select>
                            <select
                              value={officeHourForm.toPeriod}
                              onChange={(e) => handleOfficeHourChange('toPeriod', e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={addOfficeHours}
                    className="px-6 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Office Hours
                  </button>
                </div>
              </div>

              {/* Office Hours Table */}
              <div className="bg-white rounded-lg overflow-hidden shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time & Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {officeHours.map(hour => (
                      <tr key={hour.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hour.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hour.timeAndDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hour.room}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hour.hours}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => setOfficeHours(prev => prev.filter(h => h.id !== hour.id))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {officeHours.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No office hours added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Faculty Loads Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b-2 border-green-500 pb-2 inline-block">
                Setup Faculty Loads
              </h3>

              {/* Search Section - Better Balanced */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search subjects by code, description, section..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={handleSearchSubjects}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Search by: Subject Code | Description | LEC | LAB | UNITS | Section | Schedule
                </p>
              </div>

              {/* Filter Section - Better Balanced */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Status</label>
                    <select
                      value={filters.employeeStatus}
                      onChange={(e) => setFilters(prev => ({ ...prev, employeeStatus: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="All">All</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
                    <select
                      value={filters.campus}
                      onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="All">All</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                    <select
                      value={filters.mode}
                      onChange={(e) => setFilters(prev => ({ ...prev, mode: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="All">All</option>
                      <option value="Online">Online</option>
                      <option value="Blended">Blended</option>
                      <option value="Face-to-face">Face-to-face</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credited Units</label>
                    <input
                      type="number"
                      value={filters.creditedUnits}
                      onChange={(e) => setFilters(prev => ({ ...prev, creditedUnits: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Load Hours</label>
                    <input
                      type="number"
                      value={filters.loadHours}
                      onChange={(e) => setFilters(prev => ({ ...prev, loadHours: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Subject
                    </button>
                  </div>
                </div>
              </div>

              {/* Faculty Loads Table */}
              <div className="bg-white rounded-lg overflow-hidden shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LEC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAB</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFacultyLoads.map(load => (
                      <tr key={load.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{load.subjectCode}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{load.subjectDescription}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{load.lecHours}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{load.labHours}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{load.units}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{load.section}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{load.schedule}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            load.type === 'Full-time' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {load.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditSubject(load)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Subject"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeSubject(load.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredFacultyLoads.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 text-center text-gray-500">No subjects added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timetable Section - Better Balanced */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b-2 border-green-500 pb-2 inline-block">
                Weekly Schedule Overview
              </h3>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <div className="grid grid-cols-8 gap-px bg-gray-300">
                      {/* Corner cell */}
                      <div className="bg-green-600 text-white p-4 text-sm font-semibold text-center">
                        Time
                      </div>
                      {/* Day headers */}
                      {days.map(day => (
                        <div key={day} className="bg-green-600 text-white p-4 text-sm font-semibold text-center">
                          {day}
                        </div>
                      ))}
                      
                      {/* Time slots */}
                      {timeSlots.slice(0, 20).map(slot => (
                        <React.Fragment key={slot.time}>
                          {/* Time label */}
                          <div className="bg-gray-50 p-3 text-xs text-center font-medium text-gray-600 border-r border-gray-300 min-h-[50px] flex items-center justify-center">
                            {slot.displayTime}
                          </div>
                          {/* Day slots */}
                          {days.map(day => {
                            const scheduleInfo = getScheduleForTimeSlot(day, slot);
                            return (
                              <div
                                key={`${day}-${slot.time}`}
                                className={`p-2 min-h-[50px] border-r border-b border-gray-300 cursor-pointer transition-colors flex items-center justify-center ${
                                  scheduleInfo 
                                    ? 'hover:opacity-90' 
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                              >
                                {scheduleInfo && (
                                  <div className={`${scheduleInfo.color} text-white p-2 rounded text-xs text-center shadow-sm max-w-full`}>
                                    <div className="font-medium truncate" title={scheduleInfo.title}>
                                      {scheduleInfo.title}
                                    </div>
                                    <div className="text-xs opacity-90 truncate" title={scheduleInfo.room}>
                                      {scheduleInfo.room}
                                    </div>
                                    <div className="text-xs opacity-75">
                                      {scheduleInfo.type === 'office' ? 'Office' : 'Class'}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timetable Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Faculty Classes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Office Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span className="text-gray-600">Available Slots</span>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>How to use:</strong> Add office hours and faculty loads above to see them appear in the weekly schedule. 
                  Office hours will show in blue, classes in green.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions - Better Balanced */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mx-6 mt-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button 
                onClick={handlePrintForm}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm gap-2"
              >
                <FileText className="w-4 h-4" />
                Print Faculty Assignment Form
                <ChevronDown className="w-4 h-4" />
              </button>
              <button 
                onClick={handleViewHistory}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm gap-2"
              >
                <Clock className="w-4 h-4" />
                View History
              </button>
            </div>
          </div>
        </div>

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
                      placeholder="e.g., CS101"
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
                      Section *
                    </label>
                    <input
                      type="text"
                      required
                      value={subjectForm.section}
                      onChange={(e) => handleSubjectFormChange('section', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., A1, B2"
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
                      placeholder="e.g., M/W 9:00AM-10:30AM"
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
                      placeholder="e.g., ROOM 303-N"
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
    </div>
    </main>
    </div>
    </div>
  );
};

export default FacultyLoadSystem;
