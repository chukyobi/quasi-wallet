"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { parse } from 'cookie';

export default function Verify() {
  const [otp, setOtp] = useState(Array(5).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(15 * 60); // 15 minutes in seconds
  const [codeExpired, setCodeExpired] = useState(false);
  const router = useRouter();

  const getEmailFromCookies = () => {
    if (typeof document === "undefined") return ""; 
    const cookies = document.cookie;
    console.log("Cookies: ", cookies); // Log cookies
    const parsedCookies = parse(cookies);
    console.log("Parsed Cookies: ", parsedCookies); // Log parsed cookies
    const userData = parsedCookies.userData ? JSON.parse(parsedCookies.userData) : null;
    return userData ? userData.email : "your email"; 
};


  const email = getEmailFromCookies(); 

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(-1); 
    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });
  };

  // Countdown timer effect
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setCodeExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Resend OTP function
  const handleResendCode = async () => {
    setError(""); // Clear previous errors
    try {
      await axios.post("/api/auth/resendOtp", { email }); 
      setTimer(15 * 60); 
      setCodeExpired(false); 
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  // Handle OTP submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const otpString = otp.join("");
      const response = await axios.post("/api/auth/verifyOtp", { otp: otpString });
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    }
  };

  // Format timer as MM:SS
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timer % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="bg-white text-gray-700 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Verify Your OTP</h1>
        <p className="text-sm text-gray-500 mb-4">
          We've sent a code to the email: <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* OTP input fields */}
          <div className="flex space-x-2 mb-4">
            {otp.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(e, index)}
                className="w-12 h-12 border border-gray-300 rounded text-center text-xl font-semibold"
                required
              />
            ))}
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Countdown timer */}
          <p className="text-sm text-gray-500 mb-4">
            {codeExpired ? (
              "Code expired. Request a new one."
            ) : (
              <>Code expires in: <span className="font-semibold">{formatTimer()}</span></>
            )}
          </p>

          {/* Resend link */}
          <p className="text-sm text-gray-500 mb-4">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-blue-500 underline"
              disabled={!codeExpired && timer > 0} // Enable only if code expired or timer is active
            >
              Resend code
            </button>
          </p>

          {/* Submit button */}
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
