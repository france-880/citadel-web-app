import { useState } from "react";
import { useAuth } from '../Context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handle = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Brand Panel */}
        <div className="hidden md:flex flex-col justify-between bg-[#064F32] p-10">
          <div>
            <img className="w-16 h-auto" src="/images/ucc.png" alt="Logo" />
          </div>
          <div>
            <h1 className="text-white text-3xl font-semibold leading-tight">
              Sign In
            </h1>
            <p className="text-white/80 mt-2 text-xl">
                 Academic Management Module
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-[#FF7A00]"></span>
            Secure. Reliable. Fast.
          </div>
        </div>

        {/* Form Panel */}
        <div className="p-8 md:p-10">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-[#064F32]">Welcome back</h2>
              <p className="text-gray-600 text-sm mt-1">Sign in to continue</p>
            </div>

            {/* Email / Username */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your username or email"
                className="w-full p-3 border text-black border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 transition-all"
              />
            </div>

            {/* Password */}
            <div className="mb-2 relative">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border text-black border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 focus:border-[#064F32]/60 transition-all pr-10"
              />
              <img
                src={showPassword ? "/images/hide.png" : "/images/show.png"}
                alt={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="w-5 h-5 absolute right-3 top-[46px] opacity-70 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-[#064F32]  focus:ring-[#064F32]/30" />
                Remember me
              </label>
              <a href="#" className="text-sm text-[#FF7A00] hover:opacity-80">Forgot password?</a>
            </div>

            <button
              onClick={handle}
              className="w-full bg-[#FF7A00] text-white p-3 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#064F32]/30 transition-all"
            >
              Sign in
            </button>

            <div className="mt-6 text-center text-xs text-gray-500">
              By signing in you agree to our Terms and Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
