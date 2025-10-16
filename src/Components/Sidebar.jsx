import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';

import { LayoutDashboardIcon,BookCheckIcon, FolderEdit, UserPenIcon, NewspaperIcon, FolderArchiveIcon, ChevronDown, ChevronUp, Menu, X } from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth(); // kailangan para sa role-based filtering
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(() => localStorage.getItem('selectedProgram') || 'BSIT-4A');
  const [showPrograms, setShowPrograms] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

  useEffect(() => {
    localStorage.setItem('selectedProgram', selectedProgram);
  }, [selectedProgram]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new Event('sidebarToggle'));
  }, [isCollapsed]);
  

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboardIcon, roles: ["guard","dean","super_admin"] },
    { label: "Daily Attendance", path: "/daily_attendance", icon: BookCheckIcon, roles: ["dean","super_admin"] },
    { label: "Student Registration", path: "/student_registration", icon: FolderEdit, roles: ["dean","super_admin"] },
    { label: "User Management", path: "/user_management", icon: UserPenIcon, roles: ["dean","super_admin"] },
    { label: "Faculty Load", path: "/faculty-load", icon: FolderArchiveIcon, roles: ["program_head","super_admin"] },
    { label: "Faculty Loading", path: "/faculty-loading", icon: FolderArchiveIcon, roles: ["program_head","super_admin"] },
    { label: "Report", path: "/report", icon: NewspaperIcon, roles: ["dean", "super_admin"] },
    { label: "Report", path: "/prof_report", icon: NewspaperIcon, roles: ["prof", "super_admin"] },
    { label: "Program", path: "/program", icon: FolderArchiveIcon, roles: ["prof", "super_admin"] },
    { label: "Schedule", path: "/schedule", icon: FolderArchiveIcon, roles: ["prof", "super_admin"] },
  ];


  return (
    <>
      {/* Floating toggle button when collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-[90px] left-4 z-50 p-3 bg-[#064F32] text-white rounded-lg shadow-lg hover:bg-[#064F32]/90 transition-colors"
          title="Expand sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      
      <aside className={`fixed top-[70px] left-0 bottom-0 bg-[#FFFFFF] z-40 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 ${
        isCollapsed ? 'w-[0px] opacity-0 pointer-events-none' : 'w-[240px] opacity-100'
      }`}>
        <nav className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-4 border-b border-gray-100`}>
          {!isCollapsed && (
            <div className="flex items-center justify-center">
              <img src="/images/ucc.png" alt="University Logo" className="w-[60px] h-[60px]" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Program selector now styled like menu items */}


        <ul className="flex-1 px-3 py-4 space-y-1">
          {user?.role === 'prof' && (
            <li>
              <div className="px-0">
                <button
                  type="button"
                  onClick={() => setShowPrograms(v => !v)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-lg font-medium text-[15px] text-gray-700 hover:text-[#064F32] hover:bg-[#064F32]/5 transition-colors`}
                  title={isCollapsed ? "Programs" : ""}
                >
                  <span className={`inline-flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                    <FolderArchiveIcon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && "Programs"}
                  </span>
                  {!isCollapsed && (showPrograms ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />)}
                </button>
                {showPrograms && !isCollapsed && (
                  <div className="mt-2 space-y-1 ml-4">
                    {['BSIT-3A','BSIT-3B','BSIT-4A','BSIT-4C'].map((prog) => (
                      <button
                      key={prog}
                      onClick={() => {
                        setSelectedProgram(prog);
                        navigate('/program');
                      }}
                      className={`w-full px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedProgram === prog
                          ? 'bg-[#1C4F06]/30 text-[#064F32]'
                          : 'text-gray-600 hover:text-[#064F32] hover:bg-[#064F32]/5'
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
                      `group flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg font-medium text-[15px] transition-colors ${
                        isActive
                          ? "bg-[#1C4F06]/30 text-[#064F32]"
                          : "text-gray-700 hover:text-[#064F32] hover:bg-[#064F32]/5"
                      }`
                    }
                    title={isCollapsed ? item.label : ""}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
        </ul>
      </nav>
    </aside>
    </>
  );
}

