import React from "react";

const SignupPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0B1D39] to-[#1A73E8] relative overflow-hidden">
      {/* Subtle diagonal lines background */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:40px_40px]"></div>

      {/* ERP Logo */}
      <div className="absolute top-6 left-8 text-2xl font-bold text-white z-10">
        ERP
      </div>

      {/* Left Illustration */}
      <div className="hidden md:flex flex-1 items-center justify-center text-white relative z-10">
        <div className="max-w-md text-center px-6">
          <h2 className="text-3xl font-semibold mb-4 text-indigo-200">
            Manufacturing + Teamwork
          </h2>
          <p className="text-lg text-amber-200">
            Collaborate, plan, and execute your production seamlessly with ERP.
          </p>
        </div>
      </div>

      {/* Right Signup Form */}
      <div className="flex flex-1 items-center justify-center relative z-10">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account 🚀
          </h2>

          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            />
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            />
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            />

            {/* Role Dropdown */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              defaultValue=""
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="manager">Manager</option>
              <option value="operator">Operator</option>
              <option value="inventory">Inventory</option>
              <option value="admin">Admin</option>
            </select>

            {/* Primary Sign Up Button */}
            <button
              type="submit"
              className="bg-[#1A73E8] text-white py-3 rounded-lg font-medium hover:bg-[#00BFA6] transition-colors"
            >
              Sign Up
            </button>
          </form>

          {/* Links */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="#" className="text-[#1A73E8] hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
