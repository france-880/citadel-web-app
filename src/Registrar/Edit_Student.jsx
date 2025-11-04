import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useState, useEffect } from "react";
import { ChevronDown, Calendar, Loader2 } from "lucide-react";
import { programAPI, yearSectionAPI } from "../api/axios";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function Edit_Student() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
        () => localStorage.getItem("sidebarCollapsed") === "true"
    );
    
    // ✅ Backend data states
    const [programs, setPrograms] = useState([]);
    const [yearSections, setYearSections] = useState([]);
    
    const [form, setForm] = useState({
        fullname: "",
        studentNo: "",
        program_id: "",
        year_section_id: "",
        status: "",
        dob: "",
        gender: "",
        email: "",
        contact: "",
        address: "",
        guardianName: "",
        guardianContact: "",
        guardian_email: "",
        guardianAddress: "",
        username: "",
        password: "",
    });

    // Listen to sidebar toggle events
    useEffect(() => {
        const handleSidebarToggle = () => {
            setIsSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
        };
        window.addEventListener("sidebarToggle", handleSidebarToggle);
        return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
    }, []);

    // ✅ Fetch student data, programs, and year sections
    useEffect(() => {
        const fetchData = async () => {
          try {
            setFetchLoading(true);
            
            // Fetch all data in parallel
            const [studentRes, programsRes, yearSectionsRes] = await Promise.all([
              api.get(`/students/${id}`),
              programAPI.getAll("/programs"),
              yearSectionAPI.getAll("/year-sections")
            ]);
            
            // Set student data - handle different response structures
            let data = studentRes.data;
            
            // Check if data is wrapped in a success/data structure
            if (data.success && data.data) {
              data = data.data;
            } else if (data.data && !data.fullname) {
              // If there's a 'data' property but no 'fullname' at root level
              data = data.data;
            }
            
            console.log("=== FULL Student data from API ===");
            console.log("Full response:", studentRes.data);
            console.log("Processed data:", data);
            console.log("Status:", data.status);
            console.log("Guardian name:", data.guardian_name);
            console.log("Guardian contact:", data.guardian_contact);
            console.log("Guardian address:", data.guardian_address);
            console.log("Program ID:", data.program_id);
            console.log("Year Section ID:", data.year_section_id);
            
            const formData = {
              fullname: data.fullname || "",
              studentNo: data.student_no || "",
              program_id: data.program_id ? String(data.program_id) : "",
              year_section_id: data.year_section_id ? String(data.year_section_id) : "",
              status: data.status || "",
              dob: data.dob || "",
              gender: data.gender || "",
              email: data.email || "",
              contact: data.contact || "",
              address: data.address || "",
              guardianName: data.guardian_name || "",
              guardianContact: data.guardian_contact || "",
              guardian_email: data.guardian_email || "",
              guardianAddress: data.guardian_address || "",
              username: data.username || "",
              password: "",
            };
            
            console.log("Form data being set:", formData);
            setForm(formData);
            
            // Set programs
            let programsData = [];
            if (programsRes.data && Array.isArray(programsRes.data)) {
              programsData = programsRes.data;
            } else if (programsRes.data?.success && Array.isArray(programsRes.data.data)) {
              programsData = programsRes.data.data;
            } else if (programsRes.data && Array.isArray(programsRes.data.data)) {
              programsData = programsRes.data.data;
            }
            setPrograms(programsData);
            
            // Set year sections
            let yearSectionsData = [];
            if (yearSectionsRes.data && Array.isArray(yearSectionsRes.data)) {
              yearSectionsData = yearSectionsRes.data;
            } else if (yearSectionsRes.data?.success && Array.isArray(yearSectionsRes.data.data)) {
              yearSectionsData = yearSectionsRes.data.data;
            } else if (yearSectionsRes.data && Array.isArray(yearSectionsRes.data.data)) {
              yearSectionsData = yearSectionsRes.data.data;
            }
            setYearSections(yearSectionsData);
            
          } catch (err) {
            console.error(err);
            toast.error("Failed to fetch student details");
          } finally {
            setFetchLoading(false);
          }
        };
        
        fetchData();
      }, [id]);

  // ✅ Debug: Log form state whenever it changes
  useEffect(() => {
    console.log("=== Current Form State ===");
    console.log("Status:", form.status);
    console.log("Guardian Name:", form.guardianName);
    console.log("Guardian Contact:", form.guardianContact);
    console.log("Guardian Address:", form.guardianAddress);
    console.log("Program ID:", form.program_id);
    console.log("Year Section ID:", form.year_section_id);
  }, [form]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (currentStep) => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!form.fullname.trim()) stepErrors.fullname = "Fullname is required";
      if (!form.studentNo.trim()) stepErrors.studentNo = "Student Number is required";
      if (!form.program_id) stepErrors.program_id = "Program is required";
      if (!form.year_section_id) stepErrors.year_section_id = "Year & Section is required";
      if (!form.status) stepErrors.status = "Status is required";
      if (!form.dob) stepErrors.dob = "Date of Birth is required";
      if (!form.gender) stepErrors.gender = "Gender is required";
      if (!/\S+@\S+\.\S+/.test(form.email)) {
        stepErrors.email = "Invalid email format";
      }
    
      if (!/^(\+63|0)\d{10}$/.test(form.contact)) {
        stepErrors.contact = "Invalid contact number format";
      }
      if (!form.address.trim()) stepErrors.address = "Address is required";
    }
    if (currentStep === 2) {
      if (!form.guardianName.trim()) stepErrors.guardianName = "Guardian name is required";
      if (!form.guardianContact.trim()) stepErrors.guardianContact = "Guardian contact is required";
      if (form.guardian_email && !/\S+@\S+\.\S+/.test(form.guardian_email)) {
        stepErrors.guardian_email = "Invalid guardian email format";
      }
      if (!form.guardianAddress.trim()) stepErrors.guardianAddress = "Guardian address is required";
    }
    if (currentStep === 3) {
      if (!form.username.trim()) stepErrors.username = "Username is required";
      // ✅ Password is OPTIONAL when editing - hindi na required
    }
      
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  };

  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  
  const handleUpdate = async () => {
    if (!(validateStep(1) && validateStep(2) && validateStep(3))) {
      toast.error("Please complete all required fields before saving.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullname: form.fullname,
        student_no: form.studentNo,
        program_id: form.program_id,
        year_section_id: form.year_section_id,
        status: form.status,
        dob: form.dob,
        gender: form.gender,
        email: form.email,
        contact: form.contact,
        address: form.address,
        guardian_name: form.guardianName,
        guardian_contact: form.guardianContact,
        guardian_email: form.guardian_email || null,
        guardian_address: form.guardianAddress,
        username: form.username,
      };

      // ✅ Only include password if user actually typed something
      if (form.password && form.password.trim() !== "") {
        payload.password = form.password;
      }

      const res = await toast.promise(api.put(`/students/${id}`, payload), {
        loading: "Updating student...",
        success: "Student updated successfully!",
        error: "Failed to update student.",
      });

      navigate("/registrar-student-registration", { state: { updatedStudent: res.data } });
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 bg-[#F6F7FB] min-h-screen">
          <div className="max-w-6xl mx-auto">
            {/* Stepper */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="flex items-center justify-between px-4 md:px-6">
                {[
                  { id: 1, label: "Personal Information" },
                  { id: 2, label: "Guardian Information" },
                  { id: 3, label: "Account Credentials" },
                ].map((tab) => (
                  <div key={tab.id} className="flex-1">
                    <button
                      type="button"
                      className={`w-full py-4 text-sm md:text-base border-b-2 transition-colors ${
                        step === tab.id
                          ? "text-[#064F32] border-[#064F32]"
                          : "text-gray-600 border-transparent hover:text-[#064F32]"
                      }`}
                      onClick={() => setStep(tab.id)}
                    >
                      {tab.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Panels */}
            <div className="bg-white rounded-lg shadow p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#064F32] mb-4">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Fullname</label>
                      <input value={form.fullname} 
                       onChange={handleChange("fullname")} 
                       className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                       errors.fullname ? "border-red-500" : "border-gray-300"}`} />
                       {errors.fullname && <p className="mt-1 text-xs text-red-600">{errors.fullname}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Student Number</label>
                      <input value={form.studentNo} onChange={handleChange("studentNo")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.studentNo ? "border-red-500" : "border-gray-300"}`} />
                      {errors.studentNo && <p className="mt-1 text-xs text-red-600">{errors.studentNo}</p>}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">Program</label>
                      <div className="relative w-full">
                      {fetchLoading ? (
                        <div className="flex items-center justify-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                          <span className="ml-2 text-sm text-gray-500">Loading programs...</span>
                        </div>
                      ) : (
                        <>
                          <select value={form.program_id} onChange={handleChange("program_id")} className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.program_id ? "border-red-500" : "border-gray-300"}`}>
                            <option value="">Select Program</option>
                            {programs.map((program) => (
                              <option key={program.id} value={String(program.id)}>
                                {program.program_code || program.program_name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                              size={20}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          />
                        </>
                      )}
                        </div>
                      {errors.program_id && <p className="mt-1 text-xs text-red-600">{errors.program_id}</p>}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">Year & Section</label>
                      <div className="relative w-full">
                      {fetchLoading ? (
                        <div className="flex items-center justify-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                          <span className="ml-2 text-sm text-gray-500">Loading sections...</span>
                        </div>
                      ) : (
                        <>
                          <select value={form.year_section_id} onChange={handleChange("year_section_id")} className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.year_section_id ? "border-red-500" : "border-gray-300"}`}>
                            <option value="">Select Year & Section</option>
                            {yearSections.map((ys) => (
                              <option key={ys.id} value={String(ys.id)}>
                                {ys.year_level} - {ys.section}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                              size={20}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          />
                        </>
                      )}
                        </div>
                      {errors.year_section_id && <p className="mt-1 text-xs text-red-600">{errors.year_section_id}</p>}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">Date of Birth</label>
                      <div className="relative w-full">
                      <input type="date" value={form.dob} onChange={handleChange("dob")} className={`w-full p-3 pr-10 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.dob ? "border-red-500" : "border-gray-300"}
                      [appearance:textfield]
                      [&::-webkit-calendar-picker-indicator]:opacity-0
                      [&::-webkit-calendar-picker-indicator]:absolute
                      [&::-webkit-calendar-picker-indicator]:right-3
                      [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                      />
                      <Calendar
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                    </div>
                      {errors.dob && <p className="mt-1 text-xs text-red-600">{errors.dob}</p>}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">Gender</label>
                      <div className="relative w-full">
                      <select value={form.gender} onChange={handleChange("gender")} className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.gender ? "border-red-500" : "border-gray-300"}`}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                        </div>
                      {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">Status</label>
                      <div className="relative w-full">
                      <select value={form.status} onChange={handleChange("status")} className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.status ? "border-red-500" : "border-gray-300"}`}>
                        <option value="">Select Status</option>
                        <option value="Regular">Regular</option>
                        <option value="Irregular">Irregular</option>
                      </select>
                      <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                        </div>
                      {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Email</label>
                      <input type="email" value={form.email} onChange={handleChange("email")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.email ? "border-red-500" : "border-gray-300"}`} />
                      {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                  
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Contact No.</label>
                      <input value={form.contact} onChange={handleChange("contact")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.contact ? "border-red-500" : "border-gray-300"}`}/>
                      {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Address</label>
                      <input value={form.address} onChange={handleChange("address")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.address ? "border-red-500" : "border-gray-300"}`}/>
                      {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#064F32] mb-4">Guardian Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Guardian Name</label>
                      <input value={form.guardianName} onChange={handleChange("guardianName")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.guardianName ? "border-red-500" : "border-gray-300"}`} />
                      {errors.guardianName && <p className="mt-1 text-xs text-red-600">{errors.guardianName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Guardian Contact Number</label>
                      <input value={form.guardianContact} onChange={handleChange("guardianContact")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.guardianContact ? "border-red-500" : "border-gray-300"}`} />
                      {errors.guardianContact && <p className="mt-1 text-xs text-red-600">{errors.guardianContact}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-700 mb-2">Guardian Email</label>
                      <input type="email" value={form.guardian_email} onChange={handleChange("guardian_email")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.guardian_email ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Guardian Email (Optional)" />
                      {errors.guardian_email && <p className="mt-1 text-xs text-red-600">{errors.guardian_email}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-700 mb-2">Guardian Address</label>
                      <input value={form.guardianAddress} onChange={handleChange("guardianAddress")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.guardianAddress ? "border-red-500" : "border-gray-300"}`} />
                      {errors.guardianAddress && <p className="mt-1 text-xs text-red-600">{errors.guardianAddress}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#064F32] mb-4">Account Credentials</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Username</label>
                      <input value={form.username} onChange={handleChange("username")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.username ? "border-red-500" : "border-gray-300"}`} />
                      {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Password <span className="text-gray-500 text-xs">(leave blank to keep current)</span>
                      </label>
                      <input type="password" value={form.password} onChange={handleChange("password")} className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60" placeholder="Enter new password (optional)" />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer actions */}
              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={step === 1}
                  className={`px-6 py-2 rounded-md border ${
                    step === 1
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-[#F6F7FB]"
                  }`}
                >
                  Previous
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-6 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90"
                  >
                    Next
                  </button>
                ) : (
                  <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={loading}
                  className={`px-6 py-2 rounded-md text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#2B7811] hover:opacity-90"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}