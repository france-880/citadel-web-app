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
  X
} from "lucide-react";

export default function SuperAdminSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('superAdminSidebarCollapsed') === 'true');

  useEffect(() => {
    localStorage.setItem('superAdminSidebarCollapsed', isCollapsed.toString());
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new Event('sidebarToggle'));
  }, [isCollapsed]);

  const menuItems = [
    { 
      label: "Dashboard", 
      path: "/super-admin-dashboard", 
      icon: LayoutDashboardIcon,
      description: "System Overview"
    },
    { 
      label: "College & Program Management", 
      path: "/college-program-management", 
      icon: GraduationCap,
      description: "Manage colleges and programs"
    },
    { 
      label: "User Management", 
      path: "/super-admin-user-management", 
      icon: Users,
      description: "Manage all users"
    },
    { 
      label: "Role & Permission Management", 
      path: "/role-permission-management", 
      icon: Shield,
      description: "UAC Control & Permissions"
    },
    { 
      label: "Reports & Attendance", 
      path: "/super-admin-reports", 
      icon: BarChart3,
      description: "System Reports & Analytics"
    },
    { 
      label: "System Settings", 
      path: "/system-settings", 
      icon: Settings,
      description: "System configuration"
    }
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
        isCollapsed ? 'w-[0px] opacity-0 pointer-events-none' : 'w-[260px] opacity-100'
      }`}>
        <nav className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-4 border-b border-gray-100`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <img src="/images/ucc.png" alt="University Logo" className="w-[50px] h-[50px]" />
                <div>
                  <h2 className="text-lg font-bold text-[#064F32]">Super Admin</h2>
                  <p className="text-xs text-gray-500">System Control Panel</p>
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

          {/* Navigation Menu */}
          <ul className="flex-1 px-3 py-4 space-y-2">
            {menuItems.map(item => {
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
                        <p className="text-xs text-gray-500 truncate">{item.description}</p>
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
                  <span className="text-white text-sm font-semibold">SA</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.fullname || "Super Admin"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">System Administrator</p>
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
