import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams(); // kukunin token sa URL (hal. /reset-password/:token)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-populate email from URL query parameter
  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation check
    if (!token) {
      toast.error("Invalid reset link. Token is missing.");
      return;
    }
    
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    try {
      console.log('Sending reset password request:', { email, token: token.substring(0, 10) + '...' });
      
      const res = await api.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      setMessage(res.data.message);
      toast.success("Password reset successfully!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Reset password error:', error.response?.data);
      
      if (error.response) {
        // Handle validation errors (422)
        if (error.response.status === 422 && error.response.data.errors) {
          const validationErrors = error.response.data.errors;
          const firstError = Object.values(validationErrors)[0][0];
          setMessage(firstError);
          toast.error(firstError);
        } else {
          const errorMessage = error.response.data.error || error.response.data.message || "Reset failed.";
          setMessage(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        setMessage("Server error.");
        toast.error("Server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/images/ucc.png" 
            alt="UCC Logo" 
            className="h-20 w-20 object-contain"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-900">Reset Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Create a new password for your account.
        </p>

        {/* New Password with Show/Hide */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password with Show/Hide */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Password Match Indicator */}
        {password && passwordConfirmation && (
          <div className={`text-sm mb-4 p-3 rounded-lg ${
            password === passwordConfirmation 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {password === passwordConfirmation ? '✓ Passwords match' : '✗ Passwords do not match'}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#064F32] text-white py-3 rounded-lg hover:bg-[#053d27] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || (password !== passwordConfirmation)}
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
            {message}
          </p>
        )}

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-[#064F32] font-semibold hover:underline"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
