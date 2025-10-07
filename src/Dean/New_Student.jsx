import { useState, useEffect } from "react";
import { ChevronDown, Calendar, Loader2 } from "lucide-react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function New_Student() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // ✅ loading state
  const [form, setForm] = useState({
    fullname: "",
    studentNo: "",
    section: "",
    program: "",
    year: "",
    dob: "",
    gender: "",
    email: "",
    contact: "",
    address: "",
    guardianName: "",
    guardianContact: "",
    guardianAddress: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    api
      .get("/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

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
      if (!form.section) stepErrors.section = "Section is required";
      if (!form.program) stepErrors.program = "Program is required";
      if (!form.year) stepErrors.year = "Year is required";
      if (!form.dob) stepErrors.dob = "Date of Birth is required";
      if (!form.gender) stepErrors.gender = "Gender is required";
      if (!/\S+@\S+\.\S+/.test(form.email)) {
        stepErrors.email = "Invalid email format"; // change formErrors → stepErrors
      }
      if (!/^(\+63|0)\d{10}$/.test(form.contact)) {
        stepErrors.contact = "Invalid contact number format"; // change formErrors → stepErrors
      }
      if (!form.address.trim()) stepErrors.address = "Address is required";
    }
    if (currentStep === 2) {
      if (!form.guardianName.trim()) stepErrors.guardianName = "Guardian name is required";
      if (!form.guardianContact.trim()) stepErrors.guardianContact = "Guardian contact is required";
      if (!form.guardianAddress.trim()) stepErrors.guardianAddress = "Guardian address is required";
    }
    if (currentStep === 3) {
      if (!form.username.trim()) stepErrors.username = "Username is required";
      if (!form.password.trim()) stepErrors.password = "Password is required";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  };

  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  const handleSave = async () => {
    if (!(validateStep(1) && validateStep(2) && validateStep(3))) {
      toast.error("Please complete all required fields before saving.");
      return;
    }

    setLoading(true); // ✅ start loading


    const payload = {
      fullname: form.fullname,
      studentNo: form.studentNo,
      section: form.section,
      program: form.program,
      year: form.year,
      dob: form.dob,
      gender: form.gender,
      email: form.email,
      contact: form.contact,
      address: form.address,
      guardianName: form.guardianName,
      guardianContact: form.guardianContact,
      guardianAddress: form.guardianAddress,
      username: form.username,
      password: form.password,
    };

    try {
      // api call wrapped in toast.promise
      const res = await toast.promise(api.post("/students", payload), {
        loading: "Saving new student...",
        success: "New student registered successfully!",
        error: (err) => {
          if (err.response?.status === 422 && err.response.data?.errors) {
            const firstField = Object.keys(err.response.data.errors)[0];
            return err.response.data.errors[firstField]?.[0] || "Validation error";
          }
          return err.response?.data?.message || "Something went wrong.";
        },
      });

       // update state after success
    setStudents((prev) => [...prev, res.data]);

    // redirect kaagad after success
    navigate("/student_registration", { state: { newStudent: res.data } });

  } catch (err) {
    console.error("Save error:", err);
    // error toast already handled by toast.promise
  } finally {
    setLoading(false); // 🔄 re-enable button
  }
};


   

  return (
    <div className="flex  content_padding">
      <Sidebar />
      <div className="flex-1 ">
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
                ].map((tab, idx) => (
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
                  <div className="grid md:grid-cols-2 gap-6 ">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Fullname</label>
                      <input value={form.fullname} 
                      onChange={handleChange("fullname")} 
                      className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                      errors.fullname ? "border-red-500" : "border-gray-300"}`} 
                      placeholder="Enter fullname" />
                      {errors.fullname && <p className="mt-1 text-xs text-red-600">{errors.fullname}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Student Number</label>
                      <input value={form.studentNo} onChange={handleChange("studentNo")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.studentNo ? "border-red-500" : "border-gray-300"}`} placeholder="Enter student Number" />
                      {errors.studentNo && <p className="mt-1 text-xs text-red-600">{errors.studentNo}</p>}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2 ">Section</label>
                      <div className="relative w-full">
                      <select value={form.section} onChange={handleChange("section")} className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.section ? "border-red-500" : "border-gray-300"}`}>
                        <option value="">Select Section</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                      </select>
                      <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                        </div>
                      {errors.section && <p className="mt-1 text-xs text-red-600">{errors.section}</p>}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2 ">Program</label>
                      <div className="relative w-full">
                      <select value={form.program} onChange={handleChange("program")} className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.program ? "border-red-500" : "border-gray-300"}`}>
                        <option value="">Select Program</option>
                        <option>BSIT</option>
                        <option>BSCS</option>
                        <option>BSIS</option>
                      </select>
                      <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                        </div>
                      {errors.program && <p className="mt-1 text-xs text-red-600">{errors.program}</p>}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2 ">Year</label>
                      <div className="relative w-full">
                      <select value={form.year} onChange={handleChange("year")} className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.year ? "border-red-500" : "border-gray-300"}`}>
                        <option value="">Select Year</option>
                        <option>1st year</option>
                        <option>2nd year</option>
                        <option>3rd year</option>
                        <option>4th year</option>
                      </select>
                      <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                        </div>
                      {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
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
                      placeholder="mm/dd/yy"
                      />
                      <Calendar
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                    </div>
                      {errors.dob && <p className="mt-1 text-xs text-red-600">{errors.dob}</p>}
                    </div>


                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2 ">Gender</label>
                      <div className="relative w-full">
                      <select value={form.gender} onChange={handleChange("gender")} className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.gender ? "border-red-500" : "border-gray-300"}`}>
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                      <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                        </div>
                      {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
                    </div>



                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Email</label>
                      <input type="email" value={form.email} onChange={handleChange("email")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Email" />
                      {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Contact No.</label>
                      <input value={form.contact} onChange={handleChange("contact")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.contact ? "border-red-500" : "border-gray-300"}`} placeholder="+63" />
                      {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Address</label>
                      <input value={form.address} onChange={handleChange("address")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.address ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Address" />
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
                      <input value={form.guardianName} onChange={handleChange("guardianName")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.guardianName ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Name" />
                      {errors.guardianName && <p className="mt-1 text-xs text-red-600">{errors.guardianName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Guardian Contact Number</label>
                      <input value={form.guardianContact} onChange={handleChange("guardianContact")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.guardianContact ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Number" />
                      {errors.guardianContact && <p className="mt-1 text-xs text-red-600">{errors.guardianContact}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-700 mb-2">Guardian Address</label>
                      <input value={form.guardianAddress} onChange={handleChange("guardianAddress")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.guardianAddress ? "border-red-500" : "border-gray-300"}`} placeholder="Enter Address" />
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
                      <input value={form.username} onChange={handleChange("username")} className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.username ? "border-red-500" : "border-gray-300"}`} placeholder="Enter username" />
                      {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Password</label>
                      <input type="password" value={form.password} onChange={handleChange("password")} className={`w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${errors.password ? "border-red-500" : "border-gray-300"}`} placeholder="Enter password" />
                      {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
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
                    onClick={handleSave}
                  disabled={loading} // ✅ disable while loading
                  className={`px-6 py-2 rounded-md text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#2B7811] hover:opacity-90"
                  }`}
                  >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
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