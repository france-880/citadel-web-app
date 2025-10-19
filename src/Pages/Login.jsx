// Import necessary dependencies
import { useState } from "react"; // For managing component state (email, password, etc.)
import { Eye, EyeOff } from "lucide-react"; // Icons for showing/hiding password
import { useAuth } from '../Context/AuthContext'; // Custom authentication context for login handling
import { Link } from "react-router-dom"; // For navigation (e.g., Forgot Password link)

// Login component
export default function Login() {
  // Destructure the login function from authentication context
  const { login } = useAuth();

  // State variables for user input and password visibility
  const [email, setEmail] = useState(''); // Stores the entered email/username
  const [password, setPassword] = useState(''); // Stores the entered password
  const [showPassword, setShowPassword] = useState(false); // Toggles password visibility

  // Function to handle form submission
  const handle = async (e) => {
    e.preventDefault(); // Prevents page reload when submitting the form
    try {
      await login(email, password); // Calls the login function from AuthContext
    } catch (err) {
      // Displays error message if login fails
      alert(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    // Main container for login layout
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center py-8 px-4">
      {/* Wrapper for two-column layout (brand panel + form panel) */}
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT SIDE: Brand/Design Panel (visible only on medium screens and above) */}
        <div className="hidden md:flex flex-col justify-between bg-[#064F32] p-10">
          {/* Logo */}
          <div>
            <img className="w-16 h-auto" src="/images/ucc.png" alt="Logo" />
          </div>

          {/* Branding text */}
          <div>
            <h1 className="text-white text-3xl font-semibold leading-tight">
              Sign In
            </h1>
            <p className="text-white/80 mt-2 text-xl">
              Academic Management Module
            </p>
          </div>

          {/* Footer tagline */}
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-[#FF7A00]"></span>
            Secure. Reliable. Fast.
          </div>
        </div>

        {/* RIGHT SIDE: Login Form Panel */}
        <div className="p-8 md:p-10">
          <div className="mx-auto w-full max-w-sm">

            {/* Form heading */}
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-[#064F32]">Welcome back</h2>
              <p className="text-gray-600 text-sm mt-1">Sign in to continue</p>
            </div>

            {/* EMAIL / USERNAME FIELD */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Updates email state
                placeholder="Enter your username or email"
                className="w-full p-3 border text-black border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 transition-all"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="mb-2 relative">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"} // Toggle text/password based on state
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Updates password state
                placeholder="Enter your password"
                className="w-full p-3 border text-black border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 transition-all pr-10"
              />
              {/* Show/Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                className="absolute right-3 top-[46px] text-gray-600 hover:text-[#064F32] transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} /> // Hide icon
                ) : (
                  <Eye size={20} /> // Show icon
                )}
              </button>
            </div>

            {/* REMEMBER ME + FORGOT PASSWORD */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#064F32] focus:ring-[#064F32]/30"
                />
                Remember me
              </label>
              {/* Forgot password link */}
              <Link
                to="/forgot-password"
                className="text-sm text-[#FF7A00] hover:opacity-80"
              >
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={handle} // Calls handle() on click
              className="w-full bg-[#FF7A00] text-white p-3 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 transition-all"
            >
              Sign in
            </button>

            {/* Terms and Privacy Policy Note */}
            <div className="mt-6 text-center text-xs text-gray-500">
              By signing in you agree to our Terms and Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
