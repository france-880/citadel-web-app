import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Debug: Log user data
  console.log('Header - User data:', user);

  // ✅ Avatar generation functions (like mobile app)
  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === "" || fullName === "Guest" || fullName === "Unknown User") return "?";
    
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) {
      // Single name: take first 2 letters
      return parts[0].substring(0, parts[0].length >= 2 ? 2 : 1).toUpperCase();
    } else {
      // Multiple names: take first letter of first and last name
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
  };

  const getColorForName = (fullName) => {
    const avatarColors = [
      "#6366F1", // Indigo
      "#EC4899", // Pink
      "#8B5CF6", // Purple
      "#06B6D4", // Cyan
      "#10B981", // Green
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#3B82F6", // Blue
      "#14B8A6", // Teal
      "#F97316", // Orange
    ];

    if (!fullName || fullName === "" || fullName === "Guest" || fullName === "Unknown User") {
      return avatarColors[0];
    }

    // Use sum of character codes to get consistent color
    let sum = 0;
    for (let i = 0; i < fullName.length; i++) {
      sum += fullName.charCodeAt(i);
    }

    return avatarColors[sum % avatarColors.length];
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-[#064F32] shadow-md flex items-center justify-between px-6 z-50">
      <div className="flex items-center text-ml font-semibold">
        <img src="/images/logo.png" alt="University Logo" className="w-[70px] h-[70px]" />
        <h4 className="text-xl font-bold font-montserrat text-white tracking-wide">CITADEL</h4>
      </div>

      <div className="relative flex items-center gap-4">  
        <div className="flex items-center">
          {user?.profileImage && user.profileImage !== "/api/placeholder/150/150" ? (
            <img 
              className="h-10 w-10 rounded-full mr-3 object-cover" 
              src={user.profileImage} 
              alt="User" 
            />
          ) : (
            <div 
              className="h-10 w-10 rounded-full mr-3 flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: getColorForName(user?.fullname || "Guest") }}
            >
              {getInitials(user?.fullname || "Guest")}
            </div>
          )}
          <div className="text-white">
            <div className="font-medium text-sm">
              {user?.fullname && user.fullname !== 'Unknown User' ? user.fullname : "Guest"}
            </div>
            <div className="text-xs text-gray-300">
              {user?.role ? user.role.replace('_', ' ').toUpperCase() : "GUEST"}
            </div>
          </div>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="ml-2 focus:outline-none">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <ul className="py-1">
              <li>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }} 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}