// pages/api/resendOtp.ts
import { NextApiRequest, NextApiResponse } from "next";
import { generateAndSendOtp } from "@/utils/generateAndSendOtp";

export default async function resendOtp(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const result = await generateAndSendOtp(email);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in resendOtp API:", error.message);
    return res.status(500).json({ message: error.message });
  }
}
