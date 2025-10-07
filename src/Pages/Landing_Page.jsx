import { useState } from "react";
import { Download, QrCode, Check, Mail, Phone } from "lucide-react";

export default function Landing_Page() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-orange-600">Citadel</h1>
          <ul className="flex gap-6 text-lg">
            <li>
              <a href="#home" className="hover:text-orange-600">Home</a>
            </li>
            <li>
              <a href="#features" className="hover:text-orange-600">Features</a>
            </li>
            <li>
              <a href="#download" className="hover:text-orange-600">Download</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-orange-600">Contact</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section
  id="home"
  className="min-h-screen flex items-center bg-gradient-to-br from-orange-500 to-orange-700 text-white pt-20"
>
  <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center px-6">
    {/* Left: Text */}
    <div className="text-left text-5xl">
      <h2 className="text-black text-5xl md:text-5xl font-bold mb-4">
        Campus Identity Tracking and Attendance with Digital Entry Log
      </h2>
      <p className="text-black text-lg mb-8">
        Secure, fast, and reliable communication at your fingertips.
      </p>
      <a
        href="#download"
        className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition"
      >
        Get Started
      </a>
    </div>

    {/* Right: Image */}
    <div className="flex justify-center">
      <img
        src="/images/ucc.png"
        alt="Hero Illustration"
        className="rounded-xl shadow-lg"
      />
    </div>
  </div>
</section>


      {/* Download */}
      <section id="download" className="py-20 bg-white text-center">
        <h3 className="text-3xl font-bold mb-12 relative inline-block">
          Download the App
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-orange-500"></span>
        </h3>
        <div className="flex justify-center gap-8 flex-wrap">
          <a
            href="#"
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition"
          >
            <Download className="w-5 h-5" /> Google Play
          </a>
          <a
            href="#"
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition"
          >
            <QrCode className="w-5 h-5" /> App Store
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="container mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-12">Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {["Fast Messaging", "Secure Connection", "Cross Platform"].map(
              (feature, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                >
                  <Check className="w-10 h-10 text-orange-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">{feature}</h4>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-12">Why Choose Citadel?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Reliable", desc: "99.9% uptime guarantee" },
              { title: "Secure", desc: "End-to-end encryption" },
              { title: "Easy to Use", desc: "Intuitive design and interface" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
              >
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">
            Contact Us
          </h3>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
            <form onSubmit={handleSubmit} className="grid gap-6">
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
              />
              <button
                type="submit"
                className="bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Citadel App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
