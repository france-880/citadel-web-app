import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import api from "../api/axios";
import { 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  Users, 
  Building2, 
  GraduationCap,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  MoreVertical,
  Eye,
  EyeOff
} from "lucide-react";

export default function AcademicManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('colleges');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add-college', 'edit-college', 'add-program', 'edit-program', 'add-subject', 'edit-subject'
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCollegeForProgram, setSelectedCollegeForProgram] = useState(null);
  const [selectedProgramForSubject, setSelectedProgramForSubject] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // API Service Functions
  const collegeAPI = {
    getAll: () => api.get('/colleges'),
    create: (data) => api.post('/colleges', data),
    update: (id, data) => api.put(`/colleges/${id}`, data),
    delete: (id) => api.delete(`/colleges/${id}`),
    getById: (id) => api.get(`/colleges/${id}`)
  };

  const programAPI = {
    getAll: () => api.get('/programs'),
    create: (data) => api.post('/programs', data),
    update: (id, data) => api.put(`/programs/${id}`, data),
    delete: (id) => api.delete(`/programs/${id}`),
    getById: (id) => api.get(`/programs/${id}`)
  };

  const subjectAPI = {
    getAll: () => api.get('/subjects'),
    create: (data) => api.post('/subjects', data),
    update: (id, data) => api.put(`/subjects/${id}`, data),
    delete: (id) => api.delete(`/subjects/${id}`),
    getById: (id) => api.get(`/subjects/${id}`)
  };

  const userAPI = {
    getDeans: () => api.get('/accounts?role=dean'),
    getProgramHeads: () => api.get('/accounts?role=program_head')
  };

  // State for data from backend
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availableDeans, setAvailableDeans] = useState([]);
  const [availableProgramHeads, setAvailableProgramHeads] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    dean: '',
    deanId: '',
    programHead: '',
    programHeadId: '',
    type: 'Major'
  });

  // Data fetching functions
  const fetchColleges = async () => {
    try {
      const response = await collegeAPI.getAll();
      setColleges(response.data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setColleges([]);
      setError('Failed to fetch colleges');
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await programAPI.getAll();
      setPrograms(response.data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms([]);
      setError('Failed to fetch programs');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await subjectAPI.getAll();
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
      setError('Failed to fetch subjects');
    }
  };

  const fetchDeans = async () => {
    try {
      const response = await userAPI.getDeans();
      setAvailableDeans(response.data || []);
    } catch (error) {
      console.error('Error fetching deans:', error);
      setAvailableDeans([]);
      setError('Failed to fetch deans');
    }
  };

  const fetchProgramHeads = async () => {
    try {
      const response = await userAPI.getProgramHeads();
      setAvailableProgramHeads(response.data || []);
    } catch (error) {
      console.error('Error fetching program heads:', error);
      setAvailableProgramHeads([]);
      setError('Failed to fetch program heads');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchColleges(),
          fetchPrograms(),
          fetchSubjects(),
          fetchDeans(),
          fetchProgramHeads()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleCollegeStatus = (collegeId) => {
    setColleges(prev => prev.map(college => 
      college.id === collegeId 
        ? { ...college, college_status: college.college_status === 'Active' ? 'Inactive' : 'Active' }
        : college
    ));
  };

  const toggleProgramStatus = (collegeId, programId) => {
    setColleges(prev => prev.map(college => 
      college.id === collegeId 
        ? {
            ...college,
            programs: college.programs.map(program =>
              program.id === programId
                ? { ...program, status: program.status === 'active' ? 'inactive' : 'active' }
                : program
            )
          }
        : college
    ));
  };

  const openModal = (type, college = null, program = null, subject = null) => {
    setModalType(type);
    setSelectedCollege(college);
    setSelectedProgram(program);
    setSelectedSubject(subject);
    
    if (type.includes('college')) {
      setFormData({
        name: college?.college_name || '',
        code: college?.college_code || '',
        dean: college?.dean?.fullname || '',
        deanId: college?.college_dean_id || '',
        programHead: '',
        programHeadId: '',
        type: 'Major'
      });
    } else if (type.includes('program')) {
      setFormData({
        name: program?.program_name || '',
        code: program?.program_code || '',
        dean: '',
        deanId: '',
        programHead: program?.head?.fullname || '',
        programHeadId: program?.program_head_id || '',
        type: 'Major'
      });
    } else if (type.includes('subject')) {
      setFormData({
        name: subject?.subject_name || '',
        code: subject?.subject_code || '',
        dean: '',
        deanId: '',
        programHead: '',
        programHeadId: '',
        type: subject?.subject_type || 'Major'
      });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedCollege(null);
    setSelectedProgram(null);
    setSelectedSubject(null);
    setSelectedCollegeForProgram(null);
    setSelectedProgramForSubject(null);
    setFormData({ name: '', code: '', dean: '', deanId: '', programHead: '', programHeadId: '', type: 'Major' });
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    // Basic form validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.code.trim()) {
      setError('Code is required');
      return;
    }
    
    try {
      if (modalType === 'add-college') {
        const collegeData = {
          college_name: formData.name,
          college_code: formData.code,
          college_dean_id: formData.deanId || null,
          college_status: 'Active'
        };
        await collegeAPI.create(collegeData);
        await fetchColleges();
        setSuccessMessage('College created successfully!');
      } else if (modalType === 'edit-college' && selectedCollege) {
        const collegeData = {
          college_name: formData.name,
          college_code: formData.code,
          college_dean_id: formData.deanId || null,
          college_status: selectedCollege.college_status
        };
        await collegeAPI.update(selectedCollege.id, collegeData);
        await fetchColleges();
        setSuccessMessage('College updated successfully!');
      } else if (modalType === 'add-program') {
        const programData = {
          program_name: formData.name,
          program_code: formData.code,
          program_head_id: formData.programHeadId || null,
          program_status: 'Active'
        };
        await programAPI.create(programData);
        await fetchPrograms();
        setSuccessMessage('Program created successfully!');
      } else if (modalType === 'edit-program' && selectedProgram) {
        const programData = {
          program_name: formData.name,
          program_code: formData.code,
          program_head_id: formData.programHeadId || null,
          program_status: selectedProgram.program_status
        };
        await programAPI.update(selectedProgram.id, programData);
        await fetchPrograms();
        setSuccessMessage('Program updated successfully!');
      } else if (modalType === 'add-subject') {
        const subjectData = {
          subject_name: formData.name,
          subject_code: formData.code,
          subject_type: formData.type
        };
        await subjectAPI.create(subjectData);
        await fetchSubjects();
        setSuccessMessage('Subject created successfully!');
      } else if (modalType === 'edit-subject' && selectedSubject) {
        const subjectData = {
          subject_name: formData.name,
          subject_code: formData.code,
          subject_type: formData.type
        };
        await subjectAPI.update(selectedSubject.id, subjectData);
        await fetchSubjects();
        setSuccessMessage('Subject updated successfully!');
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setError(firstError);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while saving. Please try again.');
      }
    }
  };

  const deleteCollege = async (collegeId) => {
    if (window.confirm('Are you sure you want to delete this college? This will also delete all its programs.')) {
      try {
        await collegeAPI.delete(collegeId);
        await fetchColleges();
      } catch (error) {
        console.error('Error deleting college:', error);
        setError('Failed to delete college');
      }
    }
  };

  const deleteProgram = async (programId) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await programAPI.delete(programId);
        await fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
        setError('Failed to delete program');
      }
    }
  };

  const deleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectAPI.delete(subjectId);
        await fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
        setError('Failed to delete subject');
      }
    }
  };

  const filteredColleges = colleges.filter(college =>
    college.college_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.college_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.dean?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrograms = programs.filter(program =>
    program.program_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.program_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.head?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubjects = subjects.filter(subject =>
    subject.subject_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.subject_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.subject_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex" style={{ paddingLeft: '260px', paddingTop: '70px' }}>
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
    <div className="flex" style={{ paddingLeft: '260px', paddingTop: '70px' }}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">Academic Management</h1>
            <p className="text-gray-600">Manage colleges, programs, subjects, and assign administrators</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message Display */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('colleges')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'colleges'
                      ? 'border-[#064F32] text-[#064F32]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Colleges ({colleges.length})
                </button>
                <button
                  onClick={() => setActiveTab('programs')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'programs'
                      ? 'border-[#064F32] text-[#064F32]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Programs ({programs.length})
                </button>
                <button
                  onClick={() => setActiveTab('subjects')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'subjects'
                      ? 'border-[#064F32] text-[#064F32]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Subjects ({subjects.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search colleges, programs, or administrators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32] w-96"
              />
            </div>
            
            {/* Dynamic Add Button based on active tab */}
            {activeTab === 'colleges' && (
              <button
                onClick={() => openModal('add-college')}
                className="bg-[#064F32] text-white px-4 py-2 rounded-lg hover:bg-[#053d27] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add College
              </button>
            )}
            
            {activeTab === 'programs' && (
              <div className="flex items-center gap-3">
                <select
                  value={selectedCollegeForProgram?.id || ''}
                  onChange={(e) => {
                    const collegeId = parseInt(e.target.value);
                    const college = colleges.find(c => c.id === collegeId);
                    setSelectedCollegeForProgram(college);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                >
                  <option value="">Select College</option>
                  {colleges.filter(c => c.college_status === 'Active').map(college => (
                    <option key={college.id} value={college.id}>{college.college_name}</option>
                  ))}
                </select>
                <button
                  onClick={() => selectedCollegeForProgram && openModal('add-program', selectedCollegeForProgram)}
                  disabled={!selectedCollegeForProgram}
                  className="bg-[#064F32] text-white px-4 py-2 rounded-lg hover:bg-[#053d27] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Program
                </button>
              </div>
            )}
            
            {activeTab === 'subjects' && (
              <button
                onClick={() => openModal('add-subject')}
                className="bg-[#064F32] text-white px-4 py-2 rounded-lg hover:bg-[#053d27] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Subject
              </button>
            )}
          </div>

          {/* Colleges Tab */}
          {activeTab === 'colleges' && (
            <div className="space-y-6">
              {filteredColleges.map((college) => (
                <div key={college.id} className="bg-white rounded-lg shadow-md border border-gray-100">
                  {/* College Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-[#064F32] rounded-lg">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{college.college_name}</h3>
                          <p className="text-gray-600">Code: {college.college_code}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">0 students</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{programs.filter(p => p.college_id === college.id).length} programs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          college.college_status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {college.college_status === 'Active' ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => toggleCollegeStatus(college.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {college.college_status === 'Active' ? (
                            <ToggleRight className="w-5 h-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => openModal('edit-college', college)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteCollege(college.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Dean Assignment */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Assigned Dean</p>
                          <p className="text-gray-900">{college.dean?.fullname || 'No dean assigned'}</p>
                        </div>
                        <button className="text-[#064F32] hover:text-[#053d27] text-sm font-medium">
                          Change Dean
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Programs */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Programs</h4>
                      <button
                        onClick={() => openModal('add-program', college)}
                        className="text-[#064F32] hover:text-[#053d27] text-sm font-medium flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Program
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {programs.filter(p => p.college_id === college.id).map((program) => (
                        <div key={program.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">{program.program_name}</h5>
                              <p className="text-sm text-gray-600">{program.program_code}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => toggleProgramStatus(college.id, program.id)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                {program.program_status === 'Active' ? (
                                  <Eye className="w-4 h-4 text-green-500" />
                                ) : (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                              <button 
                                onClick={() => openModal('edit-program', college, program)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => deleteProgram(program.id)}
                                className="p-1 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Program Head: {program.head?.fullname || 'No head assigned'}</p>
                            <p>Students: 0</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`inline-block px-2 py-1 rounded text-xs ${
                                program.program_status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {program.program_status}
                              </span>
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{subjects.filter(s => s.program_id === program.id).length} subjects</span>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">All Programs</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program Head</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPrograms.map(program => (
                        <tr key={program.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{program.program_name}</div>
                              <div className="text-sm text-gray-500">{program.program_code}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {colleges.find(c => c.id === program.college_id)?.college_name || 'Unknown College'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{program.head?.fullname || 'No head assigned'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              program.program_status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {program.program_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => openModal('edit-program', colleges.find(c => c.id === program.college_id), program)}
                                className="text-[#064F32] hover:text-[#053d27]"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => deleteProgram(program.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Subjects Tab */}
          {activeTab === 'subjects' && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">All Subjects</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSubjects.map(subject => (
                        <tr key={subject.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{subject.subject_name}</div>
                              <div className="text-sm text-gray-500">{subject.subject_code}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.subject_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              subject.subject_status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {subject.subject_status || 'active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => openModal('edit-subject', null, null, subject)}
                                className="text-[#064F32] hover:text-[#053d27]"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => deleteSubject(subject.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {modalType === 'add-college' ? 'Add New College' : 
                   modalType === 'edit-college' ? 'Edit College' :
                   modalType === 'add-program' ? 'Add New Program' :
                   modalType === 'edit-program' ? 'Edit Program' :
                   modalType === 'add-subject' ? 'Add New Subject' :
                   modalType === 'edit-subject' ? 'Edit Subject' : ''}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {modalType.includes('college') ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">College Code</label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Dean</label>
                        <select
                          value={formData.deanId}
                          onChange={(e) => setFormData({...formData, deanId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                        >
                          <option value="">Select a dean (optional)</option>
                          {availableDeans && availableDeans.length > 0 ? availableDeans.map(dean => (
                            <option key={dean.id} value={dean.id}>{dean.fullname}</option>
                          )) : <option disabled>No deans available</option>}
                        </select>
                      </div>
                    </>
                  ) : modalType.includes('program') ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Program Code</label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Program Head</label>
                        <select
                          value={formData.programHeadId}
                          onChange={(e) => setFormData({...formData, programHeadId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                        >
                          <option value="">Select a program head (optional)</option>
                          {availableProgramHeads && availableProgramHeads.length > 0 ? availableProgramHeads.map(head => (
                            <option key={head.id} value={head.id}>{head.fullname}</option>
                          )) : <option disabled>No program heads available</option>}
                        </select>
                      </div>
                    </>
                  ) : modalType.includes('subject') ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                          required
                        />
                      </div>
                      
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject Type</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                          required
                        >
                          <option value="Major">Major</option>
                          <option value="Minor">Minor</option>
                          <option value="General Education">General Education</option>
                          <option value="Elective">Elective</option>
                        </select>
                      </div>
                    </>
                  ) : null}
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#064F32] text-white rounded-lg hover:bg-[#053d27] transition-colors"
                    >
                      {modalType === 'add-college' ? 'Add College' : 
                       modalType === 'edit-college' ? 'Save Changes' :
                       modalType === 'add-program' ? 'Add Program' :
                       modalType === 'edit-program' ? 'Save Changes' :
                       modalType === 'add-subject' ? 'Add Subject' :
                       modalType === 'edit-subject' ? 'Save Changes' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}