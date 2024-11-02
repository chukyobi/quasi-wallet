"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import GoogleIcon from "../public/assets/icons/google.svg";
import GithubIcon from "../public/assets/icons/github.svg";

export default function LoginButtons() {
  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider);
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => handleSignIn("google")}
        className="w-1/2 py-2 border border-gray-500 rounded-lg text-gray-200 font-semibold flex items-center gap-2 justify-center"
        aria-label="Sign in with Google"
      >
        <Image src={GoogleIcon} alt="Google icon" width={18} height={18} />
        <span>Google</span>
      </button>

      <button
        onClick={() => handleSignIn("github")}
        className="w-1/2 py-2 border border-gray-500 rounded-lg text-gray-200 font-semibold flex items-center gap-2 justify-center"
        aria-label="Sign in with GitHub"
      >
        <Image src={GithubIcon} alt="GitHub icon" width={20} height={20} />
        <span>GitHub</span>
      </button>
    </div>
  );
}
