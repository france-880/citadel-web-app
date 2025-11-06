import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import api from "../api/axios";

import {
  LayoutDashboardIcon,
  GraduationCap,
  Users,
  Book,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  FolderArchive,
  CalendarCheck,
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth(); // kailangan para sa role-based filtering
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(
    () => localStorage.getItem("selectedProgram") || "BSIT-4A"
  );
  const [showPrograms, setShowPrograms] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [dynamicSections, setDynamicSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);

  useEffect(() => {
    localStorage.setItem("selectedProgram", selectedProgram);
  }, [selectedProgram]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new Event("sidebarToggle"));
  }, [isCollapsed]);

  // Fetch dynamic sections for professors
  const fetchDynamicSections = async () => {
    if (user?.role !== "prof") return;

    setLoadingSections(true);
    try {
      // Get academic year and semester with fallbacks
      const academicYear =
        sessionStorage.getItem("currentAcademicYear") || "2024";
      const semester = sessionStorage.getItem("currentSemester") || "First";
      
      // Ensure we have valid values
      const effectiveAcademicYear = academicYear || "2024";
      const effectiveSemester = semester || "First";

      // First try with the current academic year and semester
      let response = await api.get(`/faculty-loads/${user.id}/sections`, {
        params: {
          academic_year: effectiveAcademicYear,
          semester: effectiveSemester,
        },
      });

      let sections = response.data || [];

      // If no sections found, try multiple academic year/semester combinations in parallel
      if (sections.length === 0) {
        // Try most common combinations first (limit to avoid too many requests)
        const combinationsToTry = [
          ['2024', 'First'],
          ['2526', 'First'],
          ['2024', 'Second'],
          ['2526', 'Second'],
          ['2025', 'First'],
        ];
        
        const allSections = [];
        const sectionSet = new Set();

        // Make parallel requests with early exit if we find data
        const requests = combinationsToTry.map(([year, sem]) =>
          api.get(`/faculty-loads/${user.id}/sections`, {
            params: {
              academic_year: year,
              semester: sem,
            },
          }).then(response => {
            const trySections = response.data || [];
            for (const section of trySections) {
              const sectionStr = section.toString().trim();
              if (sectionStr && !sectionSet.has(sectionStr)) {
                allSections.push(sectionStr);
                sectionSet.add(sectionStr);
              }
            }
            return trySections.length;
          }).catch(() => 0) // Ignore errors, return 0
        );

        // Wait for all requests to complete (execute in parallel)
        await Promise.allSettled(requests);

        if (allSections.length > 0) {
          sections = allSections.sort();
          console.log(`Found ${sections.length} sections across multiple academic years/semesters`);
        }
      }

      setDynamicSections(sections);
      console.log("Loaded dynamic sections for professor:", sections);
    } catch (error) {
      console.error("Error fetching dynamic sections:", error);
      // Fallback to static sections if API fails
      setDynamicSections(["BSIT-3A", "BSIT-3B", "BSIT-4A", "BSIT-4C"]);
    } finally {
      setLoadingSections(false);
    }
  };

  // Fetch sections when component mounts or user changes
  useEffect(() => {
    if (user?.role === "prof" && user?.id) {
      fetchDynamicSections();
    }
  }, [user?.role, user?.id]);

  const menuItems = [
    // Super Admin specific menu items
    {
      label: "Dashboard",
      path: "/super-admin-dashboard",
      icon: LayoutDashboardIcon,
      description: "System Overview",
      roles: ["super_admin"],
    },
    {
      label: "Academic Management",
      path: "/super-admin-academic",
      icon: GraduationCap,
      description: "Manage all academic",
      roles: ["super_admin"],
    },
    {
      label: "Account Management",
      path: "/super-admin-account",
      icon: Users,
      description: "Manage all users",
      roles: ["super_admin"],
    },
    {
      label: "Student Summary",
      path: "/super-admin-student-summary",
      icon: Book,
      description: "View student details",
      roles: ["super_admin"],
    },
    {
      label: "Reports",
      path: "/super-admin-reports",
      icon: BarChart3,
      description: "Generate system reports",
      roles: ["super_admin"],
    },
    {
      label: "System Maintenance",
      path: "/super-admin-system-maintenance",
      icon: Settings,
      description: "System settings & backups",
      roles: ["super_admin"],
    },

    // Dean specific menu items
    { label: "Dashboard",
      path: "/dean-dashboard",
      icon: LayoutDashboardIcon,
      description: "Overview of student records and attendance",
      roles: ["dean"]
    },
    { label: "Daily Attendance",
      path: "/dean-daily-attendance",
      icon: CalendarCheck,
      description: "Overview of daily attendance",
      roles: ["dean"]
    },
    { label: "User Management",
      path: "/dean-user-management",
      icon: Users,
      description: "Manage user accounts",
      roles: ["dean"]
    },
    { label: "Report",
      path: "/dean-report",
      icon: BarChart3,
      description: "Generate reports",
      roles: ["dean"]
    },

    // Program Head specific menu items
    {
      label: "Faculty List",
      path: "/faculty-list",
      icon: Users,
      description: "Manage faculty loads",
      roles: ["program_head"],
    },
    {
      label: "Section Offering",
      path: "/section-offering",
      icon: FolderArchive,
      description: "Manage section offerings",
      roles: ["program_head"],
    },

    // Professor specific menu items
    {
      label: "Program",
      path: "/program",
      icon: GraduationCap,
      description: "View program details",
      roles: ["prof"],
    },
    {
      label: "Schedule",
      path: "/schedule",
      icon: Settings,
      description: "View class schedule",
      roles: ["prof"],
    },
    {
      label: "Student Registration",
      path: "/registrar-student-registration",
      icon: Users,
      description: "Manage student registration",
      roles: ["registrar"],
    },
    {
      label: "Report",
      path: "/prof_report",
      icon: BarChart3,
      description: "Generate reports",
      roles: ["prof"],
    },
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

      <aside
        className={`fixed top-[70px] left-0 bottom-0 bg-[#FFFFFF] z-40 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.15)] transition-all duration-300 ${
          isCollapsed
            ? "w-[0px] opacity-0 pointer-events-none"
            : "w-[250px] opacity-100"
        }`}
      >
        <nav className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center relative ${
              isCollapsed ? "justify-center" : "justify-center"
            } px-4 py-4 border-b border-gray-100`}
          >
              <div className="flex items-center justify-center">
                <img
                  src="/images/ucc.png"
                  alt="University Logo"
                  className="w-[58px] h-[58px]"
                />
              </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <Menu className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Program selector now styled like menu items */}

          <ul className="flex-1 px-3 py-4 space-y-1">
            {user?.role === "prof" && (
              <li>
                <div className="px-0">
                  <button
                    type="button"
                    onClick={() => setShowPrograms((v) => !v)}
                    className={`w-full flex items-center ${
                      isCollapsed ? "justify-center" : "justify-between"
                    } px-3 py-3 rounded-lg font-medium text-[15px] text-gray-700 hover:text-[#064F32] hover:bg-[#064F32]/5 transition-colors`}
                    title={isCollapsed ? "Programs" : ""}
                  >
                    <span
                      className={`inline-flex items-center ${
                        isCollapsed ? "" : "gap-3"
                      }`}
                    >
                      <FolderArchive className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && "Programs"}
                    </span>
                    {!isCollapsed &&
                      (showPrograms ? (
                        <ChevronUp className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      ))}
                  </button>
                  {showPrograms && !isCollapsed && (
                    <div className="mt-2 space-y-1 ml-4">
                      {loadingSections ? (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Loading sections...
                        </div>
                      ) : dynamicSections.length > 0 ? (
                        dynamicSections.map((prog) => {
                          // Display formatted section as-is (e.g., "BSCS 4C")
                          // Convert to storage format for localStorage (e.g., "BSCS-4C")
                          const displayName = prog.trim(); // Already formatted from backend
                          const storageKey = prog.replace(/\s+/g, '-').toUpperCase(); // Convert to storage format
                          
                          // Check if selected - handle both old format (with dashes) and new format (with spaces)
                          const isSelected = selectedProgram === storageKey || 
                                           selectedProgram === prog ||
                                           selectedProgram.replace(/-/g, ' ').toUpperCase() === displayName.toUpperCase();
                          
                          return (
                            <button
                              key={prog}
                              onClick={() => {
                                setSelectedProgram(storageKey);
                                navigate("/program");
                              }}
                              className={`w-full px-3 py-2 rounded-md text-sm transition-colors ${
                                isSelected
                                  ? "bg-[#1C4F06]/30 text-[#064F32]"
                                  : "text-gray-600 hover:text-[#064F32] hover:bg-[#064F32]/5"
                              }`}
                            >
                              {displayName}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No sections assigned
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            )}
            {menuItems
              .filter((item) => item.roles.includes(user?.role))
              .filter(
                (item) => !(user?.role === "prof" && item.label === "Program")
              )
              .map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `group flex items-center ${
                          isCollapsed ? "justify-center" : "gap-3"
                        } px-3 py-3 rounded-lg font-medium text-[15px] transition-colors ${
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
                          {item.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {item.description}
                            </p>
                          )}
                        </div>
                      )}
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