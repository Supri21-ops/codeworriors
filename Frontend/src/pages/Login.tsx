import React from "react";
import { FcGoogle } from "react-icons/fc";

const LoginPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#F5F7FA] relative">
      {/* Branding */}
      <div className="absolute top-6 left-8 text-2xl font-bold text-[#0B1D39]">
        ERP
      </div>

      {/* Left Illustration */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-500 to-teal-400 text-white">
        <div className="max-w-md text-center px-6">
          <h2 className="text-3xl font-semibold mb-4">Factory Workflow</h2>
          <p className="text-lg opacity-90">
            Visualize and manage your manufacturing process efficiently
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-6">
            Welcome Back 👋
          </h2>

          <form className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            />

            {/* Primary Login Button */}
            <button
              type="submit"
              className="bg-[#1A73E8] text-white py-3 rounded-lg font-medium hover:bg-[#00BFA6] transition-colors"
            >
              Login
            </button>

            {/* Google Login Button */}
            <button
              type="button"
              className="flex items-center justify-center border border-gray-300 bg-white py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              <FcGoogle className="mr-2" size={20} />
              Login with Google
            </button>
          </form>

          {/* Links */}
          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm text-[#1A73E8] hover:underline block mb-2"
            >
              Forgot Password?
            </a>
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <a href="#" className="text-[#1A73E8] hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
