import { Toaster } from "react-hot-toast";

export default function GlobalProvider({ children }) {
  return (
    <>
      {children}
      {/* Toaster available sa buong app */}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
