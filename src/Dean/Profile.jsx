import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext"; // optional if you have auth context

export default function Profile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth() || {}; // current logged-in user if available
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState("/api/placeholder/150/150");

  // ✅ Profile fields (mirroring your Edit_User.jsx)
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    contact: "",
    department: "",
    dob: "",
    gender: "",
    address: "",
    username: "",
  });

  // ✅ Fetch user info (if auth context available)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.id) return; // only load if logged in
        // Use /profile endpoint which works for users from any table
        const res = await api.get(`/profile`);
        console.log('Profile API response:', res.data); // Debug log
        setForm({
          fullname: res.data.fullname || "",
          email: res.data.email || "",
          contact: res.data.contact || "",
          department: res.data.department || "",
          dob: res.data.dob || "",
          gender: res.data.gender || "",
          address: res.data.address || "",
          username: res.data.username || "",
        });
        if (res.data.profileImage) setPreviewImage(res.data.profileImage);
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast.error("Failed to load profile details");
      }
    };
    fetchProfile();
  }, [user]);

  // ✅ Input change handler
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // ✅ Image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Save profile
const handleSaveChanges = async () => {
  if (!form.fullname.trim() || !form.email.trim()) {
    toast.error("Please fill out all required fields!");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    toast.error("Invalid email format!");
    return;
  }

  setIsSaving(true);
  try {
    // Use the profile-specific endpoint for users updating their own profile
    await toast.promise(api.put(`/profile`, form), {
      loading: "Saving profile...",
      success: "Profile updated successfully!",
      error: "Failed to update profile",
    });
    
    // Refresh user data if using auth context
    if (refreshUser) {
      await refreshUser();
    }
  } catch (error) {
    console.error('Profile update error:', error);
    // Handle specific error messages
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-[#064F32]">
              Personal Information
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex gap-8">
              {/* Left Side Navigation */}
              <div className="w-64 flex-shrink-0">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors border-l-4 border-[#064F32] bg-[#E8F5E9] text-[#064F32] font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Edit profile
                  </button>

                  <button
                    onClick={() => navigate("/changepassword")}
                    className="flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors border-l-4 border-transparent text-gray-600 hover:bg-gray-50"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Change Password
                  </button>
                </div>
              </div>

              {/* Right Side Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-8">
                  Edit Profile
                </h3>

                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-200 to-purple-300 border-4 border-white shadow-lg">
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 w-10 h-10 bg-[#064F32] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#053d27] transition-colors shadow-lg"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.fullname}
                      onChange={handleChange("fullname")}
                      className="w-full px-4 py-2.5 border border-[#064F32] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      value={form.contact}
                      onChange={handleChange("contact")}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]"
                    />
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className={`px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-md ${
                        isSaving ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
