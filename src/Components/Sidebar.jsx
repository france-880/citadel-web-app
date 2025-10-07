import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';

import { LayoutDashboardIcon,BookCheckIcon, FolderEdit, UserPenIcon, NewspaperIcon, FolderArchiveIcon, ChevronDown, ChevronUp } from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth(); // kailangan para sa role-based filtering
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(() => localStorage.getItem('selectedProgram') || 'BSIT-4A');
  const [showPrograms, setShowPrograms] = useState(true);

  useEffect(() => {
    localStorage.setItem('selectedProgram', selectedProgram);
  }, [selectedProgram]);
  

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboardIcon, roles: ["guard","dean","super_admin"] },
    { label: "Daily Attendance", path: "/daily_attendance", icon: BookCheckIcon, roles: ["dean","super_admin"] },
    { label: "Student Registration", path: "/student_registration", icon: FolderEdit, roles: ["dean","super_admin"] },
    { label: "User Management", path: "/user_management", icon: UserPenIcon, roles: ["dean","super_admin"] },
    { label: "Scheduling", path: "/scheduling", icon: FolderArchiveIcon, roles: ["program_head","super_admin"] },
    { label: "Report", path: "/report", icon: NewspaperIcon, roles: ["dean", "super_admin"] },
    { label: "Report", path: "/prof_report", icon: NewspaperIcon, roles: ["prof", "super_admin"] },
    { label: "Program", path: "/program", icon: FolderArchiveIcon, roles: ["prof", "super_admin"] },
    { label: "Schedule", path: "/schedule", icon: FolderArchiveIcon, roles: ["prof", "super_admin"] },
  ];


  return (

    
    <aside className="fixed top-[70px] left-0 bottom-0 w-[240px] bg-[#FFFFFF] z-40 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.15)]">
      <nav className="flex flex-col mt-[30px]">
        <div className="flex items-center justify-center mb-[20px]">
          <img src="/images/ucc.png" alt="University Logo" className="w-[80px] h-[80px] " />
        </div>

        {/* Program selector now styled like menu items */}


        <ul className="px-4 space-y-2">
          {user?.role === 'prof' && (
            <li>
              <div className="px-0">
                <button
                  type="button"
                  onClick={() => setShowPrograms(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium text-[15px] bg-[#FFFFFF] text-gray-700 hover:text-[#064F32] hover:bg-[#064F32]/5"
                >
                  <span className="inline-flex items-center gap-3">
                    <FolderArchiveIcon className="w-5 h-5" />
                    Programs
                  </span>
                  {showPrograms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showPrograms && (
                  <div className="mt-3 space-y-3">
                    {['BSIT-3A','BSIT-3B','BSIT-4A','BSIT-4C'].map((prog) => (
                      <button
                      key={prog}
                      onClick={() => {
                        setSelectedProgram(prog);
                        navigate('/program');
                      }}
                      className={`w-full px-4 py-3 rounded-md  transition bg-[#FFFFFF] text-gray-700 hover:text-[#064F32] hover:bg-[#064F32]/5 ${
                        selectedProgram === prog
                          ? 'bg-[#1C4F06]/30 text-[#064F32]'
                          : ' text-gray-700  hover:text-[#064F32] hover:opacity-90'
                      }`}
                    >
                      {prog.replace('-', ' ')}
                    </button>
                    
                    ))}
                  </div>
                )}
              </div>
            </li>
          )}
          {menuItems
            .filter(item => item.roles.includes(user?.role))
            .filter(item => !(user?.role === 'prof' && item.label === 'Program'))
            .map(item => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[15px] transition-colors ${
                        isActive
                          ? "bg-[#1C4F06]/30 text-[#064F32]"
                          : "text-gray-700 hover:text-[#064F32] hover:bg-[#064F32]/5"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
        </ul>
      </nav>
    </aside>
  );
}

