import { useState, useEffect } from "react";
import { ChevronDown, Calendar, Loader2, Eye, EyeOff } from "lucide-react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { programAPI, yearSectionAPI, studentAPI } from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function New_Student() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Backend data states
  const [programs, setPrograms] = useState([]);
  const [yearSections, setYearSections] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

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
    guardianAddress: "",
    username: "",
    password: "",
  });

  // Password validation
  const hasUpperCase = /[A-Z]/.test(form.password);
  const hasLowerCase = /[a-z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);
  const hasSpecialChar = /[!@#$%^&*?]/.test(form.password);
  const hasMinLength = form.password.length >= 8;
  const isPasswordValid =
    hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;

  // Reusable validation item for password rules
  const ValidationItem = ({ valid, text }) => (
    <li
      className={`flex items-center gap-2 ${
        valid ? "text-green-600" : "text-red-500"
      }`}
    >
      {valid ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span>{text}</span>
    </li>
  );

  // ✅ Fixed data fetching for year sections
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoadingData(true);

        // Fetch programs
        const programsResponse = await programAPI.getAll("/programs");
        let programsData = [];
        if (programsResponse.data && Array.isArray(programsResponse.data)) {
          programsData = programsResponse.data;
        } else if (
          programsResponse.data &&
          programsResponse.data.success &&
          Array.isArray(programsResponse.data.data)
        ) {
          programsData = programsResponse.data.data;
        } else if (
          programsResponse.data &&
          Array.isArray(programsResponse.data.data)
        ) {
          programsData = programsResponse.data.data;
        }
        setPrograms(programsData);

        // ✅ Fetch year sections (combined year_level and section)
        const yearSectionsResponse = await yearSectionAPI.getAll(
          "/year-sections"
        );
        let yearSectionsData = [];

        if (
          yearSectionsResponse.data &&
          Array.isArray(yearSectionsResponse.data)
        ) {
          yearSectionsData = yearSectionsResponse.data;
        } else if (
          yearSectionsResponse.data &&
          yearSectionsResponse.data.success &&
          Array.isArray(yearSectionsResponse.data.data)
        ) {
          yearSectionsData = yearSectionsResponse.data.data;
        } else if (
          yearSectionsResponse.data &&
          Array.isArray(yearSectionsResponse.data.data)
        ) {
          yearSectionsData = yearSectionsResponse.data.data;
        }

        console.log("Year Sections Data:", yearSectionsData);
        setYearSections(yearSectionsData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load form data");
        setYearSections([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDropdownData();
  }, []);

  // ❌ REMOVED: Problematic student fetch that was causing errors
  // useEffect(() => {
  //   studentAPI
  //     .getAll("/students")
  //     .then((res) => setStudents(res.data))
  //     .catch((err) => console.error(err));
  // }, []);

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    // Limit contact numbers to 11 digits maximum
    if (
      (field === "contact" || field === "guardianContact") &&
      value.length > 11
    ) {
      value = value.slice(0, 11);
    }

    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (currentStep) => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!form.fullname.trim()) stepErrors.fullname = "Fullname is required";
      if (!form.studentNo.trim())
        stepErrors.studentNo = "Student Number is required";
      if (!form.program_id) stepErrors.program_id = "Program is required";
      if (!form.year_section_id)
        stepErrors.year_section_id = "Year & Section is required";
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
      if (!form.guardianName.trim())
        stepErrors.guardianName = "Guardian name is required";
      if (!/^(\+63|0)\d{10}$/.test(form.guardianContact)) {
        stepErrors.guardianContact = "Invalid contact number format";
      }
      if (!form.guardianAddress.trim())
        stepErrors.guardianAddress = "Guardian address is required";
    }
    if (currentStep === 3) {
      if (!form.username.trim()) stepErrors.username = "Username is required";
      if (!isPasswordValid) {
        stepErrors.password = "Password does not meet all requirements";
      }
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const goNext = () => {
    console.log("Current form data:", form);
    console.log("Current step:", step);

    if (validateStep(step)) {
      console.log("Validation passed, moving to next step");
      setStep((s) => Math.min(3, s + 1));
    } else {
      console.log("Validation failed with errors:", errors);
    }
  };

  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  // ✅ FIXED handleSave function
  const handleSave = async () => {
    if (!(validateStep(1) && validateStep(2) && validateStep(3))) {
      toast.error("Please complete all required fields before saving.");
      return;
    }

    setLoading(true);

    // ✅ USE SNAKE_CASE FIELD NAMES TO MATCH BACKEND
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
      guardian_address: form.guardianAddress,
      username: form.username,
      password: form.password,
    };

    console.log("📤 Sending payload:", payload);

    try {
      await toast.promise(studentAPI.create(payload), {
        loading: "Saving new student...",
        success: "New student registered successfully!",
        error: (err) => {
          if (err.response?.status === 422 && err.response.data?.errors) {
            const firstField = Object.keys(err.response.data.errors)[0];
            return (
              err.response.data.errors[firstField]?.[0] || "Validation error"
            );
          }
          return err.response?.data?.message || "Something went wrong.";
        },
      });

      // ✅ Navigate with refresh trigger
      navigate("/dean-student-registration", {
        state: { shouldRefresh: true },
      });
    } catch (err) {
      console.error("Save error:", err);
      console.error("Error details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Loading state for dropdown data
  if (isLoadingData) {
    return (
      <div className="flex content_padding">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6 bg-[#F6F7FB] min-h-screen">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064F32]"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex content_padding">
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
                  <h2 className="text-lg font-semibold text-[#064F32] mb-4">
                    Personal Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Fullname
                      </label>
                      <input
                        value={form.fullname}
                        onChange={handleChange("fullname")}
                        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.fullname ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter fullname"
                      />
                      {errors.fullname && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.fullname}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Student Number
                      </label>
                      <input
                        value={form.studentNo}
                        onChange={handleChange("studentNo")}
                        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.studentNo
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter student Number"
                      />
                      {errors.studentNo && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.studentNo}
                        </p>
                      )}
                    </div>

                    {/* ✅ PROGRAM DROPDOWN */}
                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">
                        Program
                      </label>
                      <div className="relative w-full">
                        <select
                          value={form.program_id}
                          onChange={handleChange("program_id")}
                          className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                            errors.program_id
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Program</option>
                          {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                              {program.program_name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>
                      {errors.program_id && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.program_id}
                        </p>
                      )}
                    </div>

                    {/* ✅ YEAR & SECTION DROPDOWN */}
                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">
                        Year & Section
                      </label>
                      <div className="relative w-full">
                        <select
                          value={form.year_section_id}
                          onChange={handleChange("year_section_id")}
                          className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                            errors.year_section_id
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Year & Section</option>
                          {yearSections.map((ys) => (
                            <option key={ys.id} value={ys.id}>
                              {ys.year_level} - {ys.section}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>
                      {errors.year_section_id && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.year_section_id}
                        </p>
                      )}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <div className="relative w-full">
                        <input
                          type="date"
                          value={form.dob}
                          onChange={handleChange("dob")}
                          className={`w-full p-3 pr-10 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                            errors.dob ? "border-red-500" : "border-gray-300"
                          }
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
                      {errors.dob && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.dob}
                        </p>
                      )}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">
                        Gender
                      </label>
                      <div className="relative w-full">
                        <select
                          value={form.gender}
                          onChange={handleChange("gender")}
                          className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                            errors.gender ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>
                      {errors.gender && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">
                        Status
                      </label>
                      <div className="relative w-full">
                        <select
                          value={form.status}
                          onChange={handleChange("status")}
                          className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                            errors.status ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Status</option>
                          <option value="Regular">Regular</option>
                          <option value="Irregular">Irregular</option>
                        </select>
                        <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>
                      {errors.status && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.status}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter Email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Contact No.
                      </label>
                      <input
                        value={form.contact}
                        onChange={handleChange("contact")}
                        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.contact ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="+63"
                      />
                      {errors.contact && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.contact}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        value={form.address}
                        onChange={handleChange("address")}
                        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter Address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#064F32] mb-4">
                    Guardian Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Guardian Name
                      </label>
                      <input
                        value={form.guardianName}
                        onChange={handleChange("guardianName")}
                        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.guardianName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter Name"
                      />
                      {errors.guardianName && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.guardianName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Guardian Contact Number
                      </label>
                      <input
                        value={form.guardianContact}
                        onChange={handleChange("guardianContact")}
                        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.guardianContact
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="09"
                      />
                      {errors.guardianContact && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.guardianContact}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-700 mb-2">
                        Guardian Address
                      </label>
                      <input
                        value={form.guardianAddress}
                        onChange={handleChange("guardianAddress")}
                        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.guardianAddress
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter Address"
                      />
                      {errors.guardianAddress && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.guardianAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#064F32] mb-4">
                    Account Credentials
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        value={form.username}
                        onChange={handleChange("username")}
                        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.username ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter username"
                      />
                      {errors.username && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.username}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={handleChange("password")}
                          className={`w-full p-3 pr-12 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.password}
                        </p>
                      )}

                      <div className="mt-3">
                        <p className="text-gray-600 font-medium text-sm">
                          Your password must contain at least:
                        </p>
                        <ul className="space-y-2 mt-2 text-sm">
                          <ValidationItem
                            valid={hasUpperCase}
                            text="1 Upper case"
                          />
                          <ValidationItem
                            valid={hasLowerCase}
                            text="1 lowercase"
                          />
                          <ValidationItem valid={hasNumber} text="1 number" />
                          <ValidationItem
                            valid={hasSpecialChar}
                            text="1 special character (example: # ? ! &)"
                          />
                          <ValidationItem
                            valid={hasMinLength}
                            text="atleast 8 characters"
                          />
                        </ul>
                      </div>
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