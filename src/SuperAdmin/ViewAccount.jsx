
import React, { useState } from "react";
import { Eye, User, GraduationCap, Mail, Key, Phone, MapPin, Calendar, Users } from "lucide-react";
import NewModalStyle from "../Components/NewModalStyle"; // import the modal


// InfoCard Component
function InfoCard({ icon: Icon, title, children, accentColor = "#064F32" }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
        <div 
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
        <h3 className="text-[17px] font-semibold" style={{ color: accentColor }}>
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// InfoItem Component
function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="mt-0.5">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-[15px] font-semibold text-gray-800 break-words">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default function ViewAccount({ account }) {
  const [showModal, setShowModal] = useState(false);

  // Sample account data for demo
  const sampleAccount = account || {
    fullname: "Super Administrator",
    department: "Administration",
    dob: "January 1, 1990",
    role: "Super Admin",
    gender: "Male",
    address: "123 Admin Street, Admin City",
    contact: "+63 912 345 6789",
    email: "admin@citadel.edu.ph",
    username: "superadmin"
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-8 h-8 text-[#FF7A00] bg-[#FF7A00]/10 px-[6px] py-[2px] rounded-md border border-[#FF7A00]/30 hover:text-[#FF7A00] hover:bg-[#FF7A00]/20 flex items-center justify-center transition-colors"
      >
        <Eye className="w-4 h-4" />
      </button>

      {showModal && (
        <NewModalStyle onClose={() => setShowModal(false)} width={1050}>
          {/* Header */}
          <div className="mb-6 pb-4 border-b-2 border-[#064F32]/20">
            <h1 className="text-[24px] font-bold text-[#064F32] mb-1">
                Account Details
            </h1>
            <p className="text-[14px] text-gray-500">
                Complete information and account details
            </p>
          </div>

          {/* ✅ Scrollable content with hidden scrollbar */}
          <div className="space-y-5 max-h-[70vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] pr-2 [&::-webkit-scrollbar]:hidden">
            {/* Personal Information */}
            <InfoCard icon={User} title="Personal Information">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem 
                  label="Full Name" 
                  value={sampleAccount.fullname} 
                  icon={User} 
                />
                <InfoItem 
                  label="Role" 
                  value={sampleAccount.role} 
                  icon={GraduationCap}
                />
                <InfoItem 
                  label="Department" 
                  value={sampleAccount.department} 
                  icon={GraduationCap} 
                />
                <InfoItem 
                  label="Gender" 
                  value={sampleAccount.gender} 
                  icon={Users} 
                />
                <InfoItem 
                  label="Date of Birth" 
                  value={sampleAccount.dob} 
                  icon={Calendar} 
                />
                <InfoItem 
                  label="Contact Number" 
                  value={sampleAccount.contact} 
                  icon={Phone} 
                />
              </div>
            </InfoCard>

            {/* Contact Information */}
            <InfoCard icon={Mail} title="Contact Information">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem 
                  label="Email Address" 
                  value={sampleAccount.email} 
                  icon={Mail} 
                />
                <InfoItem 
                  label="Phone Number" 
                  value={sampleAccount.contact} 
                  icon={Phone} 
                />
                <div className="col-span-2">
                  <InfoItem 
                    label="Home Address" 
                    value={sampleAccount.address} 
                    icon={MapPin} 
                  />
                </div>
              </div>
            </InfoCard>

            {/* Account Information */}
            <InfoCard icon={Key} title="Account Information">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem 
                  label="Username" 
                  value={sampleAccount.username} 
                  icon={User} 
                />
              </div>
            </InfoCard>
          </div>
        </NewModalStyle>
      )}
    </>
  );
}