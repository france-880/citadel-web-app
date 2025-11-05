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
  const [passwordError, setPasswordError] = useState(''); // Stores password error message
  const [emailError, setEmailError] = useState(''); // Stores email/username error message

  // Function to handle form submission
  const handle = async (e) => {
    e.preventDefault(); // Prevents page reload when submitting the form
    setPasswordError(''); // Clear previous errors
    setEmailError(''); // Clear previous errors
    
    // Validate if both fields are empty
    if (!email.trim() && !password.trim()) {
      setEmailError('Username is required.');
      setPasswordError(' Password is required.');
      return;
    }
    
    // Validate if password is empty when username has value
    if (email.trim() && !password.trim()) {
      setPasswordError('The password field is required.');
      return;
    }
    
    try {
      await login(email, password); // Calls the login function from AuthContext
    } catch (err) {
      // Get error message and type from backend
      const errorMessage = err?.response?.data?.message || 'Login failed';
      const errorType = err?.response?.data?.error_type || '';
      
      // Display error message based on error type from backend
      if (errorType === 'password') {
        // Username exists but password is wrong
        setPasswordError(errorMessage);
      } else if (errorType === 'username') {
        // Username doesn't exist but password might be correct
        setEmailError(errorMessage);
      } else if (errorType === 'both') {
        // Both username and password are wrong - show error on password field and red border on both
        setPasswordError(errorMessage);
        setEmailError(' '); // Set space to trigger red border on username field without showing error message
      } else {
        // Fallback: show generic error on password field if it seems like both are wrong
        // Check if error message mentions both username and password
        if (errorMessage.toLowerCase().includes('username') && errorMessage.toLowerCase().includes('password')) {
          setPasswordError(errorMessage);
          setEmailError(' '); // Set space to trigger red border on username field without showing error message
        } else {
          setEmailError(errorMessage);
        }
      }
    }
  };

  // Clear password error when password changes
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  // Clear email error when email changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  return (
    // Main container for login layout - full screen
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      {/* Wrapper for two-column layout (banner panel + form panel) - full width */}
      <div className="w-full h-screen bg-white overflow-hidden grid md:grid-cols-[1fr_1.5fr]">

        {/* LEFT SIDE: Banner Panel with USC Banner Image */}
        <div 
          className="hidden md:flex relative overflow-hidden h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/banner.jpg)'
          }}
        >
          {/* Overlay gradient with green tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#064F32]/85 to-[#064F32]/95" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-10 w-full">
            {/* Logo/Top Section */}
            <div>
              <img className="w-20 h-auto mb-8" src="/images/ucc.png" alt="Logo" />
            </div>

            {/* Welcome Text */}
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-2 leading-tight">
                WELCOME
              </h1>
              <div className="w-20 h-0.5 bg-white mb-4"></div>
              <h2 className="text-2xl font-light mb-6">
                To Academic Management
              </h2>
              <p className="text-white/90 text-base leading-relaxed max-w-md">
                Access your academic management portal to manage students, track attendance, and oversee academic records. Sign in to continue your work.
              </p>
            </div>

            {/* Footer tagline */}
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-[#FF7A00]"></span>
              Secure. Reliable. Fast.
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form Panel */}
        <div className="relative p-8 md:p-12 bg-white h-full flex items-center">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 overflow-hidden w-64 h-64 pointer-events-none">
            <div className="absolute top-8 right-8 w-32 h-32 bg-[#064F32]/10 rounded-full"></div>
            <div className="absolute top-16 right-16 w-24 h-24 bg-[#064F32]/5 rounded-full"></div>
            <div className="absolute top-24 right-24 w-16 h-16 bg-[#064F32]/10 rounded-full"></div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-md">
            {/* Form heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
              <p className="text-gray-600 text-sm">
                Enter your credentials to access your account
              </p>
            </div>

            {/* EMAIL / USERNAME FIELD */}
            <div className="mb-5">
              <input
                type="text"
                value={email}
                onChange={handleEmailChange}
                placeholder="Username"
                className={`w-full p-4 border text-gray-800 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 transition-all placeholder:text-gray-400 ${
                  emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-300'
                }`}
              />
              {/* Error message below email/username field */}
              {emailError && emailError.trim() && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className={`w-full p-4 border text-gray-800 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 transition-all placeholder:text-gray-400 ${
                  password.length > 0 ? 'pr-12' : ''
                } ${
                  passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-gray-300'
                }`}
              />
              {/* Show/Hide Password Button - Only show when password has value */}
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#064F32] transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              )}
              {/* Error message below password field */}
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex items-center justify-end mb-8">
              <Link
                to="/forgot-password"
                className="text-sm text-[#064F32] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={handle}
              className="w-full bg-[#064F32] text-white p-4 rounded-lg font-semibold hover:bg-[#053d25] focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 transition-all shadow-md hover:shadow-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
