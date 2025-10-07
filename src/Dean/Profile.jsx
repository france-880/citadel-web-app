import React, { useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("Anastasha L. Bartolome");
  const [email, setEmail] = useState("anastasha@example.com");
  const [previewImage, setPreviewImage] = useState("/api/placeholder/150/150");

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

  const handleSaveChanges = () => {
    alert("Changes saved successfully!");
  };

  return (
    <div className="flex content_padding">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen">
            {/* Page header row */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-[#064F32]">
                Personal Information
              </h1>
            </div>

            {/* Main Content Area with Sidebar */}
            <div className="bg-white rounded-lg shadow-md p-8 mt-4">
              <div className="flex gap-30">
                {/* Left Side - Profile/Security Navigation */}
                <div className="w-64 flex-shrink-0">
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors border-l-4 ${
                        activeTab === "profile"
                          ? "border-[#064F32] bg-[#E8F5E9] text-[#064F32] font-medium"
                          : "border-transparent text-gray-600 hover:bg-gray-50"
                      }`}
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
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab("changepassword")}
                      className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors border-l-4 ${
                        activeTab === "changepassword"
                          ? "border-[#064F32] bg-[#E8F5E9] text-[#064F32] font-medium"
                          : "border-transparent text-gray-600 hover:bg-gray-50"
                      }`}
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
                      Change password
                    </button>
                  </div>
                </div>

                {/* Right Side - Profile Content */}
                <div className="flex-1">
                  {/* Profile Photo Section */}
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

                  {/* Form Fields */}
                  <div className="space-y-6  max-w-md">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-[100%] max-w-md px-4 py-2.5  border border-[#064F32] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32] focus:border-transparent transition-all"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064F32] focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleSaveChanges}
                      className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </main>
      </div>
    </div>
  );
}
