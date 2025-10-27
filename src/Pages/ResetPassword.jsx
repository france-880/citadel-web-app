import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams(); // kukunin token sa URL (hal. /reset-password/:token)
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        window.location.href = '/login';
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
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={searchParams.get('email') !== null}
          required
        />

        {/* New Password with Show/Hide */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full border p-2 rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password with Show/Hide */}
        <div className="relative mb-3">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full border p-2 rounded pr-10"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Match Indicator */}
        {password && passwordConfirmation && (
          <div className={`text-xs mb-3 ${password === passwordConfirmation ? 'text-green-600' : 'text-red-600'}`}>
            {password === passwordConfirmation ? '✓ Passwords match' : '✗ Passwords do not match'}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reset Password
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
