import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from '../Context/AuthContext';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  // Sidebar collapse listener
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  // Password validation
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*?]/.test(newPassword);
  const hasMinLength = newPassword.length >= 8;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;

  const getPasswordStrength = () => {
    if (isPasswordValid && newPassword.length >= 12) return "Strong";
    if (isPasswordValid) return "Medium";
    return "Weak";
  };

  const handleChangePassword = async () => {
    // Validation checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
    if (!isPasswordValid) {
      toast.error("Password does not meet all requirements!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        currentPassword: currentPassword,
        password: newPassword,
      };

      // Update password via API
      await toast.promise(
        api.put(`/change-password`, {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
        {
          loading: "Updating password...",
          success: "Password updated successfully!",
          error: "Failed to update password. Please check your current password.",
        }
      );
      
      

      // Refresh user data
      await refreshUser();

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordTouched(false);

      // Optional: redirect to profile after success
      // navigate("/profile");
    } catch (err) {
      console.error("Password update error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reusable validation item for password rules
  const ValidationItem = ({ valid, text }) => {
    // Determine color based on touched state and validation
    const getColor = () => {
      if (!passwordTouched) return "text-gray-700"; // Black when not touched
      return valid ? "text-green-600" : "text-red-500"; // Green if valid, red if not
    };

    return (
      <li className={`flex items-center gap-2 ${getColor()}`}>
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
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {text}
      </li>
    );
  };

  return (
    <div className={`flex content_padding ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
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
            <div className="flex gap-8 pl-4">
              {/* Left Side - Navigation Tabs */}
              <div className="w-64 flex-shrink-0">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors border-l-4 border-transparent text-gray-600 hover:bg-gray-50"
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
                    className="flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors border-l-4 border-[#064F32] bg-[#E8F5E9] text-[#064F32] font-medium"
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

              {/* Right Side - Content */}
              <div className="flex-1 pl-4 ml-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-8">
                    Change Password
                  </h3>

                  <div className="space-y-6 max-w-md">
                    {/* Current Password */}
                    <div>
                      <label
                        htmlFor="current-password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 transition-all pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#064F32] transition-colors focus:outline-none"
                          aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label
                        htmlFor="new-password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (!passwordTouched && e.target.value) {
                              setPasswordTouched(true);
                            }
                          }}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all pr-10 focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 transition-all pr-10${
                            newPassword && isPasswordValid
                              ? "border-green-600 focus:ring-green-500"
                              : newPassword
                              ? "border-red-500 focus:ring-red-400"
                              : "border-gray-300 focus:ring-[#064F32]"
                          }`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#064F32] transition-colors focus:outline-none"
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>

                      <p className="text-gray-600 font-medium text-sm mt-3">
                        Your password must contain at least:
                      </p>

                      <ul className="space-y-2 mt-2 text-sm">
                        <ValidationItem valid={hasUpperCase} text="1 Upper case" />
                        <ValidationItem valid={hasLowerCase} text="1 lowercase" />
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

                      {newPassword && (
                        <p
                          className={`text-sm mt-3 font-medium ${
                            getPasswordStrength() === "Strong"
                              ? "text-green-600"
                              : getPasswordStrength() === "Medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          Password strength: {getPasswordStrength()}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60  transition-all pr-10"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#064F32] transition-colors focus:outline-none"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className={`px-8 py-2.5 rounded-lg font-medium transition-colors shadow-md flex items-center gap-2 ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-orange-500 hover:bg-orange-600 text-white"
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
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