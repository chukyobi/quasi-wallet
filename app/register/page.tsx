"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import LoginButtons from "../../components/LoginButtons";
import {
  LockClosedIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

// Sample images for the slider
const slides = [
  {
    src: "/assets/slide4.jpg",
    text: "Smartest Way to Save Crypto",
  },
  {
    src: "/assets/slide5.jpg",
    text: "Track Your Finances Effortlessly!",
  },
  {
    src: "/assets/slide6.jpg",
    text: "Secure Your Investments Today!",
  },
];

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

  const [currentSlide, setCurrentSlide] = useState(0);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        // Sign in the user after successful signup
        const signInResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (signInResult?.ok) {
          window.location.href = "/dashboard"; // Redirect to dashboard after successful login
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
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

    // Function to change to the next slide
    const nextSlide = () => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };
  
    // Effect for automatic sliding
    useEffect(() => {
      const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
      return () => clearInterval(interval); // Clear interval on unmount
    }, []);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="absolute w-16 h-16 bg-green-500 rounded-full bottom-20 right-16 blur-lg opacity-75"></div>
      <div className="absolute w-20 h-20 bg-yellow-400 rounded-full top-10 left-10 blur-lg opacity-75"></div>

      <div className="w-full max-w-4xl bg-transparent rounded-3xl shadow-2xl flex flex-col md:flex-row">
        {/* Left Section */}

        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-semibold text-gray-50 mb-4">
            Welcome To <span className="text-green-500">Wallet!</span>
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Start managing your finances faster and better
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="sr-only" htmlFor="name">
                Name
              </label>
              <span className="flex w-full px-4 py-3 rounded-lg gap-2 bg-gray-100">
                <UserIcon className="w-5 h-6 text-gray-500" />
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-gray-500 bg-gray-100 border-none outline-none text-sm"
                  required
                />
              </span>
            </div>

            <div>
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <span className="flex w-full px-4 py-3 rounded-lg gap-2 bg-gray-100">
                <EnvelopeIcon className="w-5 h-6 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-gray-500 bg-gray-100 border-none outline-none text-sm"
                  required
                />
              </span>
            </div>

            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
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
                  className={`bg-gray-100 border-none outline-none text-gray-500 text-sm ${
                    !isValidPassword && password ? "border-red-500" : ""
                  }`}
                  required
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
              {!isValidPassword && password && (
                <p className="text-red-500 text-xs">
                  Password must be at least 8 characters long and include a
                  capital letter, number, and special character.
                </p>
              )}
            </div>

            <div>
              <label className="sr-only" htmlFor="confirmPassword">
                Confirm Password
              </label>
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
                  className={`bg-gray-100 border-none outline-none text-gray-500 text-sm ${
                    !isValidConfirmPassword && confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="ml-auto text-gray-500 focus:outline-none"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-6" />
                  ) : (
                    <EyeIcon className="w-5 h-6" />
                  )}
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
                disabled={!isValidPassword || !isValidConfirmPassword}
              >
                Sign Up
              </button>
            </div>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <LoginButtons />

          <p className="text-center text-xs text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-green-500 font-semibold">
              Sign In
            </a>
          </p>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden">
          {/* Image Slider */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={slides[currentSlide].src}
              alt="Slide Image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-500 opacity-30"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-end text-white text-center p-4 pb-10">
              {" "}
              {/* Adjusted padding to position text lower */}
              <h1 className="text-2xl font-bold mb-2">
                {" "}
                {/* Added margin bottom to stack texts */}
                {slides[currentSlide].text}
              </h1>
            </div>
          </div>

          {/* Pagination Indicators */}
          <div className="absolute bottom-4 left-1/2 w-9 h-2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-gray-300"
                } transition`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}