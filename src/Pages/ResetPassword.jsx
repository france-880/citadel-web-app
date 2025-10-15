import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams(); // kukunin token sa URL (hal. /reset-password/:token)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage(res.data.message);
      toast.success("Password reset successfully!");
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || "Reset failed.";
        setMessage(errorMessage);
        toast.error(errorMessage);
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
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 rounded mb-3"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />

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
