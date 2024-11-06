import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type VerifyProps = {
  email: string;
};

export default function Verify({ email }: VerifyProps) {
  const [otp, setOtp] = useState(Array(5).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [codeExpired, setCodeExpired] = useState(false);
  const router = useRouter();

  // Initialize or retrieve the countdown timer
  useEffect(() => {
    const endTime = localStorage.getItem("otpEndTime");

    if (endTime) {
      const remainingTime = Math.floor((new Date(endTime).getTime() - Date.now()) / 1000);
      setTimer(Math.max(remainingTime, 0));
      setCodeExpired(remainingTime <= 0);
    } else {
      const newEndTime = new Date(Date.now() + 30 * 60 * 1000);
      localStorage.setItem("otpEndTime", newEndTime.toString());
      setTimer(30 * 60);
    }

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

  // const handleResendCode = async () => {
  //   setError("");
  //   try {
  //     await axios.post("/api/auth/resendOtp", { email });
  //     const newEndTime = new Date(Date.now() + 15 * 60 * 1000);
  //     localStorage.setItem("otpEndTime", newEndTime.toString());
  //     setTimer(15 * 60);
  //     setCodeExpired(false);
  //   } catch (err) {
  //     setError("Failed to resend OTP. Please try again.");
  //   }
  // };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.slice(-1);
    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const otpString = otp.join("");
      const response = await axios.post("/api/auth/verifyOtp", { otp: otpString });
      if (response.status === 200) {
        localStorage.removeItem("otpEndTime");
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
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
              // onClick={handleResendCode}
              className="text-blue-500 underline"
              disabled={!codeExpired && timer > 0}
            >
              Resend code
            </button>
          </p>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
