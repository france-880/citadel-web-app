import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
        <img 
            src="/images/logo.png" 
            alt="UCC Logo" 
            className="object-contain"
            style={{ width: '100px', height: 'auto', maxWidth: '100%' }}
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Check your email
        </h1>

        {/* Message */}
        <div className="text-center text-gray-600 mb-6">
          <p className="mb-2">
            A password reset email has been sent to your registered address.
          </p>
          {email && (
            <p className="font-semibold text-[#064F32] mb-2">
              {email}
            </p>
          )}
          <p>
            Follow the instructions in the email to reset your password.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> If you don't see the email in your inbox, please check your spam or junk folder.
          </p>
        </div>

        {/* Back to Login Button */}
        <button
          onClick={handleBackToLogin}
          className="w-full bg-[#064F32] text-white py-3 rounded-lg hover:bg-[#053d27] transition-colors font-medium"
        >
          Back to Login
        </button>

        {/* Resend Email Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Didn't receive the email?{' '}
            <button
              onClick={() => window.history.back()}
              className="text-[#064F32] font-semibold hover:underline"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

