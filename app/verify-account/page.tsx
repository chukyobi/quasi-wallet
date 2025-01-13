"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(300); 
  const [codeExpired, setCodeExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCodeExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleResendCode = async () => {
    setError("");
    if (!email) {
      setError("Email is missing.");
      return;
    }

    try {
      await axios.post("/api/auth/resendOtp", { email });
      setTimer(300); 
      setCodeExpired(false);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtp(value.slice(0, 5)); 
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/verifyOtp", { otp, email });
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    }
  };

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60).toString().padStart(2, "0");
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
          <div className="mb-4">
            <input
              type="text"
              maxLength={5}
              value={otp}
              onChange={handleOtpChange}
              className="w-full h-12 border border-gray-300 rounded text-center text-xl font-semibold"
              placeholder="Enter OTP"
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <p className="text-sm text-gray-500 mb-4">
            {codeExpired ? (
              "Code expired. Request a new one."
            ) : (
              <>Code expires in: <span className="font-semibold">{formatTimer()}</span></>
            )}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-blue-500 underline"
              disabled={!codeExpired && timer > 0}
            >
              Resend code
            </button>
          </p>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full" disabled={codeExpired}>
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
