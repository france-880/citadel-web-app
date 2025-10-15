import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SuperAdminSidebar from "../Components/SuperAdminSidebar";
import { 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  Users, 
  Building2, 
  GraduationCap,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  MoreVertical,
  Eye,
  EyeOff
} from "lucide-react";

export default function CollegeProgramManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('colleges');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add-college', 'edit-college', 'add-program', 'edit-program'
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Dummy data
  const [colleges, setColleges] = useState([
    {
      id: 1,
      name: "College of Information Technology",
      code: "CIT",
      dean: "Dr. Maria Santos",
      deanId: "dean_001",
      status: "active",
      programs: [
        { id: 101, name: "Bachelor of Science in Information Technology", code: "BSIT", head: "Prof. John Cruz", headId: "prof_001", status: "active", students: 320 },
        { id: 102, name: "Bachelor of Science in Computer Science", code: "BSCS", head: "Dr. Anna Reyes", headId: "prof_002", status: "active", students: 280 },
        { id: 103, name: "Bachelor of Science in Information Systems", code: "BSIS", head: "Prof. Michael Torres", headId: "prof_003", status: "active", students: 190 }
      ],
      totalStudents: 790,
      createdAt: "2023-01-15"
    },
    {
      id: 2,
      name: "College of Engineering",
      code: "COE",
      dean: "Dr. Robert Garcia",
      deanId: "dean_002",
      status: "active",
      programs: [
        { id: 201, name: "Bachelor of Science in Computer Engineering", code: "BSCpE", head: "Engr. Sarah Martinez", headId: "prof_004", status: "active", students: 165 },
        { id: 202, name: "Bachelor of Science in Electronics Engineering", code: "BSECE", head: "Engr. David Lee", headId: "prof_005", status: "active", students: 145 }
      ],
      totalStudents: 310,
      createdAt: "2023-01-20"
    },
    {
      id: 3,
      name: "College of Arts and Sciences",
      code: "CAS",
      dean: "Dr. Lisa Chen",
      deanId: "dean_003",
      status: "active",
      programs: [
        { id: 301, name: "Associate in Computer Technology", code: "ACT", head: "Prof. Carlos Mendez", headId: "prof_006", status: "active", students: 120 },
        { id: 302, name: "Bachelor of Science in Entertainment and Multimedia Computing", code: "BSEMC", head: "Prof. Elena Rodriguez", headId: "prof_007", status: "active", students: 95 }
      ],
      totalStudents: 215,
      createdAt: "2023-02-01"
    },
    {
      id: 4,
      name: "College of Business Administration",
      code: "CBA",
      dean: "Dr. Patricia Wong",
      deanId: "dean_004",
      status: "inactive",
      programs: [
        { id: 401, name: "Bachelor of Science in Business Administration", code: "BSBA", head: "Prof. James Kim", headId: "prof_008", status: "inactive", students: 0 }
      ],
      totalStudents: 0,
      createdAt: "2023-02-15"
    }
  ]);

  const [availableDeans, setAvailableDeans] = useState([
    { id: "dean_001", name: "Dr. Maria Santos", email: "maria.santos@university.edu" },
    { id: "dean_002", name: "Dr. Robert Garcia", email: "robert.garcia@university.edu" },
    { id: "dean_003", name: "Dr. Lisa Chen", email: "lisa.chen@university.edu" },
    { id: "dean_004", name: "Dr. Patricia Wong", email: "patricia.wong@university.edu" },
    { id: "dean_005", name: "Dr. Antonio Rivera", email: "antonio.rivera@university.edu" }
  ]);

  const [availableProgramHeads, setAvailableProgramHeads] = useState([
    { id: "prof_001", name: "Prof. John Cruz", email: "john.cruz@university.edu" },
    { id: "prof_002", name: "Dr. Anna Reyes", email: "anna.reyes@university.edu" },
    { id: "prof_003", name: "Prof. Michael Torres", email: "michael.torres@university.edu" },
    { id: "prof_004", name: "Engr. Sarah Martinez", email: "sarah.martinez@university.edu" },
    { id: "prof_005", name: "Engr. David Lee", email: "david.lee@university.edu" },
    { id: "prof_006", name: "Prof. Carlos Mendez", email: "carlos.mendez@university.edu" },
    { id: "prof_007", name: "Prof. Elena Rodriguez", email: "elena.rodriguez@university.edu" },
    { id: "prof_008", name: "Prof. James Kim", email: "james.kim@university.edu" },
    { id: "prof_009", name: "Dr. Maria Gonzalez", email: "maria.gonzalez@university.edu" }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    dean: '',
    deanId: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleCollegeStatus = (collegeId) => {
    setColleges(prev => prev.map(college => 
      college.id === collegeId 
        ? { ...college, status: college.status === 'active' ? 'inactive' : 'active' }
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

  const openModal = (type, college = null, program = null) => {
    setModalType(type);
    setSelectedCollege(college);
    setSelectedProgram(program);
    
    if (type.includes('college')) {
      setFormData({
        name: college?.name || '',
        code: college?.code || '',
        dean: college?.deanId || '',
        deanId: college?.deanId || ''
      });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedCollege(null);
    setSelectedProgram(null);
    setFormData({ name: '', code: '', dean: '', deanId: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'add-college') {
      const newCollege = {
        id: Date.now(),
        name: formData.name,
        code: formData.code,
        dean: availableDeans.find(d => d.id === formData.deanId)?.name || '',
        deanId: formData.deanId,
        status: 'active',
        programs: [],
        totalStudents: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setColleges(prev => [...prev, newCollege]);
    } else if (modalType === 'edit-college' && selectedCollege) {
      setColleges(prev => prev.map(college =>
        college.id === selectedCollege.id
          ? {
              ...college,
              name: formData.name,
              code: formData.code,
              dean: availableDeans.find(d => d.id === formData.deanId)?.name || '',
              deanId: formData.deanId
            }
          : college
      ));
    }
    
    closeModal();
  };

  const deleteCollege = (collegeId) => {
    if (window.confirm('Are you sure you want to delete this college? This will also delete all its programs.')) {
      setColleges(prev => prev.filter(college => college.id !== collegeId));
    }
  };

  const deleteProgram = (collegeId, programId) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      setColleges(prev => prev.map(college =>
        college.id === collegeId
          ? { ...college, programs: college.programs.filter(program => program.id !== programId) }
          : college
      ));
    }
  };

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.dean.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex" style={{ paddingLeft: '300px', paddingTop: '70px' }}>
        <SuperAdminSidebar />
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
    <div className="flex" style={{ paddingLeft: '300px', paddingTop: '70px' }}>
      <SuperAdminSidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">College & Program Management</h1>
            <p className="text-gray-600">Manage colleges, programs, and assign administrators</p>
          </div>

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
                  All Programs ({colleges.reduce((total, college) => total + college.programs.length, 0)})
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
            <button
              onClick={() => openModal('add-college')}
              className="bg-[#064F32] text-white px-4 py-2 rounded-lg hover:bg-[#053d27] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add College
            </button>
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
                          <h3 className="text-xl font-semibold text-gray-900">{college.name}</h3>
                          <p className="text-gray-600">Code: {college.code}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{college.totalStudents} students</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{college.programs.length} programs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          college.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {college.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => toggleCollegeStatus(college.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {college.status === 'active' ? (
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
                          <p className="text-gray-900">{college.dean || 'No dean assigned'}</p>
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
                      {college.programs.map((program) => (
                        <div key={program.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">{program.name}</h5>
                              <p className="text-sm text-gray-600">{program.code}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => toggleProgramStatus(college.id, program.id)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                {program.status === 'active' ? (
                                  <Eye className="w-4 h-4 text-green-500" />
                                ) : (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => deleteProgram(college.id, program.id)}
                                className="p-1 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Program Head: {program.head}</p>
                            <p>Students: {program.students}</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              program.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {program.status}
                            </span>
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
                      {colleges.flatMap(college => 
                        college.programs.map(program => (
                          <tr key={program.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{program.name}</div>
                                <div className="text-sm text-gray-500">{program.code}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{college.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{program.head}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{program.students}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                program.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {program.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button className="text-[#064F32] hover:text-[#053d27]">Edit</button>
                                <button className="text-red-600 hover:text-red-900">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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
                   modalType === 'edit-college' ? 'Edit College' : ''}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      required
                    >
                      <option value="">Select a dean</option>
                      {availableDeans.map(dean => (
                        <option key={dean.id} value={dean.id}>{dean.name}</option>
                      ))}
                    </select>
                  </div>
                  
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
                      {modalType === 'add-college' ? 'Add College' : 'Save Changes'}
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
