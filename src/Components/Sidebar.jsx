import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';

import { 
  LayoutDashboardIcon,
  GraduationCap,
  Users,
  Shield,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  FolderArchive
} from "lucide-react";

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
    { 
      label: "Dashboard", 
      path: "/super-admin-dashboard", 
      icon: LayoutDashboardIcon,
      description: "System Overview",
      roles: ["super_admin"]
    },
    { 
      label: "Academic Management", 
      path: "/super-admin-academic", 
      icon: GraduationCap,
      description: "Manage all academic",
      roles: ["super_admin"]
    },
    { 
      label: "User Management", 
      path: "/super-admin-account", 
      icon: Users,
      description: "Manage all users",
      roles: ["super_admin"]
    },
    { 
      label: "Audit Logs", 
      path: "/super-admin-logs", 
      icon: Shield,
      description: "Audit Logs",
      roles: ["super_admin"]
    },
    { 
      label: "System Settings", 
      path: "/super-admin-settings", 
      icon: Settings,
      description: "System configuration",
      roles: ["super_admin"]
    },

    // Other role menu items (keeping existing structure for non-super-admin users)
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboardIcon, roles: ["guard","dean"] },
    { label: "Daily Attendance", path: "/daily_attendance", icon: LayoutDashboardIcon, roles: ["dean"] },
    { label: "Student Registration", path: "/student_registration", icon: Users, roles: ["dean"] },
    { label: "User Management", path: "/user_management", icon: Users, roles: ["dean"] },
    { label: "Faculty List", path: "/faculty-load", icon: Users, roles: ["program_head"] },
    { label: "Report", path: "/report", icon: BarChart3, roles: ["dean"] },
    { label: "Report", path: "/prof_report", icon: BarChart3, roles: ["prof"] },
    { label: "Program", path: "/program", icon: GraduationCap, roles: ["prof"] },
    { label: "Schedule", path: "/schedule", icon: Settings, roles: ["prof"] },
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
        isCollapsed ? 'w-[0px] opacity-0 pointer-events-none' : 'w-[250px] opacity-100'
      }`}>
        <nav className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-4 border-b border-gray-100`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <img src="/images/ucc.png" alt="University Logo" className="w-[50px] h-[50px]" />
                <div>
                  <h2 className="text-lg font-bold text-[#064F32]">
                    {user?.role === 'super_admin' ? 'Super Admin' : 
                     user?.role === 'dean' ? 'Dean' :
                     user?.role === 'prof' ? 'Professor' :
                     user?.role === 'program_head' ? 'Program Head' : 'User'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'super_admin' ? 'System Control Panel' : 
                     user?.role === 'dean' ? 'Dean Panel' :
                     user?.role === 'prof' ? 'Faculty Dashboard' :
                     user?.role === 'program_head' ? 'Program Management' : 'User Dashboard'}
                  </p>
                </div>
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
                    <FolderArchive className="w-5 h-5 flex-shrink-0" />
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
                          ? "bg-[#1C4F06]/30 text-[#064F32] border-l-4 border-[#064F32]"
                          : "text-gray-700 hover:text-[#064F32] hover:bg-[#064F32]/5"
                      }`
                    }
                    title={isCollapsed ? item.label : ""}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.description && <p className="text-xs text-gray-500 truncate">{item.description}</p>}
                      </div>
                    )}
                  </NavLink>
                </li>
              );
            })}
        </ul>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#064F32] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.role === 'super_admin' ? 'SA' : user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.fullname && user.fullname !== 'Unknown User' ? user.fullname : (user?.role === 'super_admin' ? "Super Admin" : "User")}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.role === 'super_admin' ? "System Administrator" : 
                     user?.role === 'dean' ? "Dean" :
                     user?.role === 'prof' ? "Professor" :
                     user?.role === 'program_head' ? "Program Head" :
                     user?.role === 'guard' ? "Security Guard" : "User"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}