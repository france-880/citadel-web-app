import React, { useState } from "react";
import {
  Eye,
  User,
  GraduationCap,
  Shield,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  IdCard,
  BookOpen,
  Home,
} from "lucide-react";
import NewModalStyle from "../Components/NewModalStyle";

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
        <h3
          className="text-[17px] font-semibold"
          style={{ color: accentColor }}
        >
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// InfoItem Component
function InfoItem({ label, value, icon: Icon, spanFull = false }) {
  return (
    <div
      className={`flex items-start gap-3 ${spanFull ? "col-span-full" : ""}`}
    >
      {Icon && (
        <div className="mt-0.5">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p
          className={`text-[15px] font-semibold text-gray-800 break-words ${
            !value ? "text-gray-400 italic" : ""
          }`}
        >
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

export default function View_Student({ student }) {
  const [showModal, setShowModal] = useState(false);

  // ✅ Better data handling with fallbacks
  const displayStudent = student
    ? {
        // Personal Info
        fullname: student.fullname || student.name || "N/A",
        studentNo: student.studentNo || student.student_no || "N/A",
        dob: student.dob
          ? new Date(student.dob).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A",
        gender: student.gender || "N/A",
        email: student.email || "N/A",
        contact: student.contact || "N/A",
        address: student.address || "N/A",

        // Academic Info
        program: student.program || student.program_name || "N/A",
        year: student.year || student.year_level || "N/A",
        section: student.section || "N/A",

        // Guardian Info
        guardianName: student.guardianName || student.guardian_name || "N/A",
        guardianContact:
          student.guardianContact || student.guardian_contact || "N/A",
        guardianAddress:
          student.guardianAddress || student.guardian_address || "N/A",

        // Account Info
        username: student.username || "N/A",

        // Additional fields that might exist
        createdAt: student.created_at
          ? new Date(student.created_at).toLocaleDateString()
          : "N/A",
      }
    : null;

  if (!displayStudent) {
    return (
      <button
        disabled
        className="w-8 h-8 text-gray-400 bg-gray-100 px-[6px] py-[2px] rounded-md border border-gray-300 cursor-not-allowed flex items-center justify-center"
      >
        <Eye className="w-4 h-4" />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-8 h-8 text-[#FF7A00] bg-[#FF7A00]/10 px-[6px] py-[2px] rounded-md border border-[#FF7A00]/30 hover:text-[#FF7A00] hover:bg-[#FF7A00]/20 flex items-center justify-center transition-colors duration-200 hover:scale-105"
        title="View Student Details"
      >
        <Eye className="w-4 h-4" />
      </button>

      {showModal && (
        <NewModalStyle onClose={() => setShowModal(false)} width={1050}>
          {/* Header with Student Number */}
          <div className="mb-6 pb-4 border-b-2 border-[#064F32]/20">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-[24px] font-bold text-[#064F32] mb-1">
                  Student Details
                </h1>
                <p className="text-[14px] text-gray-500">
                  Complete information and academic records
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#064F32]/10 rounded-full">
                  <IdCard className="w-4 h-4 text-[#064F32]" />
                  <span className="text-[13px] font-semibold text-[#064F32]">
                    {displayStudent.studentNo}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Scrollable content with hidden scrollbar */}
          <div className="space-y-5 max-h-[70vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]">
            <div className="pr-2 [&::-webkit-scrollbar]:hidden">
              {/* Personal Information */}
              <InfoCard
                icon={User}
                title="Personal Information"
                accentColor="#064F32"
              >
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <InfoItem
                    label="Full Name"
                    value={displayStudent.fullname}
                    icon={User}
                  />
                  <InfoItem
                    label="Student Number"
                    value={displayStudent.studentNo}
                    icon={IdCard}
                  />
                  <InfoItem
                    label="Date of Birth"
                    value={displayStudent.dob}
                    icon={Calendar}
                  />
                  <InfoItem
                    label="Gender"
                    value={displayStudent.gender}
                    icon={Users}
                  />
                  <InfoItem
                    label="Email Address"
                    value={displayStudent.email}
                    icon={Mail}
                  />
                  <InfoItem
                    label="Contact Number"
                    value={displayStudent.contact}
                    icon={Phone}
                  />
                </div>
                <div className="pt-2">
                  <InfoItem
                    label="Home Address"
                    value={displayStudent.address}
                    icon={MapPin}
                    spanFull
                  />
                </div>
              </InfoCard>

              {/* Academic Information */}
              <InfoCard
                icon={GraduationCap}
                title="Academic Information"
                accentColor="#FF7A00"
              >
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <InfoItem
                    label="Program"
                    value={displayStudent.program}
                    icon={BookOpen}
                  />
                  <InfoItem
                    label="Year Level"
                    value={displayStudent.year}
                    icon={GraduationCap}
                  />
                  <InfoItem
                    label="Section"
                    value={displayStudent.section}
                    icon={Users}
                  />
                </div>
              </InfoCard>

              {/* Guardian Information */}
              <InfoCard
                icon={Shield}
                title="Guardian Information"
                accentColor="#10B981"
              >
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <InfoItem
                    label="Guardian Name"
                    value={displayStudent.guardianName}
                    icon={User}
                  />
                  <InfoItem
                    label="Guardian Contact"
                    value={displayStudent.guardianContact}
                    icon={Phone}
                  />
                </div>
                <div className="pt-2">
                  <InfoItem
                    label="Guardian Address"
                    value={displayStudent.guardianAddress}
                    icon={Home}
                    spanFull
                  />
                </div>
              </InfoCard>

              {/* Account Information */}
              <InfoCard
                icon={Key}
                title="Account Information"
                accentColor="#8B5CF6"
              >
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <InfoItem
                    label="Username"
                    value={displayStudent.username}
                    icon={Key}
                  />
                  <InfoItem
                    label="Date Registered"
                    value={displayStudent.createdAt}
                    icon={Calendar}
                  />
                </div>
              </InfoCard>
            </div>
          </div>
        </NewModalStyle>
      )}
    </>
  );
}
