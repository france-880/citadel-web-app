import { useState, useEffect } from "react";
import { ChevronDown, Calendar, Loader2 } from "lucide-react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function NewAccount() {
  const navigate = useNavigate();

  // States
  const [step, setStep] = useState(1); // Stepper state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true); // ✅ ADD LOADING FOR FETCH
  const [form, setForm] = useState({
    fullname: "",
    college_id: "",
    dob: "",
    role: "",
    gender: "",
    address: "",
    contact: "",
    email: "",
    username: "",
    password: "",
  });

  // Fetch colleges only (no need for accounts)
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setFetchLoading(true);
        const collegesRes = await api.get("/colleges");

        // ✅ CHECK THE RESPONSE STRUCTURE
        console.log("Colleges response:", collegesRes.data);

        if (collegesRes.data.success) {
          setColleges(collegesRes.data.data); // ✅ USE data.data FOR OUR API STRUCTURE
        } else {
          toast.error("Failed to load colleges");
        }
      } catch (err) {
        console.error("Error fetching colleges:", err);
        toast.error("Failed to load colleges");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Handle input change
  const handleChange = (field) => (e) => {
    let value = e.target.value;

    // Limit contact numbers to 11 digits maximum
    if (field === "contact" && value.length > 11) {
      value = value.slice(0, 11);
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Validation per step
  const validateStep = (currentStep) => {
    const formErrors = {};

    if (currentStep === 1) {
      if (!form.fullname.trim()) formErrors.fullname = "Fullname is required";
      if (!form.college_id) formErrors.college_id = "College is required"; // ✅ UPDATED ERROR MESSAGE
      if (!form.dob) formErrors.dob = "Date of Birth is required";
      if (!form.role) formErrors.role = "Role is required";
      if (!form.gender) formErrors.gender = "Gender is required";
      if (!form.address.trim()) formErrors.address = "Address is required";
      if (!form.contact.trim())
        formErrors.contact = "Contact number is required";
      if (form.contact && !/^(\+63|0)\d{10}$/.test(form.contact)) {
        formErrors.contact = "Invalid contact number format";
      }
      if (!form.email.trim()) formErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email))
        formErrors.email = "Invalid email format";
    }

    if (currentStep === 2) {
      if (!form.username.trim()) formErrors.username = "Username is required";
      if (!form.password.trim()) formErrors.password = "Password is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Validate all steps
  const validateForm = () => validateStep(1) && validateStep(2);

  // Stepper navigation
  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(2, s + 1));
  };
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  // Save user
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please complete all required fields before saving.");
      return;
    }

    setLoading(true);

    const payload = { ...form };

    try {
      const res = await toast.promise(api.post("/accounts", payload), {
        loading: "Saving new account...",
        success: "New account registered successfully!",
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

      setAccounts((prev) => [...prev, res.data]);
      navigate("/super-admin-account", { state: { newAccount: res.data } });
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

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
                  { id: 2, label: "Account Credentials" },
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

            <div className="bg-white rounded-lg shadow p-6">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#064F32] mb-4">
                    Personal Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Fullname */}
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

                    {/* College */}
                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">
                        College
                      </label>
                      <div className="relative w-full">
                        {fetchLoading ? (
                          <div className="flex items-center justify-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                            <span className="ml-2 text-sm text-gray-500">
                              Loading colleges...
                            </span>
                          </div>
                        ) : (
                          <>
                            <select
                              value={form.college_id}
                              onChange={handleChange("college_id")}
                              className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                                errors.college_id
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Select College</option>
                              {colleges.map((college) => (
                                <option key={college.id} value={college.id}>
                                  {college.college_name}
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
                      {errors.college_id && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.college_id}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
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
                          } [appearance:textfield] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                          placeholder="mm/dd/yy"
                          max={new Date().toISOString().split("T")[0]}
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

                    {/* Role */}
                    <div className="w-full">
                      <label className="block text-sm text-gray-700 mb-2">
                        Role
                      </label>
                      <div className="relative w-full">
                        <select
                          value={form.role}
                          onChange={handleChange("role")}
                          className={`w-full p-3 pr-10 appearance-none border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                            errors.role ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Role</option>
                          <option value="super_admin">Super Admin</option>
                          <option value="program_head">Program Head</option>
                          <option value="dean">Dean</option>
                          <option value="secretary">Secretary</option>
                          <option value="prof">Professor</option>{" "}
                          {/* ✅ ADDED PROF OPTION */}
                        </select>
                        <ChevronDown
                          size={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>
                      {errors.role && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.role}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
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

                    {/* Address */}
                    <div>
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

                    {/* Contact */}
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

                    {/* Email */}
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
                  </div>
                </div>
              )}

              {/* Step 2: Account Credentials */}
              {step === 2 && (
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
                      <input
                        type="password"
                        value={form.password}
                        onChange={handleChange("password")}
                        className={`w-full p-3 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter password"
                      />
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
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

                {step < 2 ? (
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
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" /> Saving...
                      </div>
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