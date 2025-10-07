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

  const timeSlots = generateTimeSlots();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Handle office hours form changes
  const handleOfficeHourChange = (field, value) => {
    if (field === 'selectedDays') {
      const updatedDays = officeHourForm.selectedDays.includes(value)
        ? officeHourForm.selectedDays.filter(day => day !== value)
        : [...officeHourForm.selectedDays, value];
      setOfficeHourForm(prev => ({ ...prev, selectedDays: updatedDays }));
    } else {
      setOfficeHourForm(prev => ({ ...prev, [field]: value }));
    }
  };

  // Add office hours
  const addOfficeHours = () => {
    const timeString = `${officeHourForm.fromTime}:${officeHourForm.fromMinutes} ${officeHourForm.fromPeriod} - ${officeHourForm.toTime}:${officeHourForm.toMinutes} ${officeHourForm.toPeriod}`;
    const daysString = officeHourForm.selectedDays.join(', ') || officeHourForm.dayDropdown;
    
    const newOfficeHour = {
      id: Date.now(),
      description: officeHourForm.description,
      timeAndDate: `${daysString} ${timeString}`,
      room: officeHourForm.room,
      hours: officeHourForm.hours
    };

    setOfficeHours(prev => [...prev, newOfficeHour]);
    
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
    const newSubject = {
      id: Date.now(),
      ...subjectForm
    };

    setFacultyLoads(prev => [...prev, newSubject]);
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

          {/* Academic Year and Semester */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-gray-50 border-b">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">AY:</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sem:</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                Set
              </button>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              FACULTY: <span className="text-green-600">{facultyName}</span>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Office/Consultation Hours Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b-2 border-green-500 pb-2 inline-block">
                Setup Office / Consultation Hours
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 items-end mb-6">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={officeHourForm.description}
                    onChange={(e) => handleOfficeHourChange('description', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter description"
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <select
                    value={officeHourForm.room}
                    onChange={(e) => handleOfficeHourChange('room', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">-select room-</option>
                    <option value="ROOM 303-N">ROOM 303-N</option>
                    <option value="ROOM 401-N">ROOM 401-N</option>
                    <option value="BLENDED">BLENDED</option>
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['M', 'T', 'W', 'TH', 'F', 'S', 'SUN'].map(day => (
                      <label key={day} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={officeHourForm.selectedDays.includes(day)}
                          onChange={() => handleOfficeHourChange('selectedDays', day)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-1 text-xs">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <div className="flex items-center space-x-1 text-xs">
                    <span>FROM</span>
                    <select
                      value={officeHourForm.fromTime}
                      onChange={(e) => handleOfficeHourChange('fromTime', e.target.value)}
                      className="border border-gray-300 rounded px-1 py-1 text-xs"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <select
                      value={officeHourForm.fromMinutes}
                      onChange={(e) => handleOfficeHourChange('fromMinutes', e.target.value)}
                      className="border border-gray-300 rounded px-1 py-1 text-xs"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                    <select
                      value={officeHourForm.fromPeriod}
                      onChange={(e) => handleOfficeHourChange('fromPeriod', e.target.value)}
                      className="border border-gray-300 rounded px-1 py-1 text-xs"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <span>TO</span>
                    <select
                      value={officeHourForm.toTime}
                      onChange={(e) => handleOfficeHourChange('toTime', e.target.value)}
                      className="border border-gray-300 rounded px-1 py-1 text-xs"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <select
                      value={officeHourForm.toMinutes}
                      onChange={(e) => handleOfficeHourChange('toMinutes', e.target.value)}
                      className="border border-gray-300 rounded px-1 py-1 text-xs"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                    <select
                      value={officeHourForm.toPeriod}
                      onChange={(e) => handleOfficeHourChange('toPeriod', e.target.value)}
                      className="border border-gray-300 rounded px-1 py-1 text-xs"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                  <input
                    type="number"
                    value={officeHourForm.hours}
                    onChange={(e) => handleOfficeHourChange('hours', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    step="0.5"
                  />
                </div>

                <div className="lg:col-span-1">
                  <button
                    onClick={addOfficeHours}
                    className="w-full px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Time
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

              {/* Search Section */}
              <div className="mb-6">
                <div className="flex gap-3 mb-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Advance Search"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
                    Search
                  </button>
                </div>
                <p className="text-xs text-gray-500 italic">
                  Subject Code | Description | LEC | LAB | UNITS | CREDITED UNITS | Section | Schedule
                </p>
              </div>

              {/* Filter Section */}
              <div className="bg-white p-4 rounded border mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Status</label>
                    <select
                      value={filters.employeeStatus}
                      onChange={(e) => setFilters(prev => ({ ...prev, employeeStatus: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="All">All</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                    <select
                      value={filters.campus}
                      onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="All">All</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                    <select
                      value={filters.mode}
                      onChange={(e) => setFilters(prev => ({ ...prev, mode: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="All">All</option>
                      <option value="Online">Online</option>
                      <option value="Blended">Blended</option>
                      <option value="Face-to-face">Face-to-face</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credited Units</label>
                    <input
                      type="number"
                      value={filters.creditedUnits}
                      onChange={(e) => setFilters(prev => ({ ...prev, creditedUnits: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Load Hours</label>
                    <input
                      type="number"
                      value={filters.loadHours}
                      onChange={(e) => setFilters(prev => ({ ...prev, loadHours: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
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
                            <button className="text-blue-600 hover:text-blue-800">
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

            {/* Timetable Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b-2 border-green-500 pb-2 inline-block">
                Schedules
              </h3>
              
              <div className="bg-white rounded-lg overflow-auto shadow">
                <div className="min-w-full">
                  <div className="grid grid-cols-8 gap-px bg-gray-200">
                    {/* Corner cell */}
                    <div className="bg-green-500 text-white p-3 text-xs font-semibold text-center">
                      Time
                    </div>
                    {/* Day headers */}
                    {days.map(day => (
                      <div key={day} className="bg-green-500 text-white p-3 text-sm font-semibold text-center">
                        {day}
                      </div>
                    ))}
                    
                    {/* Time slots */}
                    {timeSlots.map(slot => (
                      <React.Fragment key={slot.time}>
                        {/* Time label */}
                        <div className="bg-gray-50 p-2 text-xs text-center font-medium text-gray-600 border-r border-gray-200">
                          {slot.displayTime}
                        </div>
                        {/* Day slots */}
                        {days.map(day => {
                          const hasSchedule = facultyLoads.some(load => 
                            load.schedule.toLowerCase().includes(day.toLowerCase().substring(0, 3))
                          );
                          return (
                            <div
                              key={`${day}-${slot.time}`}
                              className={`p-2 min-h-[40px] border-r border-b border-gray-200 cursor-pointer transition-colors ${
                                hasSchedule 
                                  ? 'bg-green-100 hover:bg-green-200' 
                                  : 'bg-white hover:bg-gray-50'
                              }`}
                            >
                              {hasSchedule && (
                                <div className="bg-green-500 text-white p-1 rounded text-xs">
                                  <div className="font-medium">Subject</div>
                                  <div>Room</div>
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
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-gray-50 border-t">
            <div className="mb-4 sm:mb-0">
              <div className="relative">
                <button className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Print Faculty Assignment Form
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
            <div>
              <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
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

              {/* Modal Form */}
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Part-time">Part-time</option>
                      <option value="Full-time">Full-time</option>
                    </select>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
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
