import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-[#064F32] shadow-md flex items-center justify-between px-6 z-50">
      <div className="flex items-center text-ml font-semibold">
        <img src="/images/ucc.png" alt="University Logo" className="w-[50px] h-[50px]" />
        <h4 className="text-xl ml-5 font-bold text-white">Citadel</h4>
      </div>

      <div className="relative flex items-center">
        <div className="flex items-center">
          <img className="h-10 w-10 rounded-full mr-3" src="/images/user.png" alt="User" />
          <span className="text-white font-medium">
            {user?.fullname || "Guest"}
          </span>
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