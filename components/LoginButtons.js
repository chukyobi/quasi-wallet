"use client"; 

import { signIn } from "next-auth/react";

export default function LoginButtons() {
  return (
    <div>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
    </div>
  );
}