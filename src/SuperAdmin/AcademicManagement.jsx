import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { collegeAPI, programAPI, subjectAPI, yearSectionAPI } from "../api/axios";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  Search,
  Check,
} from "lucide-react";

function CustomCheckbox({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded 
                   checked:bg-[#FF7A00] checked:border-[#FF7A00] cursor-pointer"
      />
      {checked && (
        <Check className="w-3 h-3 text-white absolute left-0.5 top-0.5 pointer-events-none" />
      )}
    </label>
  );
}

export default function AcademicManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [activeTab, setActiveTab] = useState("colleges");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCollegeForProgram, setSelectedCollegeForProgram] =
    useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(""); // For subject assignment
  const [selectedSemester, setSelectedSemester] = useState(""); // For subject assignment semester
  const [selectedYearLevel, setSelectedYearLevel] = useState(""); // For subject assignment year level
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // "college", "program", "subject"
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  // Backend data states
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availableDeans, setAvailableDeans] = useState([]);
  const [availableProgramHeads, setAvailableProgramHeads] = useState([]); // ✅ SEPARATE STATE FOR PROGRAM HEADS
  const [yearSections, setYearSections] = useState([]); // Year sections from database
  const [availableYearLevels, setAvailableYearLevels] = useState([]); // Unique year levels from year_sections
  const [selectedDeanId, setSelectedDeanId] = useState("");
  const [selectedProgramHeadId, setSelectedProgramHeadId] = useState(""); // ✅ SEPARATE STATE FOR PROGRAM HEAD

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    units: "",
  });

  // Listen to sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  // Load data from backend
  useEffect(() => {
    loadData();
    fetchYearSections();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [collegesRes, programsRes, subjectsRes] = await Promise.all([
        collegeAPI.getAll(),
        programAPI.getAll(),
        subjectAPI.getAll(),
      ]);

      console.log("📚 Programs fetched:", programsRes.data.data);
      console.log("📖 Subjects fetched:", subjectsRes.data.data);
      
      if (collegesRes.data.success) setColleges(collegesRes.data.data);
      if (programsRes.data.success) {
        console.log("✅ Setting programs with subjects:", programsRes.data.data);
        setPrograms(programsRes.data.data);
      }
      if (subjectsRes.data.success) setSubjects(subjectsRes.data.data);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch year sections and extract unique year levels
  const fetchYearSections = async () => {
    try {
      const response = await yearSectionAPI.getAll();
      console.log("Year sections fetched:", response.data);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setYearSections(response.data.data);
        // Extract unique year_level values
        const uniqueYearLevels = Array.from(new Set(response.data.data.map(ys => ys.year_level))).sort();
        setAvailableYearLevels(uniqueYearLevels);
        console.log("Available year levels:", uniqueYearLevels);
      } else if (Array.isArray(response.data)) {
        setYearSections(response.data);
        const uniqueYearLevels = Array.from(new Set(response.data.map(ys => ys.year_level))).sort();
        setAvailableYearLevels(uniqueYearLevels);
        console.log("Available year levels:", uniqueYearLevels);
      }
    } catch (error) {
      console.error("Error fetching year sections:", error);
    }
  };

  // ✅ UPDATED: Fetch available deans (users with role 'dean' and not assigned to any college)
  const loadAvailableDeans = async () => {
    try {
      console.log("🔄 Fetching available deans...");
      const response = await collegeAPI.getAvailableDeans();
      console.log("📦 Full API response:", response);
      console.log("📊 Response data:", response.data);

      if (response.data.success) {
        console.log("✅ Available deans:", response.data.data);
        setAvailableDeans(response.data.data);
      } else {
        console.log("❌ API returned success: false");
        setError("Failed to load available deans");
      }
    } catch (error) {
      console.error("💥 Error loading deans:", error);
      console.error("Error response:", error.response);
      setError(
        "Failed to load available deans: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // ✅ UPDATED: Fetch available program heads (users with role 'program_head' and not assigned to any program)
  const loadAvailableProgramHeads = async () => {
    try {
      const response = await programAPI.getAvailableProgramHeads();
      if (response.data.success) {
        setAvailableProgramHeads(response.data.data);
        console.log("Available program heads:", response.data.data); // Debug log
      }
    } catch (error) {
      console.error("Error loading program heads:", error);
      setError("Failed to load available program heads");
    }
  };

  const openModal = async (
    type,
    college = null,
    program = null,
    subject = null
  ) => {
    setModalType(type);
    setSelectedCollege(college);
    setSelectedProgram(program);
    setSelectedSubject(subject);

    // Set formData based on modal type to avoid conflicts
    let formDataToSet = { name: "", code: "", units: "" };
    
    if (type.includes("college")) {
      formDataToSet = {
        name: college?.college_name || "",
        code: college?.college_code || "",
        units: "",
      };
    } else if (type.includes("program")) {
      formDataToSet = {
        name: program?.program_name || "",
        code: program?.program_code || "",
        units: "",
      };
    } else if (type.includes("subject")) {
      formDataToSet = {
        name: subject?.subject_name || "",
        code: subject?.subject_code || "",
        units: subject?.units || "",
      };
    }
    
    setFormData(formDataToSet);

    if (type === "assign-dean") {
      setSelectedDeanId(college?.dean?.id || "");
      await loadAvailableDeans(); // ✅ LOAD DEANS WHEN MODAL OPENS
    }

    if (type === "assign-head") {
      setSelectedProgramHeadId(program?.program_head?.id || "");
      await loadAvailableProgramHeads(); // ✅ LOAD PROGRAM HEADS WHEN MODAL OPENS
    }

    if (type === "update-subject" && subject && program) {
      setSelectedSubjectId(subject.id);
      setSelectedSemester(subject.pivot?.semester || "");
      setSelectedYearLevel(subject.pivot?.year_level || "");
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setSelectedCollege(null);
    setSelectedProgram(null);
    setSelectedSubject(null);
    setSelectedCollegeForProgram(null);
    setFormData({ name: "", code: "", units: "" });
    setError(null);
    setSuccessMessage(null);
    setAvailableDeans([]);
    setAvailableProgramHeads([]);
    setSelectedDeanId("");
    setSelectedProgramHeadId("");
    setSelectedSubjectId("");
    setSelectedSemester("");
    setSelectedYearLevel("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate required fields
    if (!formData.name.trim() || !formData.code.trim()) {
      setError("Name and Code are required");
      return;
    }
    if (modalType === "add-program" && !selectedCollegeForProgram?.id) {
      setError("Please select a college for the program.");
      return;
    }

    try {
      // Log payload for debugging
      if (modalType === "add-college") {
        const payload = {
          college_name: formData.name,
          college_code: formData.code,
        };
        console.log("Add College Payload:", payload);
        const response = await collegeAPI.create(payload);
        if (response.data.success) {
          setColleges((prev) => [response.data.data, ...prev]);
          setSuccessMessage("College created successfully!");
        } else {
          setError(response.data.message || "Failed to create college");
        }
      } else if (modalType === "edit-college" && selectedCollege) {
        const payload = {
          college_name: formData.name,
          college_code: formData.code,
        };
        console.log("Edit College Payload:", payload);
        const response = await collegeAPI.update(selectedCollege.id, payload);
        if (response.data.success) {
          setColleges((prev) =>
            prev.map((c) =>
              c.id === selectedCollege.id ? response.data.data : c
            )
          );
          setSuccessMessage("College updated successfully!");
        } else {
          setError(response.data.message || "Failed to update college");
        }
      } else if (modalType === "add-program") {
        const payload = {
          program_name: formData.name,
          program_code: formData.code,
          college_id: selectedCollegeForProgram?.id,
        };
        console.log("Add Program Payload:", payload);
        const response = await programAPI.create(payload);
        if (response.data.success) {
          setPrograms((prev) => [response.data.data, ...prev]);
          setSuccessMessage("Program created successfully!");
        } else {
          setError(response.data.message || "Failed to create program");
        }
      } else if (modalType === "edit-program" && selectedProgram) {
        const payload = {
          program_name: formData.name,
          program_code: formData.code,
          college_id: selectedProgram.college_id,
        };
        console.log("Edit Program Payload:", payload);
        const response = await programAPI.update(selectedProgram.id, payload);
        if (response.data.success) {
          setPrograms((prev) =>
            prev.map((p) =>
              p.id === selectedProgram.id ? response.data.data : p
            )
          );
          setSuccessMessage("Program updated successfully!");
        } else {
          setError(response.data.message || "Failed to update program");
        }
      } else if (modalType === "add-subject") {
        const payload = {
          subject_name: formData.name,
          subject_code: formData.code,
          units: formData.units,
        };
        console.log("Add Subject Payload:", payload);
        const response = await subjectAPI.create(payload);
        if (response.data.success) {
          setSubjects((prev) => [response.data.data, ...prev]);
          setSuccessMessage("Subject created successfully!");
        } else {
          setError(response.data.message || "Failed to create subject");
        }
      } else if (modalType === "edit-subject" && selectedSubject) {
        const payload = {
          subject_name: formData.name,
          subject_code: formData.code,
          units: formData.units,
        };
        console.log("Edit Subject Payload:", payload);
        const response = await subjectAPI.update(selectedSubject.id, payload);
        if (response.data.success) {
          setSubjects((prev) =>
            prev.map((s) =>
              s.id === selectedSubject.id ? response.data.data : s
            )
          );
          setSuccessMessage("Subject updated successfully!");
        } else {
          setError(response.data.message || "Failed to update subject");
        }
      }

      setTimeout(() => setSuccessMessage(null), 2500);
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show backend error message if available
      setError(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  const handleAssignDean = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedCollege || !selectedDeanId) {
      setError("Please select a dean to assign");
      return;
    }

    try {
      const response = await collegeAPI.update(selectedCollege.id, {
        dean_id: selectedDeanId,
      });

      if (response.data.success) {
        setColleges((prev) =>
          prev.map((c) =>
            c.id === selectedCollege.id ? response.data.data : c
          )
        );
        setSuccessMessage("Dean assigned successfully!");
        setTimeout(() => setSuccessMessage(null), 2000);
        closeModal();
      }
    } catch (error) {
      console.error("Error assigning dean:", error);
      setError(error.response?.data?.message || "Failed to assign dean");
    }
  };

  const handleAssignHead = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedProgram || !selectedProgramHeadId) {
      setError("Please select a program head to assign");
      return;
    }

    try {
      const response = await programAPI.update(selectedProgram.id, {
        program_head_id: selectedProgramHeadId,
      });

      if (response.data.success) {
        setPrograms((prev) =>
          prev.map((p) =>
            p.id === selectedProgram.id ? response.data.data : p
          )
        );
        setSuccessMessage("Program head assigned successfully!");
        setTimeout(() => setSuccessMessage(null), 2000);
        closeModal();
      }
    } catch (error) {
      console.error("Error assigning program head:", error);
      setError(
        error.response?.data?.message || "Failed to assign program head"
      );
    }
  };

  const deleteCollege = async (id) => {
    const college = colleges.find((c) => c.id === id);
    setDeleteType("college");
    setItemToDelete({ id, name: college?.college_name || "college" });
    setShowDeleteModal(true);
  };

  const confirmDeleteCollege = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const response = await collegeAPI.delete(itemToDelete.id);
      if (response.data.success) {
        setColleges((prev) => prev.filter((c) => c.id !== itemToDelete.id));
        setSuccessMessage("College deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 2000);
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting college:", error);
      setError(error.response?.data?.message || "Failed to delete college");
    } finally {
      setDeleting(false);
    }
  };

  const deleteProgram = async (id) => {
    const program = programs.find((p) => p.id === id);
    setDeleteType("program");
    setItemToDelete({ id, name: program?.program_name || "program" });
    setShowDeleteModal(true);
  };

  const confirmDeleteProgram = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const response = await programAPI.delete(itemToDelete.id);
      if (response.data.success) {
        setPrograms((prev) => prev.filter((p) => p.id !== itemToDelete.id));
        setSuccessMessage("Program deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 2000);
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting program:", error);
      setError(error.response?.data?.message || "Failed to delete program");
    } finally {
      setDeleting(false);
    }
  };

  // Checkbox controls for subjects
  const handleSubjectCheckboxChange = (id) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAllSubjects = (e) => {
    if (e.target.checked) {
      setSelectedSubjectIds(filteredSubjects.map((s) => s.id));
    } else {
      setSelectedSubjectIds([]);
    }
  };

  const handleDeleteSelectedSubjects = () => {
    if (selectedSubjectIds.length === 0) return;
    setDeleteType("subject");
    setShowDeleteModal(true);
  };

  const confirmDeleteSubjects = async () => {
    if (!selectedSubjectIds || selectedSubjectIds.length === 0) return;
    setDeleting(true);
    try {
      // Delete subjects one by one (since there might not be a bulk delete endpoint)
      const deletePromises = selectedSubjectIds.map((id) => subjectAPI.delete(id));
      const results = await Promise.all(deletePromises);
      
      const successCount = results.filter((r) => r.data.success).length;
      if (successCount > 0) {
        setSubjects((prev) => prev.filter((s) => !selectedSubjectIds.includes(s.id)));
        setSuccessMessage(`${successCount} subject(s) deleted successfully!`);
        setTimeout(() => setSuccessMessage(null), 2000);
        setSelectedSubjectIds([]);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting subjects:", error);
      setError(error.response?.data?.message || "Failed to delete subjects");
    } finally {
      setDeleting(false);
    }
  };

  const handleAssignSubject = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedProgram || !selectedSubjectId) {
      setError("Please select a subject to assign");
      return;
    }

    try {
      const response = await programAPI.assignSubject(
        selectedProgram.id,
        selectedSubjectId,
        selectedSemester,
        selectedYearLevel
      );

      if (response.data.success) {
        console.log("✅ Subject assigned, response:", response.data.data);
        setPrograms((prev) =>
          prev.map((p) =>
            p.id === selectedProgram.id ? response.data.data : p
          )
        );
        setSuccessMessage("Subject assigned successfully!");
        setTimeout(() => setSuccessMessage(null), 2000);
        closeModal();
        // Reload data to ensure everything is in sync
        await loadData();
      }
    } catch (error) {
      console.error("Error assigning subject:", error);
      setError(error.response?.data?.message || "Failed to assign subject");
    }
  };

  const updateSubjectAssignment = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedProgram || !selectedSubjectId) {
      setError("Please select a subject");
      return;
    }

    if (!selectedSemester || !selectedYearLevel) {
      setError("Please select both semester and year level");
      return;
    }

    try {
      const response = await programAPI.updateSubjectAssignment(
        selectedProgram.id,
        selectedSubjectId,
        selectedSemester,
        selectedYearLevel
      );

      if (response.data.success) {
        console.log("✅ Subject assignment updated, response:", response.data.data);
        setPrograms((prev) =>
          prev.map((p) =>
            p.id === selectedProgram.id ? response.data.data : p
          )
        );
        setSuccessMessage("Subject assignment updated successfully!");
        setTimeout(() => setSuccessMessage(null), 2000);
        closeModal();
        // Reload data to ensure everything is in sync
        await loadData();
      }
    } catch (error) {
      console.error("Error updating subject assignment:", error);
      setError(error.response?.data?.message || "Failed to update subject assignment");
    }
  };

  const unassignSubject = async (programId, subjectId) => {
    if (!window.confirm("Are you sure you want to unassign this subject?"))
      return;

    try {
      const response = await programAPI.unassignSubject(programId, subjectId);
      if (response.data.success) {
        console.log("✅ Subject unassigned, response:", response.data.data);
        setPrograms((prev) =>
          prev.map((p) => (p.id === programId ? response.data.data : p))
        );
        setSuccessMessage("Subject unassigned successfully!");
        setTimeout(() => setSuccessMessage(null), 2000);
        // Reload data to ensure everything is in sync
        await loadData();
      }
    } catch (error) {
      console.error("Error unassigning subject:", error);
      setError(error.response?.data?.message || "Failed to unassign subject");
    }
  };

  // Filter functions (keep as is)
  const filteredColleges = colleges.filter((c) =>
    [c.college_name, c.college_code, c.dean?.fullname]
      .filter(Boolean)
      .some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPrograms = programs.filter((p) =>
    [p.program_name, p.program_code, p.program_head?.fullname]
      .filter(Boolean)
      .some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredSubjects = subjects.filter((s) =>
    [s.subject_name, s.subject_code, s.units]
      .filter(Boolean)
      .some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Clear subject selection when search changes
  useEffect(() => {
    if (activeTab === "subjects") {
      setSelectedSubjectIds([]);
    }
  }, [searchTerm, activeTab]);

  if (isLoading) {
    return (
      <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
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
    <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">
              Academic Management
            </h1>
            <p className="text-gray-600">
              Manage colleges, programs, and subject assignments
            </p>
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
              <nav className="-mb-px flex space-x-8 gap-4">
                <button
                  onClick={() => {
                    setActiveTab("colleges");
                    setSelectedSubjectIds([]); // Clear selection when switching tabs
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "colleges"
                      ? "border-[#064F32] text-[#064F32]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Colleges ({colleges.length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab("subjects");
                    setSelectedSubjectIds([]); // Clear selection when switching tabs
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "subjects"
                      ? "border-[#064F32] text-[#064F32]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Subjects ({subjects.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search subject"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[350px] p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
            />

            <div className="flex items-center gap-3">
              {/* Delete Selected Button for Subjects */}
              {activeTab === "subjects" && selectedSubjectIds.length > 0 && (
                <button
                  onClick={handleDeleteSelectedSubjects}
                  className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                >
                  Delete Selected ({selectedSubjectIds.length})
                </button>
              )}

              {/* Dynamic Add Button based on active tab */}
              {activeTab === "colleges" && (
                <button
                  onClick={() => openModal("add-college")}
                  className="px-4 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add College
                </button>
              )}

              {activeTab === "subjects" && (
                <button
                  onClick={() => openModal("add-subject")}
                  className="px-4 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </button>
              )}
            </div>
          </div>

          {/* Colleges Tab */}
          {activeTab === "colleges" && (
            <div className="space-y-6">
              {filteredColleges.map((college) => (
                <div
                  key={college.id}
                  className="bg-white rounded-lg shadow-md border border-gray-100"
                >
                  {/* College Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 gap-4">
                        <div className="p-3 bg-[#064F32] rounded-lg">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {college.college_name}
                          </h3>
                          <p className="text-gray-600">
                            Code: {college.college_code}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 gap-4">
                            <div className="flex items-center space-x-2 gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {college.students_count || 0} students
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 gap-1">
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {
                                  programs.filter(
                                    (p) => p.college_id === college.id
                                  ).length
                                }{" "}
                                programs
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal("edit-college", college)}
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
                          <p className="text-sm font-medium text-gray-700">
                            Assigned Dean
                          </p>
                          <p className="text-gray-900">
                            {college.dean?.fullname || "No dean assigned"}
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => openModal("assign-dean", college)}
                            className="text-[#064F32] hover:text-[#053d27] text-sm font-medium"
                          >
                            Assign Dean
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Programs */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Programs
                      </h4>
                      <button
                        onClick={() => {
                          setSelectedCollegeForProgram(college);
                          openModal("add-program", college);
                        }}
                        className="px-3 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90 transition flex items-center gap-2 text-sm"
                      >
                        <Plus className="w-4 h-4 " />
                        Add Program
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {programs
                        .filter((p) => p.college_id === college.id)
                        .map((program) => (
                          <div
                            key={program.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">
                                  {program.program_name}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {program.program_code}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    openModal("edit-program", college, program)
                                  }
                                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                                  title="Edit Program"
                                >
                                  <Edit className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => deleteProgram(program.id)}
                                  className="p-1 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Program"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center justify-between mt-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-3 h-3 text-gray-400" />
                                  <span>
                                    Program Head:{" "}
                                    {program.program_head?.fullname ||
                                      "Not assigned"}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    openModal("assign-head", null, program)
                                  }
                                  className="text-[#064F32] hover:text-[#053d27] text-xs font-medium"
                                >
                                  Assign Head
                                </button>
                              </div>
                            </div>

                            {/* Assigned Subjects Section */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center justify-between mb-2 mt-2">
                                <span className="text-xs font-medium text-gray-700">
                                  Assigned Subjects ({program.subjects?.length || 0})
                                </span>
                                <button
                                  onClick={() =>
                                    openModal("assign-subject", null, program)
                                  }
                                  className="text-[#FF7A00] hover:opacity-80 text-xs font-medium"
                                >
                                  + Assign Subject
                                </button>
                              </div>
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {program.subjects && program.subjects.length > 0 ? (
                                  program.subjects.map((subject) => {
                                    const hasNullData = !subject.pivot?.year_level || !subject.pivot?.semester;
                                    return (
                                      <div
                                        key={subject.id}
                                        className={`flex items-center justify-between text-xs p-2 rounded ${
                                          hasNullData ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                                        }`}
                                      >
                                        <div className="flex-1">
                                          <span className="text-gray-700">
                                            {subject.subject_code} - {subject.subject_name}
                                          </span>
                                          <div className="text-xs text-gray-500 mt-0.5">
                                            {subject.pivot?.year_level && subject.pivot?.semester ? (
                                              <span>{subject.pivot.year_level} - {subject.pivot.semester}</span>
                                            ) : (
                                              <span className="text-yellow-600 font-medium">⚠️ Missing year/semester</span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 ml-2">
                                          {hasNullData && (
                                            <button
                                              onClick={() =>
                                                openModal("update-subject", subject, program)
                                              }
                                              className="text-[#064F32] hover:text-[#053d27] p-1"
                                              title="Update year level and semester"
                                            >
                                              <Edit className="w-3 h-3" />
                                            </button>
                                          )}
                                          <button
                                            onClick={() =>
                                              unassignSubject(program.id, subject.id)
                                            }
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Unassign subject"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-xs text-gray-400 italic">
                                    No subjects assigned yet
                                  </p>
                                )}
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


          {/* Subjects Tab */}
          {activeTab === "subjects" && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  All Subjects
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-[#064F32]/10 text-[#064F32]">
                        <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={
                              filteredSubjects.length > 0 &&
                              selectedSubjectIds.length === filteredSubjects.length
                            }
                            onChange={handleSelectAllSubjects}
                            className="w-4 h-4"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Units
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSubjects.map((subject) => (
                        <tr key={subject.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 whitespace-nowrap">
                            <CustomCheckbox
                              checked={selectedSubjectIds.includes(subject.id)}
                              onChange={() => handleSubjectCheckboxChange(subject.id)}
                            />
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {subject.subject_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {subject.subject_code}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                            {subject.units || "-"}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  openModal("edit-subject", null, null, subject)
                                }
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit Subject"
                              >
                                <Edit className="w-4 h-4 text-gray-600" />
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
                  {modalType === "add-college"
                    ? "Add New College"
                    : modalType === "edit-college"
                    ? "Edit College"
                    : modalType === "add-program"
                    ? "Add New Program"
                    : modalType === "edit-program"
                    ? "Edit Program"
                    : modalType === "add-subject"
                    ? "Add New Subject"
                    : modalType === "edit-subject"
                    ? "Edit Subject"
                    : modalType === "assign-dean"
                    ? "Assign Dean"
                    : modalType === "assign-head"
                    ? "Assign Program Head"
                    : modalType === "assign-subject"
                    ? "Assign Subject to Program"
                    : modalType === "update-subject"
                    ? "Update Subject Assignment"
                    : ""}
                </h3>

                {modalType === "assign-dean" ? (
                  <form onSubmit={handleAssignDean} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Dean
                      </label>
                      <select
                        value={selectedDeanId}
                        onChange={(e) => setSelectedDeanId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                      >
                        <option value="">-- Select Dean --</option>
                        {availableDeans.map((dean) => (
                          <option key={dean.id} value={dean.id}>
                            {dean.fullname} ({dean.email})
                          </option>
                        ))}
                      </select>
                      {availableDeans.length === 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          No available deans found. Please create dean accounts
                          first.
                        </p>
                      )}
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
                        disabled={!selectedDeanId}
                        className="px-4 py-2 bg-[#064F32] text-white rounded-lg hover:bg-[#053d27] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Assign Dean
                      </button>
                    </div>
                  </form>
                ) : modalType === "assign-head" ? (
                  <form onSubmit={handleAssignHead} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Program Head
                      </label>
                      <select
                        value={selectedProgramHeadId}
                        onChange={(e) =>
                          setSelectedProgramHeadId(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                      >
                        <option value="">-- Select Program Head --</option>
                        {availableProgramHeads.map((head) => (
                          <option key={head.id} value={head.id}>
                            {head.fullname} ({head.email})
                          </option>
                        ))}
                      </select>
                      {availableProgramHeads.length === 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          No available program heads found. Please create
                          program head accounts first.
                        </p>
                      )}
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
                        disabled={!selectedProgramHeadId}
                        className="px-4 py-2 bg-[#064F32] text-white rounded-lg hover:bg-[#053d27] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Assign Head
                      </button>
                    </div>
                  </form>
                ) : modalType === "assign-subject" ? (
                  <form onSubmit={handleAssignSubject} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Program
                      </label>
                      <input
                        type="text"
                        value={selectedProgram?.program_name || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Subject
                      </label>
                      <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                      >
                        <option value="">-- Select Subject --</option>
                        {subjects
                          .filter(
                            (s) =>
                              !selectedProgram?.subjects?.some(
                                (ps) => ps.id === s.id
                              )
                          )
                          .map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.subject_code} - {subject.subject_name} ({subject.units} units)
                            </option>
                          ))}
                      </select>
                      {subjects.length === 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          No subjects available. Please create subjects first.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year Level
                      </label>
                      <select
                        value={selectedYearLevel}
                        onChange={(e) => setSelectedYearLevel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                      >
                        <option value="">-- Select Year Level --</option>
                        {availableYearLevels.map((yearLevel) => (
                          <option key={yearLevel} value={yearLevel}>
                            {yearLevel}
                          </option>
                        ))}
                        {availableYearLevels.length === 0 && (
                          <option value="" disabled>Loading year levels...</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Semester
                      </label>
                      <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                      >
                        <option value="">-- Select Semester --</option>
                        <option value="First">First Semester</option>
                        <option value="Second">Second Semester</option>
                        <option value="Summer">Summer</option>
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
                        disabled={!selectedSubjectId}
                        className="px-4 py-2 bg-[#064F32] text-white rounded-lg hover:bg-[#053d27] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Assign Subject
                      </button>
                    </div>
                  </form>
                ) : modalType === "update-subject" ? (
                  <form onSubmit={updateSubjectAssignment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Program
                      </label>
                      <input
                        type="text"
                        value={selectedProgram?.program_name || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={selectedSubject?.subject_code ? `${selectedSubject.subject_code} - ${selectedSubject.subject_name}` : ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year Level *
                      </label>
                      <select
                        value={selectedYearLevel}
                        onChange={(e) => setSelectedYearLevel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                        required
                      >
                        <option value="">-- Select Year Level --</option>
                        {availableYearLevels.map((yearLevel) => (
                          <option key={yearLevel} value={yearLevel}>
                            {yearLevel}
                          </option>
                        ))}
                        {availableYearLevels.length === 0 && (
                          <option value="" disabled>Loading year levels...</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Semester *
                      </label>
                      <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                        required
                      >
                        <option value="">-- Select Semester --</option>
                        <option value="First">First Semester</option>
                        <option value="Second">Second Semester</option>
                        <option value="Summer">Summer</option>
                      </select>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {error}
                      </div>
                    )}

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
                        disabled={!selectedYearLevel || !selectedSemester}
                        className="px-4 py-2 bg-[#064F32] text-white rounded-lg hover:bg-[#053d27] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Update Assignment
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {modalType.includes("college") ? (
                      <>
                        <div>
                          <label
                            htmlFor="college_name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            College Name
                          </label>
                          <input
                            id="college_name"
                            name="college_name"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="college_code"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            College Code
                          </label>
                          <input
                            id="college_code"
                            name="college_code"
                            type="text"
                            value={formData.code}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                code: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                            required
                          />
                        </div>
                      </>
                    ) : modalType.includes("program") ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            College
                          </label>
                          <input
                            type="text"
                            value={
                              selectedCollege?.college_name ||
                              selectedCollegeForProgram?.college_name ||
                              ""
                            }
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Program Name
                          </label>
                          <input
                            id="program_name"
                            name="program_name"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Program Code
                          </label>
                          <input
                            id="program_code"
                            name="program_code"
                            type="text"
                            value={formData.code}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                code: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                            required
                          />
                        </div>
                      </>
                    ) : modalType.includes("subject") ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Name
                          </label>
                          <input
                            id="subject_name"
                            name="subject_name"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Code
                          </label>
                          <input
                            id="subject_code"
                            name="subject_code"
                            type="text"
                            value={formData.code}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                code: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Units
                          </label>
                          <input
                            id="units"
                            name="units"
                            type="text"
                            value={formData.units}
                            onChange={(e) =>
                              setFormData({ ...formData, units: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                          />
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
                        {modalType === "add-college"
                          ? "Add College"
                          : modalType === "edit-college"
                          ? "Save Changes"
                          : modalType === "add-program"
                          ? "Add Program"
                          : modalType === "edit-program"
                          ? "Save Changes"
                          : modalType === "add-subject"
                          ? "Add Subject"
                          : modalType === "edit-subject"
                          ? "Save Changes"
                          : "Save"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                <div className="flex justify-center mb-3">
                  <svg
                    className="w-12 h-12 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 
                      2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 
                      1 0 011-1h2a1 1 0 011 1v3"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2 mt-10">DELETE</h2>
                <p className="mb-4">
                  {deleteType === "subject" && selectedSubjectIds.length > 0 ? (
                    <>
                      Are you sure you want to delete{" "}
                      <strong>{selectedSubjectIds.length}</strong> subject(s)?
                    </>
                  ) : (
                    <>
                      Are you sure you want to delete this {deleteType}?
                      {itemToDelete?.name && (
                        <span className="block mt-1 font-semibold">
                          "{itemToDelete.name}"
                        </span>
                      )}
                    </>
                  )}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setItemToDelete(null);
                      setDeleteType("");
                    }}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (deleteType === "college") {
                        confirmDeleteCollege();
                      } else if (deleteType === "program") {
                        confirmDeleteProgram();
                      } else if (deleteType === "subject") {
                        confirmDeleteSubjects();
                      }
                    }}
                    disabled={deleting}
                    className={`px-4 py-2 text-white rounded ${
                      deleting
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-700 hover:bg-red-800"
                    }`}
                  >
                    {deleting ? "Deleting..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}