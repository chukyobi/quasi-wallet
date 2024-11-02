"use client";
import { useState } from "react";
import { signIn } from "next-auth/react"; // Optional for auto-login after signup
import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios"; // For making API requests

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform additional validation if necessary
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/signup", {
        email,
        name,
        password,
      });

      if (response.status === 201) {
        // Optionally sign in the user after signup
        await signIn("credentials", { email, password, redirect: false });
        window.location.href = "/dashboard"; // Redirect to dashboard after successful signup
      }
    } catch (err: unknown) {
      const error = err as any; // Use 'any' or a specific error type if you want
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const validatePassword = (password: string) => {
    setIsValidPassword(passwordRegex.test(password));
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    setIsValidConfirmPassword(confirmPassword === password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="w-full max-w-4xl bg-transparent rounded-3xl shadow-2xl flex">
        <div className="w-full p-8">
          <h1 className="text-3xl font-semibold text-gray-50 mb-4">Create Your Account</h1>
          <p className="text-gray-500 mb-8 text-sm">Start managing your finances faster and better</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="sr-only" htmlFor="name">Name</label>
              <span className="flex w-full px-4 py-3 rounded-lg gap-2 bg-gray-100">
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-100 border-none outline-none text-sm"
                  required
                />
              </span>
            </div>

            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <span className="flex w-full px-4 py-3 rounded-lg gap-2 bg-gray-100">
                <EnvelopeIcon className="w-5 h-6 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 border-none outline-none text-sm"
                  required
                />
              </span>
            </div>

            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <span className="flex w-full px-4 py-3 rounded-lg gap-2 bg-gray-100">
                <LockClosedIcon className="w-5 h-6 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`bg-gray-100 border-none outline-none text-sm ${!isValidPassword && password ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="ml-auto text-gray-500 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-6" /> : <EyeIcon className="w-5 h-6" />}
                </button>
              </span>
              {!isValidPassword && password && (
                <p className="text-red-500 text-xs">Password must be at least 8 characters long and include a capital letter, number, and special character.</p>
              )}
            </div>

            <div>
              <label className="sr-only" htmlFor="confirmPassword">Confirm Password</label>
              <span className="flex w-full px-4 py-3 rounded-lg gap-2 bg-gray-100">
                <LockClosedIcon className="w-5 h-6 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateConfirmPassword(e.target.value);
                  }}
                  className={`bg-gray-100 border-none outline-none text-sm ${!isValidConfirmPassword && confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="ml-auto text-gray-500 focus:outline-none"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="w-5 h-6" /> : <EyeIcon className="w-5 h-6" />}
                </button>
              </span>
              {!isValidConfirmPassword && confirmPassword && (
                <p className="text-red-500 text-xs">Passwords do not match.</p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
                disabled={!isValidPassword || !isValidConfirmPassword} // Disable button if validations fail
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
