import { useState, useEffect } from "react";
import { ChevronDown, Calendar, Loader2 } from "lucide-react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from '../Context/AuthContext'; 


export default function EditAccount() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { user, refreshUser } = useAuth();
  const { id } = useParams(); // get account id from route
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [colleges, setColleges] = useState([]);
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

  
  // Fetch existing account details and colleges
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        const [accountRes, collegesRes] = await Promise.all([
          api.get(`/accounts/${id}`),
          api.get("/colleges")
        ]);
        
        // Set account data
        const accountData = accountRes.data;
        setForm({
          fullname: accountData.fullname || "",
          department: accountData.department || "",
          dob: accountData.dob || "",
          role: accountData.role || "",
          gender: accountData.gender || "",
          address: accountData.address || "",
          contact: accountData.contact || "",
          email: accountData.email || "",
          username: accountData.username || "",
          password: "", // Don't populate password field
        });
        
        // Set colleges data - check response structure
        if (collegesRes.data.success) {
          setColleges(collegesRes.data.data || []); // Use data.data for API structure
        } else {
          setColleges([]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (currentStep) => {
    const formErrors = {};

    if (currentStep === 1) {
      if (!form.fullname.trim()) formErrors.fullname = "Fullname is required";
      if (!form.department) formErrors.department = "Department is required";
      if (!form.dob) formErrors.dob = "Date of Birth is required";
      if (!form.role) formErrors.role = "Role is required";
      if (!form.gender) formErrors.gender = "Gender is required";
      if (!form.address.trim()) formErrors.address = "Address is required";
      if (!form.contact.trim()) formErrors.contact = "Contact number is required";
      if (form.contact && !/^(\+63|0)\d{10}$/.test(form.contact)) {
        formErrors.contact = "Invalid contact number format";
      }
      if (!form.email.trim()) formErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) formErrors.email = "Invalid email format";
    }

    if (currentStep === 2) {
      if (!form.username.trim()) formErrors.username = "Username is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

   // Validate all steps
  const validateForm = () => validateStep(1) && validateStep(2);

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(2, s + 1));
  };
  const goPrev = () => setStep((s) => Math.max(1, s - 1));


  const handleUpdate = async () => {
    console.log('BUTTON CLICKED - handleUpdate started'); // Add this first
    console.log('Token in localStorage:', localStorage.getItem('token')); // Debug token
    console.log('Current user from AuthContext:', user); // Debug current user
  
    if (!validateForm()) {
      toast.error("Please complete all required fields before saving.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullname: form.fullname,
        college_id: form.college_id,
        dob: form.dob,
        role: form.role,
        gender: form.gender,
        address: form.address,
        contact: form.contact,
        email: form.email,
        username: form.username,
      };

      // ✅ Only include password if user actually typed something
      if (form.password && form.password.trim() !== "") {
        payload.password = form.password;
      }

      const res = await toast.promise(api.put(`/accounts/${id}`, payload), {
        loading: "Updating account...",
        success: "Account updated successfully!",
        error: "Failed to update account.",
      });


 // Check if editing current logged-in user
    console.log('Current user ID:', user?.id);
    console.log('Editing account ID:', id);
    
    if (user && user.id == id) { // Use == to handle string/number comparison
      console.log('Refreshing current user data...');
      await refreshUser();
    }

      navigate("/super-admin-account", { state: { updatedAccount: res.data } });
    } catch (err) {
      console.error("Update error:", err);
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
                {[{ id: 1, label: "Personal Information" }, { id: 2, label: "Account Credentials" }].map(
                  (tab) => (
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
                  )
                )}
              </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#064F32] mb-4">Personal Information</h2>
              {/* same form layout as NewAccount */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* fullname */}
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
                  />
                  {errors.fullname && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.fullname}
                    </p>
                  )}
                </div>

               
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
                            errors.college_id ? "border-red-500" : "border-gray-300"}`}
                          >
                            <option value="">Select College</option>
                            {colleges.map(college => (
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
                      <p className="mt-1 text-xs text-red-600">{errors.college_id}</p>
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
                        } [appearance:textfield] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                      />
                      <Calendar
                        size={20}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>
                    {errors.dob && (
                      <p className="mt-1 text-xs text-red-600">{errors.dob}</p>
                    )}
                  </div>

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
                        <option>Super Admin</option>
                        <option>Program Head</option>
                        <option>Dean</option>
                        <option>Secretary</option>
                        <option>Guard</option>
                      </select>
                      <ChevronDown
                        size={20}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>
                    {errors.role && (
                      <p className="mt-1 text-xs text-red-600">{errors.role}</p>
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
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                      <ChevronDown
                        size={20}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>
                    {errors.gender && (
                      <p className="mt-1 text-xs text-red-600">{errors.gender}</p>
                    )}
                  </div>


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
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-600">{errors.address}</p>
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
                    />
                    {errors.contact && (
                      <p className="mt-1 text-xs text-red-600">{errors.contact}</p>
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
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>
                  </div>
              </div>
                )}

            {/* Step 2: Account Credentials */}
            {step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#064F32] mb-4">Account Credentials</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Username</label>
                      <input
                        value={form.username}
                        onChange={handleChange("username")}
                        className={`w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 ${
                          errors.username ? "border-red-500" : "border-gray-300"
                        }`}
                      />
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

                {step < 2 ? (
                  <button type="button" onClick={goNext} className="px-6 py-2 rounded-md text-white bg-[#FF7A00] hover:opacity-90">
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