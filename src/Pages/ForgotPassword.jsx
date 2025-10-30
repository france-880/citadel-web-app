import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/forgot-password", { email });
      setMessage(res.data.message);
      toast.success("Reset link sent successfully!");
      // Navigate to CheckEmail page with email data
      navigate('/check-email', { state: { email } });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/images/ucc.png" 
            alt="UCC Logo" 
            className="h-20 w-20 object-contain"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-900">Forgot Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 outline-none"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        
        <button 
          type="submit" 
          className="w-full bg-[#064F32] text-white py-3 rounded-lg hover:bg-[#053d27] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        
        {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
        
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