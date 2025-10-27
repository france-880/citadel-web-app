import React, { useState } from "react";
import { Eye, User, GraduationCap, Shield, Key, Mail, Phone, MapPin, Calendar, Users } from "lucide-react";
import NewModalStyle from "../Components/NewModalStyle"; // import the modal


// InfoCard Component
function InfoCard({ icon: Icon, title, children, accentColor = "#064F32" }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex Eyems-center gap-3 mb-4 pb-3 border-b border-gray-200">
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

export default function View_Student({ student }) {
  const [showModal, setShowModal] = useState(false);

  // Sample student data for demo
  const sampleStudent = student || {
    fullname: "Juan Dela Cruz",
    studentNo: "2024-0001",
    section: "BSIT-3A",
    program: "Bachelor of Science in Information Technology",
    year: "3rd Year",
    dob: "January 15, 2003",
    gender: "Male",
    email: "juan.delacruz@university.edu",
    contact: "+63 912 345 6789",
    address: "123 Main Street, Barangay San Isidro, Las Piñas City, Metro Manila",
    guardianName: "Maria Dela Cruz",
    guardianContact: "+63 918 765 4321",
    guardianAddress: "123 Main Street, Barangay San Isidro, Las Piñas City, Metro Manila",
    username: "jdelacruz2024"
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
              Student Details
            </h1>
            <p className="text-[14px] text-gray-500">
              Complete information and academic records
            </p>
          </div>

          <div className="space-y-5">
            {/* Personal Information */}
            <InfoCard icon={User} title="Personal Information">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem 
                  label="Full Name" 
                  value={sampleStudent.fullname ?? sampleStudent.name} 
                  icon={User} 
                />
                <InfoItem 
                  label="Student Number" 
                  value={sampleStudent.studentNo} 
                  icon={GraduationCap} 
                />
                <InfoItem 
                  label="Date of Birth" 
                  value={sampleStudent.dob} 
                  icon={Calendar} 
                />
                <InfoItem 
                  label="Gender" 
                  value={sampleStudent.gender} 
                  icon={Users} 
                />
                <InfoItem 
                  label="Email Address" 
                  value={sampleStudent.email} 
                  icon={Mail} 
                />
                <InfoItem 
                  label="Contact Number" 
                  value={sampleStudent.contact} 
                  icon={Phone} 
                />
              </div>
              <div className="pt-2">
                <InfoItem 
                  label="Home Address" 
                  value={sampleStudent.address} 
                  icon={MapPin} 
                />
              </div>
            </InfoCard>

            {/* Academic Information */}
            <InfoCard icon={GraduationCap} title="Academic Information">
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <InfoItem 
                  label="Program" 
                  value={sampleStudent.program} 
                />
                <InfoItem 
                  label="Year Level" 
                  value={sampleStudent.year ?? sampleStudent.level} 
                />
                <InfoItem 
                  label="Section" 
                  value={sampleStudent.section} 
                />
              </div>
            </InfoCard>

            {/* Guardian Information */}
            <InfoCard icon={Shield} title="Guardian Information">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem 
                  label="Guardian Name" 
                  value={sampleStudent.guardianName} 
                  icon={User} 
                />
                <InfoItem 
                  label="Guardian Contact" 
                  value={sampleStudent.guardianContact} 
                  icon={Phone} 
                />
              </div>
              <div className="pt-2">
                <InfoItem 
                  label="Guardian Address" 
                  value={sampleStudent.guardianAddress} 
                  icon={MapPin} 
                />
              </div>
            </InfoCard>

            {/* Account Information */}
            <InfoCard icon={Key} title="Account Information">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoItem 
                  label="Username" 
                  value={sampleStudent.username} 
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