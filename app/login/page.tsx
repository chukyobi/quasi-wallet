"use client";
import { useState } from "react";
import LoginButtons from "../../components/LoginButtons";
import {
  LockClosedIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setError(result.error);
    } else if (result) {
      window.location.href = "/dashboard";
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="absolute w-16 h-16 bg-green-500 rounded-full bottom-20 right-16 blur-lg opacity-75"></div>
      <div className="absolute w-20 h-20 bg-yellow-400 rounded-full top-10 left-10 blur-lg opacity-75"></div>
      
      <div className="w-full max-w-4xl bg-transparent rounded-3xl shadow-2xl flex">
        {/* Left Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center items-center bg-gray-100">
          <div className="mb-8 text-center">
            <h1 className="text-lg font-bold text-gray-800">Current Balance</h1>
            <p className="text-3xl font-semibold text-yellow-500">$24,359</p>
          </div>
          <div className="mb-8 text-center justify-center bg-white py-8 px-10">
            <span className="mt-4 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white text-lg">
              +
            </span>
            <h2 className="text-lg font-bold text-gray-800">New Wallet</h2>
            <p className="text-xs text-gray-500">
              Secure <span className="text-yellow-500">seed</span>-phrase
            </p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center">
              <div className="text-2xl text-gray-800 font-bold">34%</div>
              <div className="text-xs text-gray-500">Food</div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-8">
          <h1 className="text-3xl font-semibold text-gray-50 mb-4">
            Welcome <span className="text-green-500">Back!</span>
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Start managing your finances faster and better
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <span className="flex w-full px-4 py-3 rounded-lg gap-2 bg-gray-100 border-gray-50 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300">
                <EnvelopeIcon className="w-5 h-6 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 border-none outline-none text-sm focus:outline-none focus:ring-0"
                />
              </span>
            </div>

            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <span className="flex w-full px-4 py-3 rounded-lg gap-2 bg-gray-100 border-gray-50 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300">
                <LockClosedIcon className="w-5 h-6 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 border-none outline-none text-sm focus:ring-0 flex-1"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="ml-auto text-gray-500 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-6" />
                  ) : (
                    <EyeIcon className="w-5 h-6" />
                  )}
                </button>
              </span>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-right text-sm">
              <a href="#" className="text-yellow-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
              >
                Login
              </button>
            </div>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <LoginButtons />

          <p className="text-center text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a href="/register" className="text-green-500 font-semibold">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
