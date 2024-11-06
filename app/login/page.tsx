"use client";
import { useState, useEffect } from "react";
import LoginButtons from "../../components/LoginButtons";
import {
  LockClosedIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const slides = [
  { src: "/assets/slide4.jpg", text: "Smartest Way to Save Crypto" },
  { src: "/assets/slide5.jpg", text: "Track Your Finances Effortlessly!" },
  { src: "/assets/slide6.jpg", text: "Secure Your Investments Today!" },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setError(result.error);
    } else if (result) {
      router.push("/dashboard");  
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="absolute w-16 h-16 bg-green-500 rounded-full bottom-20 right-16 blur-lg opacity-75"></div>
      <div className="absolute w-20 h-20 bg-yellow-400 rounded-full top-10 left-10 blur-lg opacity-75"></div>

      <div className="w-full max-w-4xl bg-transparent rounded-3xl shadow-2xl flex">
        {/* Left Section */}
        <div className=" md:flex w-1/2 relative overflow-hidden">
          {/* Floating Card */}
          <div className="absolute top-10 left-[-80px] bg-white shadow-xl rounded-lg p-6 w-60 h-40 transform transition-transform duration-300 hover:translate-x-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Secure Blockchain</h2>
            <p className="text-gray-600 text-sm">
              Experience enhanced security and efficiency with our blockchain solutions.
            </p>
          </div>

          {/* Image Slider */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={slides[currentSlide].src}
              alt="Slide Image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-500 opacity-30"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-end text-white text-center p-4 pb-10">
              <h1 className="text-2xl font-bold mb-2">{slides[currentSlide].text}</h1>
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

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-semibold text-gray-50 mb-4">
            Welcome <span className="text-green-500">Back!</span>
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Start managing your finances faster and better
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <span className="flex w-full px-4 py-3 rounded-lg gap-2 bg-gray-100 border-gray-50 text-gray-800">
                <EnvelopeIcon className="w-5 h-6 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 text-sm"
                />
              </span>
            </div>

            {/* Password Input */}
            <div>
              <span className="flex w-full px-4 py-3 rounded-lg gap-2 bg-gray-100 border-gray-50 text-gray-800">
                <LockClosedIcon className="w-5 h-6 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 text-sm flex-1"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="ml-auto text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-6" /> : <EyeIcon className="w-5 h-6" />}
                </button>
              </span>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-right text-sm">
              <a href="#" className="text-yellow-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
              Login
            </button>
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
